import cron from "node-cron";
import MAP, { MapStatus, ValidationMethod } from "../models/map.model.js";
import Audit from "../models/audit.model.js";
import { AIService } from "../services/ai.service.js";
import { logger } from "../config/logger.js";
import axios from "axios";

/**
 * Autonomous MAP Validation Engine
 * Runs periodically in the background to validate OPEN MAPs automatically.
 */
export function initAutoValidator(): void {
  logger.info("[AutoValidator] Initializing Autonomous Validation Engine (running every 60s)...");

  cron.schedule("*/60 * * * * *", async () => {
    try {
      // Find OPEN MAPs configured for automatic validation (API_TEST or CONFIGURATION_CHECK)
      const openMaps = await MAP.find({
        status: { $in: [MapStatus.OPEN, MapStatus.IN_PROGRESS] },
        $or: [
          { validationMethod: ValidationMethod.API_TEST },
          { validationMethod: ValidationMethod.CONFIGURATION_CHECK },
          { targetApiEndpoint: { $exists: true, $ne: null } },
        ],
      });

      if (openMaps.length === 0) return;

      logger.info(`[AutoValidator] Scanning ${openMaps.length} autonomous MAP tasks for compliance validation...`);

      for (const mapTask of openMaps) {
        try {
          let evidenceText = "Auto-generated probe evidence";
          let isValid = false;
          let feedback = "";

          // Strategy 1: Live HTTP Probe (API_TEST)
          if (mapTask.targetApiEndpoint) {
            try {
              const probeRes = await axios({
                method: mapTask.testConfig?.method || "GET",
                url: mapTask.targetApiEndpoint,
                data: mapTask.testConfig?.payload ? JSON.parse(mapTask.testConfig.payload) : undefined,
                timeout: 5000,
                validateStatus: () => true, // resolve all status codes
              });

              evidenceText = `Probe HTTP ${probeRes.status} | Body: ${JSON.stringify(probeRes.data).slice(0, 300)}`;

              if (mapTask.testConfig?.expectedStatus) {
                isValid = probeRes.status === mapTask.testConfig.expectedStatus;
              } else {
                isValid = probeRes.status >= 200 && probeRes.status < 400;
              }

              if (mapTask.testConfig?.expectedResponseSubstring) {
                isValid = isValid && evidenceText.includes(mapTask.testConfig.expectedResponseSubstring);
              }

              feedback = isValid ? "Automated probe verified endpoint compliance." : `Probe returned HTTP ${probeRes.status}, expected ${mapTask.testConfig?.expectedStatus || "2xx"}`;
            } catch (probeErr: any) {
              evidenceText = `Probe connection error: ${probeErr.message}`;
              isValid = false;
              feedback = "Endpoint unreachable during automated probe.";
            }
          } else {
            // Strategy 2: AI Validation via AI Service
            const aiVal = await AIService.validateMap(
              mapTask.actionRequired,
              mapTask.description,
              `Autonomous evaluation against criteria: ${mapTask.acceptanceCriteria}`,
              mapTask.targetApiEndpoint,
              mapTask.testConfig
            );

            isValid = aiVal.is_valid;
            feedback = aiVal.feedback || (isValid ? "Criteria verified." : "Criteria unmet.");
            evidenceText = `AI Evaluation: ${feedback}`;
          }

          // Update MAP Result
          mapTask.lastValidationResult = {
            is_valid: isValid,
            confidence: 0.95,
            feedback,
            validated_at: new Date(),
          };

          if (isValid) {
            logger.info(`[AutoValidator] MAP '${mapTask._id}' verified complete. Closing task.`);
            mapTask.status = MapStatus.CLOSED;

            await Audit.create({
              mapId: mapTask._id,
              regulationId: mapTask.regulationId,
              action: "VALIDATED",
              previousStatus: MapStatus.OPEN,
              newStatus: MapStatus.CLOSED,
              evidenceText,
              validationResult: mapTask.lastValidationResult,
            });
          }

          await mapTask.save();
        } catch (taskErr: any) {
          logger.error(`[AutoValidator] Failed to auto-validate MAP ${mapTask._id}: ${taskErr.message}`);
        }
      }
    } catch (err: any) {
      logger.error(`[AutoValidator] Cycle error: ${err.message}`);
    }
  });
}
