import { AnalystAgent } from "./analyst.agent.js";

import { AnalystSchema } from "./analyst.schema.js";

export class AnalystService {
  static async process(text: string) {
    const result = await AnalystAgent.analyze(text);

    return AnalystSchema.parse(result);
  }
}
