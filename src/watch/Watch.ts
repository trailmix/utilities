import { resolve, v4 } from "trailmix/deps.ts";
// import { logger, underline } from 'test/utils/mod.ts';
export default class Watch {
  // #region properties
  // @ts-ignore
  public watcher: AsyncIterableIterator<Deno.FsEvent> = {};
  public watchDirs: string | string[] = "";
  public id = "";
  // #endregion

  public constructor(watchDirs: string | string[]) {
    this.id = v4.generate().substring(28, 36);
    // logger.success(this.id);
    this.watchDirs = watchDirs;
    try {
      // logger.success(this.id);
      this.watcher = this.watch();
      // logger.success('watcher', 'client', this.id.substring(28, 36), underline(this.watchDirs));
    } catch (e) {
      if (e.name === "NotFound") {
        // logger.error(
        //   'watcher',
        //   'client',
        //   this.id.substring(28, 36),
        //   underline(this.watchDirs),
        //   `<- These files were not found.`,
        // );
      } else {
        throw e;
      }
    }
  }

  public watch(): AsyncIterableIterator<Deno.FsEvent> {
    // logger.success(this.id);
    // logger.success('watcher', 'client', this.id.substring(28, 36), 'watching', underline(this.watchDirs));
    let ret: AsyncIterableIterator<Deno.FsEvent>;
    ret = Deno.watchFs(
      Array.isArray(this.watchDirs)
        ? this.watchDirs.map((dir) => resolve(dir))
        : resolve(this.watchDirs),
    );
    return ret;
  }
}
