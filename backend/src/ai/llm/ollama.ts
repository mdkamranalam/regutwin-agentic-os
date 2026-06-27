import ollama from "ollama";

export class OllamaClient {
  static async generate(prompt: string) {
    const response = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      options: {
        temperature: 0.1,
      },
    });

    return response.message.content;
  }
}
