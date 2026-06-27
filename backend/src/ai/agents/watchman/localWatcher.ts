import chokidar from "chokidar";

export class LocalWatcher {
  static watch(path: string, callback: (file: string) => void) {
    chokidar.watch(path).on("add", callback);
  }
}
