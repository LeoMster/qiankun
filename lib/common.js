"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.defaultSlaveRootId = exports.defaultMountContainerId = exports.defaultMasterRootId = exports.defaultHistoryMode = exports.addSpecifyPrefixedRoute = void 0;
exports.testPathWithPrefix = testPathWithPrefix;
exports.toArray = toArray;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _lodash = require("lodash");

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

/**
 * @author Kuitos
 * @since 2019-06-20
 */
var defaultMountContainerId = 'root-subapp'; // 主应用跟子应用的默认 root id 区分开，避免冲突

exports.defaultMountContainerId = defaultMountContainerId;
var defaultMasterRootId = 'root-master';
exports.defaultMasterRootId = defaultMasterRootId;
var defaultSlaveRootId = 'root-slave';
exports.defaultSlaveRootId = defaultSlaveRootId;
var defaultHistoryMode = 'browser'; // @formatter:off

exports.defaultHistoryMode = defaultHistoryMode;

var noop = function noop() {}; // @formatter:on


exports.noop = noop;

function toArray(source) {
  return Array.isArray(source) ? source : [source];
}

function testPathWithStaticPrefix(pathPrefix, realPath) {
  if (pathPrefix.endsWith('/')) {
    return realPath.startsWith(pathPrefix);
  }

  var pathRegex = new RegExp("^".concat(pathPrefix, "(\\/|\\?)+.*$"), 'g');
  var normalizedPath = "".concat(realPath, "/");
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute, realPath) {
  return !!(0, _pathToRegexp.default)(dynamicRoute, {
    strict: true,
    end: false
  }).exec(realPath);
}

function testPathWithPrefix(pathPrefix, realPath) {
  return testPathWithStaticPrefix(pathPrefix, realPath) || testPathWithDynamicRoute(pathPrefix, realPath);
}

var recursiveCoverRouter = function recursiveCoverRouter(source, nameSpacePath) {
  return source.map(function (router) {
    if (router.routes) {
      recursiveCoverRouter(router.routes, nameSpacePath);
    }

    if (router.path !== '/' && router.path) {
      return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, router), {}, {
        path: "".concat(nameSpacePath).concat(router.path)
      });
    }

    return router;
  });
};

var addSpecifyPrefixedRoute = function addSpecifyPrefixedRoute(originRoute, keepOriginalRoutes, pkgName) {
  var copyBase = originRoute.filter(function (_) {
    return _.path === '/';
  });

  if (!copyBase[0]) {
    return originRoute;
  }

  var nameSpaceRouter = (0, _lodash.cloneDeep)(copyBase[0]);
  var nameSpace = keepOriginalRoutes === true ? pkgName : keepOriginalRoutes;
  nameSpaceRouter.path = "/".concat(nameSpace);
  nameSpaceRouter.routes = recursiveCoverRouter(nameSpaceRouter.routes, "/".concat(nameSpace));
  return [nameSpaceRouter].concat((0, _toConsumableArray2.default)(originRoute));
};

exports.addSpecifyPrefixedRoute = addSpecifyPrefixedRoute;