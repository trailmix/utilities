// subclass to ingest string config format
// export default {
//   logConsoleFormat: 'string'
// }

import { default as NewConfig } from "trailmix/config/NewConfig.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";

// }
export default class StringConfig extends NewConfig {
  public constructor(opts: ConfigOptions) {
    super(opts);
  }
}
