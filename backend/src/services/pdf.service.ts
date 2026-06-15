import fs from "fs";
import pdfParse from "pdf-parse";

export class PDFService {
  static async extractText(path: string) {
    const dataBuffer = fs.readFileSync(path);

    const result = await pdfParse(dataBuffer);

    return result.text;
  }
}
