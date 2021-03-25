// subclass to ingest env config format
// export default {
//   TRAILMIX_LOG_CONSOLE_FORMAT: 'string'
// }

import { default as NewConfig } from "trailmix/config/NewConfig.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";
// }
export default class EnvConfig extends NewConfig {
  public constructor(opts: ConfigOptions) {
    super(opts);
  }
}
