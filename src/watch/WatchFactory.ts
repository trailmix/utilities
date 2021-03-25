import { Watch } from 'trailmix/watch/mod.ts';
import type { Config } from 'trailmix/config/mod.ts';
import { unique } from 'trailmix/common/mod.ts';
export const REGEXP_UPDIR = /^(\.\.\/){1}([a-zA-Z0-9_\\\/-])*(\/){1}/;
// checks if the directory is a hidden updir
// hidden = '/.github/'
// hidden updir = '../.github/'
export const REGEXP_HIDDEN_UPDIR = /^(\.\.\/){1}([a-zA-Z0-9_\\\/-])*(\/\.){1}/;

import { fs, path, colors, v4 } from 'trailmix/deps.ts';
export default class WatchFactory {
  // #region properties
  public watchers: Array<Watch> = [];
  private config: Partial<Config> = {};
  private pagicConfigPath = '';
  private timeoutHandler: number | undefined;
  private changedPaths: string[] = [];
  private srcDir = '';
  private theme = '';
  private id = '';
  // #endregion
  public constructor(config: Partial<Config> = {}, pagicConfigPath: string) {
    this.id = v4.generate().substring(28, 36);
    this.init(config, pagicConfigPath);
  }
  // figures out srcDir, and theme location
  // if theme is not bundled will add a watcher to theme location
  public init(config: Partial<Config> = {}, pagicConfigPath: string) {
    this.config = config;
    // logger.info('watcher', `factory:${colors.red(this.id)}`, 'init', underline([this.srcDir, this.pagicConfigPath]));
    // construct watcher and optional theme watcher if theme is not bundled
    this.addWatcher([this.srcDir, this.pagicConfigPath]);
  }
  // add a watcher to the factory with a dir, file, or list of either. (this.watchers.push(dirs))
  // if providing a dir, you must end with '/.' for example './Pagic/.' or 'Pagic/.'
  // will check if watcher exists, but doesn't know if another watcher might share the file/dir
  public addWatcher(dirs: string | string[]) {
    if (this.watchers.filter((watcher) => watcher.watchDirs === (Array.isArray(dirs) ? dirs : [dirs])).length !== 1) {
      // logger.info('watcher', `factory:${colors.red(this.id)}`, 'addWatcher', `${underline(dirs)}`);
      this.watchers.push(new Watch(dirs));
    }
  }
  // remove all watchers in the factory (this.watchers.pop(all))
  public removeWatchers() {
    while (this.watchers.length) {
      this.watchers.pop();
    }
    // logger.info('watcher', `factory:${colors.red(this.id)}`, 'removeWatchers', `finalCount:${this.watchers.length}`);
  }
  // call watchers that have been init'ed to watch their dirs
  // pass in a callback to handle FsEvents in Pagic object.  ex: "rebuild"
  public async watch(callback: (status: string) => void) {
    this.pagicCallback = callback;
    this.watchers.forEach(async (watcher: Watch) => {
      for await (const event of watcher.watcher) {
        // handle the watcher event
        await this.handleEvent(event, watcher);
      }
    });
  }
  // watchers call this when an event occurs from watch
  // pass in an FsEvent and a PagicWatcher to handle and event that the watcher causes
  private async handleEvent(event: Deno.FsEvent, watcher: Watch) {
    // get original paths length
    const pathLength = this.changedPaths.length;
    // set changedPaths to new paths if they don't exist
    this.parseEventPaths(event.paths.map((eventPath: string) => path.relative(this.srcDir, eventPath))).forEach(
      (path) => {
        if (this.changedPaths.indexOf(path) === -1) this.changedPaths.push(path);
      },
    );
    switch (event.kind) {
      case 'any': // not sure what 'any' case applies to
        // logger.error('watcher', `${colors.red(this.id)}${colors.red(watcher.id)}`, event.kind, underline(event.paths));
        break;
      case 'create': // if a watched file is created, rebuild?
        // logger.info(watcher.id, event.kind, underline(event.paths));
        break;
      case 'access': // access shouldn't be tracked afaik
        break;
      case 'modify': // if a watched file is modified, reload
        break;
      case 'remove': // if a watched file is removed, reload
        break;
      default:
        // logger.error(watcher.id, 'unknown event', event.kind, underline(event.paths));
        break;
    }
    // if length changed, handle change
    if (unique(this.changedPaths).length !== pathLength) this.handleFileChange();
  }
  // use current changedPaths to call the pagicCallback to trigger a rebuild or reload
  private handleFileChange() {
    // this.changedPaths = unique([...this.changedPaths, ...filePaths]);
    clearTimeout(this.timeoutHandler);
    this.timeoutHandler = setTimeout(async () => {
      // loop through changed files
      for await (const changedPath of this.changedPaths) {
        // resolve changed path/dir
        const fullChangedPath = path.resolve(this.srcDir, changedPath);
        if (!fs.existsSync(fullChangedPath)) {
          // changed path/dir
          // logger.warn(`${changedPath} removed, start rebuild`);
          this.pagicCallback('rebuild');
          break;
        } else if (fullChangedPath.includes(this.pagicConfigPath)) {
          // changed config file
          this.pagicCallback('rebuild');
        } else if (Deno.statSync(fullChangedPath).isDirectory) {
          // changed file is a directory
          // logger.warn(`Directory ${colors.underline(changedPath)} changed, start rebuild`);
          this.pagicCallback('rebuild');
          break;
        }
      }
    }, 100);
  }
  // pass in list of paths, will output paths that pass include and exclude filters
  private parseEventPaths(eventPaths: string[]): string[] {
    let paths: string[] = [];
    // this.config.include?.forEach((glob: any) => {
    //   paths = eventPaths.filter(
    //     (eventPath) => path.globToRegExp(glob).test(eventPath) || path.globToRegExp(`${glob}/**`).test(eventPath),
    //   );
    // });
    // this.config.exclude?.forEach((glob: any) => {
    //   paths = eventPaths.filter(
    //     (eventPath) =>
    //       // if it matches exclude glob
    //       !path.globToRegExp(glob).test(eventPath) &&
    //       // if prefixed with ../somedir/ then ignore glob/** test and only check if hidden dir
    //       ((REGEXP_UPDIR.test(eventPath) && !REGEXP_HIDDEN_UPDIR.test(eventPath)) ||
    //         (!REGEXP_UPDIR.test(eventPath) && !path.globToRegExp(`${glob}/**`).test(eventPath))),
    //   );
    // });
    return paths;
  }
  // empty function for a callback to the Pagic object for watcher changes (rebuild/plugins)
  private pagicCallback: (status: string, path?: string) => void = () => {};
}
