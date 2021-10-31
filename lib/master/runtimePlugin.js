"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _qiankunDefer = require("@tmp/qiankunDefer.js");

require("@tmp/qiankunRootExports.js");

var _subAppsConfig = _interopRequireDefault(require("@tmp/subAppsConfig.json"));

var _assert = _interopRequireDefault(require("assert"));

var _qiankun = require("qiankun");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _common = require("../common");

var _excluded = ["apps", "jsSandbox", "prefetch", "defer", "lifeCycles", "masterHistory"];

function getMasterRuntime() {
  return _getMasterRuntime.apply(this, arguments);
}

function _getMasterRuntime() {
  _getMasterRuntime = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var plugins, config, master;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // eslint-disable-next-line import/no-extraneous-dependencies, global-require
            plugins = require('umi/_runtimePlugin');
            _context.next = 3;
            return plugins.mergeConfigAsync('qiankun');

          case 3:
            _context.t0 = _context.sent;

            if (_context.t0) {
              _context.next = 6;
              break;
            }

            _context.t0 = {};

          case 6:
            config = _context.t0;
            master = config.master;
            return _context.abrupt("return", master || config);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getMasterRuntime.apply(this, arguments);
}

function render(_x) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(oldRender) {
    var isAppActive, runtimeConfig, _ref, apps, _ref$jsSandbox, jsSandbox, _ref$prefetch, prefetch, _ref$defer, defer, lifeCycles, masterHistory, otherConfigs;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isAppActive = function _isAppActive(location, history, opts) {
              var base = opts.base,
                  setMatchedBase = opts.setMatchedBase;
              var baseConfig = (0, _common.toArray)(base);

              switch (history) {
                case 'hash':
                  {
                    var matchedBase = baseConfig.find(function (pathPrefix) {
                      return (0, _common.testPathWithPrefix)("#".concat(pathPrefix), location.hash);
                    });

                    if (matchedBase) {
                      setMatchedBase(matchedBase);
                    }

                    return !!matchedBase;
                  }

                case 'browser':
                  {
                    var _matchedBase = baseConfig.find(function (pathPrefix) {
                      return (0, _common.testPathWithPrefix)(pathPrefix, location.pathname);
                    });

                    if (_matchedBase) {
                      setMatchedBase(_matchedBase);
                    }

                    return !!_matchedBase;
                  }

                default:
                  return false;
              }
            };

            oldRender();
            _context2.next = 4;
            return getMasterRuntime();

          case 4:
            runtimeConfig = _context2.sent;
            _ref = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _subAppsConfig.default), runtimeConfig), apps = _ref.apps, _ref$jsSandbox = _ref.jsSandbox, jsSandbox = _ref$jsSandbox === void 0 ? false : _ref$jsSandbox, _ref$prefetch = _ref.prefetch, prefetch = _ref$prefetch === void 0 ? true : _ref$prefetch, _ref$defer = _ref.defer, defer = _ref$defer === void 0 ? false : _ref$defer, lifeCycles = _ref.lifeCycles, masterHistory = _ref.masterHistory, otherConfigs = (0, _objectWithoutProperties2.default)(_ref, _excluded);
            (0, _assert.default)(apps && apps.length, 'sub apps must be config when using umi-plugin-qiankun');
            (0, _qiankun.registerMicroApps)(apps.map(function (_ref2) {
              var name = _ref2.name,
                  entry = _ref2.entry,
                  base = _ref2.base,
                  _ref2$history = _ref2.history,
                  history = _ref2$history === void 0 ? masterHistory : _ref2$history,
                  _ref2$mountElementId = _ref2.mountElementId,
                  mountElementId = _ref2$mountElementId === void 0 ? _common.defaultMountContainerId : _ref2$mountElementId,
                  props = _ref2.props;
              var matchedBase = base;
              return {
                name: name,
                entry: entry,
                activeRule: function activeRule(location) {
                  return isAppActive(location, history, {
                    base: base,
                    setMatchedBase: function setMatchedBase(v) {
                      return matchedBase = v;
                    }
                  });
                },
                render: function render(_ref3) {
                  var appContent = _ref3.appContent,
                      loading = _ref3.loading;

                  if (process.env.NODE_ENV === 'development') {
                    console.info("[@umijs/plugin-qiankun]: app ".concat(name, " loading ").concat(loading));
                  }

                  if (mountElementId) {
                    var container = document.getElementById(mountElementId);

                    if (container) {
                      var subApp = /*#__PURE__*/_react.default.createElement('div', {
                        dangerouslySetInnerHTML: {
                          __html: appContent
                        }
                      });

                      _reactDom.default.render(subApp, container);
                    } else if (process.env.NODE_ENV === 'development') {
                      console.warn("[@umijs/plugin-qiankun]: Your ".concat(name, " app container with id ").concat(mountElementId, " is not\n               ready, that may cause an unexpected behavior!"));
                    }
                  }
                },
                props: (0, _objectSpread2.default)({
                  base: base,
                  history: history,
                  getMatchedBase: function getMatchedBase() {
                    return matchedBase;
                  }
                }, props)
              };
            }), lifeCycles, (0, _objectSpread2.default)({}, otherConfigs));

            if (!defer) {
              _context2.next = 11;
              break;
            }

            _context2.next = 11;
            return _qiankunDefer.deferred.promise;

          case 11:
            (0, _qiankun.start)((0, _objectSpread2.default)({
              jsSandbox: jsSandbox,
              prefetch: prefetch
            }, otherConfigs));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _render.apply(this, arguments);
}