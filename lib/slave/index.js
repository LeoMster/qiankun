"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _address = _interopRequireDefault(require("address"));

var _assert = _interopRequireDefault(require("assert"));

var _lodash = require("lodash");

var _path = require("path");

var _webpack = _interopRequireDefault(require("webpack"));

var _common = require("../common");

/*  eslint-disable no-param-reassign */
const localIpAddress = process.env.USE_REMOTE_IP ? _address.default.ip() : 'localhost';

function _default(api, options) {
  const _ref = options || {},
        _ref$registerRuntimeK = _ref.registerRuntimeKeyInIndex,
        registerRuntimeKeyInIndex = _ref$registerRuntimeK === void 0 ? false : _ref$registerRuntimeK,
        _ref$keepOriginalRout = _ref.keepOriginalRoutes,
        keepOriginalRoutes = _ref$keepOriginalRout === void 0 ? false : _ref$keepOriginalRout,
        _ref$shouldNotModifyR = _ref.shouldNotModifyRuntimePublicPath,
        shouldNotModifyRuntimePublicPath = _ref$shouldNotModifyR === void 0 ? false : _ref$shouldNotModifyR,
        _ref$shouldNotModifyD = _ref.shouldNotModifyDefaultBase,
        shouldNotModifyDefaultBase = _ref$shouldNotModifyD === void 0 ? false : _ref$shouldNotModifyD,
        _ref$shouldNotModifyM = _ref.shouldNotModifyMountElementId,
        shouldNotModifyMountElementId = _ref$shouldNotModifyM === void 0 ? false : _ref$shouldNotModifyM;

  api.addRuntimePlugin(require.resolve('./runtimePlugin'));

  if (!registerRuntimeKeyInIndex) {
    api.addRuntimePluginKey('qiankun');
  }

  const lifecyclePath = require.resolve('./lifecycles');

  const mountElementId = api.config.mountElementId || _common.defaultSlaveRootId; // eslint-disable-next-line import/no-dynamic-require, global-require

  const _require = require((0, _path.join)(api.cwd, 'package.json')),
        pkgName = _require.name;

  api.modifyDefaultConfig(memo => {
    const config = {
      // 默认开启 runtimePublicPath，避免出现 dynamic import 场景子应用资源地址出问题
      runtimePublicPath: true
    };

    if (!shouldNotModifyMountElementId) {
      config.mountElementId = mountElementId;
    }

    if (!shouldNotModifyDefaultBase) {
      config.base = `/${pkgName}`;
    }

    return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, memo), config);
  }); // 如果没有手动关闭 runtimePublicPath，则直接使用 qiankun 注入的 publicPath

  if (api.config.runtimePublicPath !== false && !shouldNotModifyRuntimePublicPath) {
    api.modifyPublicPathStr(`window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || window.publicPath || "${// 开发阶段 publicPath 配置无效，默认为 /
    process.env.NODE_ENV !== 'development' ? api.config.publicPath || '/' : '/'}"`);
  }

  const port = process.env.PORT;
  const protocol = process.env.HTTPS ? 'https' : 'http';
  api.modifyWebpackConfig(memo => {
    memo.output.libraryTarget = 'umd';
    (0, _assert.default)(api.pkg.name, 'You should have name in package.json');
    memo.output.library = `${api.pkg.name}-[name]`;
    memo.output.jsonpFunction = `webpackJsonp_${api.pkg.name}`; // 配置 publicPath，支持 hot update

    if (process.env.NODE_ENV === 'development' && port) {
      memo.output.publicPath = `${protocol}://${localIpAddress}:${port}/`;
    }

    return memo;
  }); // umi bundle 添加 entry 标记

  api.modifyHTMLWithAST($ => {
    $('script').each((_, el) => {
      const scriptEl = $(el);
      const umiEntryJs = /\/?umi(\.\w+)?\.js$/g;
      const src = scriptEl.attr('src');

      if (src && umiEntryJs.test(scriptEl.attr('src'))) {
        scriptEl.attr('entry', '');
      }
    });
    return $;
  }); // source-map 跨域设置

  if (process.env.NODE_ENV === 'development' && port) {
    // 变更 webpack-dev-server websocket 默认监听地址
    process.env.SOCKET_SERVER = `${protocol}://${localIpAddress}:${port}/`;
    api.chainWebpackConfig(memo => {
      // 禁用 devtool，启用 SourceMapDevToolPlugin
      memo.devtool(false);
      memo.plugin('source-map').use(_webpack.default.SourceMapDevToolPlugin, [{
        // @ts-ignore
        namespace: pkgName,
        append: `\n//# sourceMappingURL=${protocol}://${localIpAddress}:${port}/[url]`,
        filename: '[file].map'
      }]);
    });
  }

  api.writeTmpFile('qiankunContext.js', `
import { createContext, useContext } from 'react';

export const Context = createContext(null);
export function useRootExports() {
  return useContext(Context);
};
  `.trim());
  api.addUmiExports([{
    specifiers: ['useRootExports'],
    source: '@tmp/qiankunContext'
  }]);
  api.addEntryImport({
    source: lifecyclePath,
    specifier: '{ genMount as qiankun_genMount, genBootstrap as qiankun_genBootstrap, genUnmount as qiankun_genUnmount }'
  });
  api.addRendererWrapperWithModule(lifecyclePath);
  api.addEntryCode(`
    export const bootstrap = qiankun_genBootstrap(Promise.all(moduleBeforeRendererPromises), render);
    export const mount = qiankun_genMount();
    export const unmount = qiankun_genUnmount('${mountElementId}');

    if (!window.__POWERED_BY_QIANKUN__) {
      bootstrap().then(mount);
    }
    `);
  api.modifyRoutes(routes => {
    // 开启keepOriginalRoutes配置
    if (keepOriginalRoutes === true || (0, _lodash.isString)(keepOriginalRoutes)) {
      return (0, _common.addSpecifyPrefixedRoute)(routes, keepOriginalRoutes, pkgName);
    }

    return routes;
  });
}