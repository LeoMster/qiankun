// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/a/Desktop/qiankun/master/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('/Users/a/Desktop/qiankun/master/src/.umi/plugin-layout/Layout.tsx').default,
    "routes": [
      {
        "path": "/",
        "component": require('@/pages/index').default,
        "exact": true
      },
      {
        "path": "/app1",
        "name": "app1",
        "microApp": "app1",
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'app1', base: '/', masterHistoryType: 'browser', routeProps: {'settings':{}} })
        })()
      },
      {
        "path": "/app2",
        "name": "app2",
        "microApp": "app2",
        "exact": false,
        "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'app2', base: '/', masterHistoryType: 'browser', routeProps: {'settings':{}} })
        })()
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
