import { z } from "zod";

export const AnalystSchema = z.object({
  obligations: z.array(z.string()),

  deadlines: z.array(z.string()),

  affectedSystems: z.array(z.string()),

  policyChanges: z.array(z.string()),

  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

export type AnalystResult = z.infer<typeof AnalystSchema>;
