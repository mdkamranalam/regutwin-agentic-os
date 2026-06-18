import axios from "axios";

export class AIService {
  static async analyze(regulationId: string, text: string, title: string, source: string) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const response = await axios.post(`${aiUrl}/analyze`, {
      text,
      regulation_id: regulationId,
      title,
      source
    });

    return response.data;
  }

  static async detectConflicts(regulationId: string, obligations: any[]) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const response = await axios.post(`${aiUrl}/detect-conflicts`, {
      regulation_id: regulationId,
      obligations,
    });

    return response.data;
  }

  static async runWorkflow(regulationId: string, text: string, title: string, source: string) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    // Increase timeout for full workflow
    const response = await axios.post(`${aiUrl}/run-workflow`, {
      text,
      regulation_id: regulationId,
      title,
      source
    }, { timeout: 300000 }); // 5 minute timeout

    return response.data;
  }

  static async validateMap(actionRequired: string, description: string, evidenceText: string) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const response = await axios.post(`${aiUrl}/validate-map`, {
      action_required: actionRequired,
      description,
      evidence_text: evidenceText,
    });

    return response.data;
  }
}
