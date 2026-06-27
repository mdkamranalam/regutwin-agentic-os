import { ANALYST_PROMPT } from "./analyst.prompt.js";

import { OllamaClient } from "../llm/ollama.js";

export class AnalystAgent {
  static async analyze(text: string) {
    const prompt = `
${ANALYST_PROMPT}

Regulation:

${text}
`;

    const response = await OllamaClient.generate(prompt);

    return JSON.parse(response);
  }
}
