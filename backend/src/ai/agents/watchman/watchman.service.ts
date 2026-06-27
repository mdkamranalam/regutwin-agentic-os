import { RBIWatcher } from "./rbiWatcher.js";

import { SEBIWatcher } from "./sebiWatcher.js";

export class WatchmanService {
  static async monitor() {
    const rbi = await RBIWatcher.scan();

    const sebi = await SEBIWatcher.scan();

    console.log("RBI PDFs:", rbi.length);

    console.log("SEBI PDFs:", sebi.length);
  }
}
