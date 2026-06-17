import axios from "axios";

export class AIService {
  static async analyze(regulationId: string, text: string) {
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const response = await axios.post(`${aiUrl}/analyze`, {
      text,
    });

    return response.data;
  }
}
