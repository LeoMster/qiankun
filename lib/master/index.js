"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _createForOfIteratorHelper2 = _interopRequireDefault(require("@babel/runtime/helpers/createForOfIteratorHelper"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _fs = require("fs");

var _path = require("path");

var _common = require("../common");

/* eslint-disable quotes */
function _default(api, options) {
  const _ref = options || {},
        _ref$registerRuntimeK = _ref.registerRuntimeKeyInIndex,
        registerRuntimeKeyInIndex = _ref$registerRuntimeK === void 0 ? false : _ref$registerRuntimeK;

  api.addRuntimePlugin(require.resolve('./runtimePlugin'));

  if (!registerRuntimeKeyInIndex) {
    api.addRuntimePluginKey('qiankun');
  }

  api.modifyDefaultConfig(config => (0, _objectSpread2.default)((0, _objectSpread2.default)({}, config), {}, {
    mountElementId: _common.defaultMasterRootId,
    disableGlobalVariables: true
  }));
  const _api$config$history = api.config.history,
        history = _api$config$history === void 0 ? _common.defaultHistoryMode : _api$config$history; // apps 可能在构建期为空

  const _ref2 = options || {},
        _ref2$apps = _ref2.apps,
        apps = _ref2$apps === void 0 ? [] : _ref2$apps;

  if (apps.length) {
    // 获取一组路由中以 basePath 为前缀的路由
    const findRouteWithPrefix = (routes, basePath) => {
      // eslint-disable-next-line no-restricted-syntax
      var _iterator = (0, _createForOfIteratorHelper2.default)(routes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const route = _step.value;
          if (route.path && (0, _common.testPathWithPrefix)(basePath, route.path)) return route;

          if (route.routes && route.routes.length) {
            return findRouteWithPrefix(route.routes, basePath);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    };

    const modifyAppRoutes = masterHistory => {
      api.modifyRoutes(routes => {
        const newRoutes = routes.map(route => {
          if (route.path === '/' && route.routes && route.routes.length) {
            apps.forEach(({
              history: slaveHistory = history,
              base
            }) => {
              // 当子应用的 history mode 跟主应用一致时，为避免出现 404 手动为主应用创建一个 path 为 子应用 rule 的空 div 路由组件
              if (slaveHistory === masterHistory) {
                const baseConfig = (0, _common.toArray)(base);
                baseConfig.forEach(basePath => {
                  const routeWithPrefix = findRouteWithPrefix(routes, basePath); // 应用没有自己配置过 basePath 相关路由，则自动加入 mock 的路由

                  if (!routeWithPrefix) {
                    route.routes.unshift({
                      path: basePath,
                      exact: false,
                      component: `() => {
                        if (process.env.NODE_ENV === 'development') {
                          console.log('${basePath} 404 mock rendered');
                        }

                        return React.createElement('div');
                      }`
                    });
                  } else {
                    // 若用户已配置过跟应用 base 重名的路由，则强制将该路由 exact 设置为 false，目的是兼容之前遗留的错误用法的场景
                    routeWithPrefix.exact = false;
                  }
                });
              }
            });
          }

          return route;
        });
        return newRoutes;
      });
    };

    modifyAppRoutes(history);
  }

  const rootExportsJsFile = (0, _path.join)(api.paths.absSrcPath, 'rootExports.js');
  const rootExportsTsFile = (0, _path.join)(api.paths.absSrcPath, 'rootExports.ts');
  const rootExportsJsFileExisted = (0, _fs.existsSync)(rootExportsJsFile);
  const rootExportsFileExisted = rootExportsJsFileExisted || (0, _fs.existsSync)(rootExportsTsFile);
  api.addPageWatcher(rootExportsJsFileExisted ? rootExportsJsFile : rootExportsTsFile);
  api.onGenerateFiles(() => {
    const rootExports = `
window.g_rootExports = ${rootExportsFileExisted ? `require('@/rootExports')` : `{}`};
    `.trim();
    api.writeTmpFile('qiankunRootExports.js', rootExports);
    api.writeTmpFile('subAppsConfig.json', JSON.stringify((0, _objectSpread2.default)({
      masterHistory: history
    }, options)));
  });
  api.writeTmpFile('qiankunDefer.js', `
      class Deferred {
        constructor() {
          this.promise = new Promise(resolve => this.resolve = resolve);
        }
      }
      export const deferred = new Deferred();
      export const qiankunStart = deferred.resolve;
    `.trim());
  api.addUmiExports([{
    specifiers: ['qiankunStart'],
    source: '@tmp/qiankunDefer'
  }]);
}