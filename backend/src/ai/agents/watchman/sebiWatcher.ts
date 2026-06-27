import axios from "axios";
import * as cheerio from "cheerio";

export class SEBIWatcher {
  static async scan() {
    try {
      const url = "https://www.sebi.gov.in";

      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      const links: string[] = [];

      $("a").each((_, el) => {
        const href = $(el).attr("href");

        if (href && href.includes("pdf")) {
          links.push(href);
        }
      });

      return links;
    } catch (error) {
      console.error(error);

      return [];
    }
  }
}
