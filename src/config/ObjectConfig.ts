// subclass to ingest object config format
// export default {
//   log: {
//     console: {
//       level: 'ERROR',
//       format: 'string',
//       color: true,
//     },
//     file:{
//       level: 'ERROR',
//       format: 'json',
//       path: '.'
//     }
//   }

import { default as NewConfig } from "trailmix/config/NewConfig.ts";
import { ConfigOptions } from "trailmix/config/Config.d.ts";

// }
export default class ObjectConfig extends NewConfig {
  public constructor(opts: ConfigOptions) {
    super(opts);
  }
}
