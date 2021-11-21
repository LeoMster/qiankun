// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '../plugin-initial-state/runtime';
import * as Plugin_1 from '@@/plugin-layout/runtime.tsx';
import * as Plugin_2 from '../plugin-model/runtime';
import * as Plugin_3 from '@@/plugin-qiankun/masterRuntimePlugin';

  plugin.register({
    apply: Plugin_0,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_1,
    path: '@@/plugin-layout/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-model/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: '@@/plugin-qiankun/masterRuntimePlugin',
  });

export const __mfsu = 1;
