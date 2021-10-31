"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.genBootstrap = genBootstrap;
exports.genMount = genMount;
exports.genUnmount = genUnmount;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _common = require("../common");

// @ts-ignore
// @ts-ignore
var defer = {};
defer.promise = new Promise(function (resolve) {
  defer.resolve = resolve;
});
var render = _common.noop;
var hasMountedAtLeastOnce = false;

var _default = function _default() {
  return defer.promise;
};

exports.default = _default;

function getSlaveRuntime() {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  var plugins = require('umi/_runtimePlugin');

  var config = plugins.mergeConfig('qiankun') || {};
  var slave = config.slave;
  return slave || config;
}

function genBootstrap(promises, oldRender) {
  return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var slaveRuntime,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            slaveRuntime = getSlaveRuntime();

            if (!slaveRuntime.bootstrap) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return slaveRuntime.bootstrap.apply(slaveRuntime, _args);

          case 4:
            render = function render() {
              return promises.then(oldRender).catch(function (e) {
                if (process.env.NODE_ENV === 'development') {
                  console.error('Render failed', e);
                }
              });
            };

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}

function genMount() {
  return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var slaveRuntime,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            defer.resolve();
            slaveRuntime = getSlaveRuntime();

            if (!slaveRuntime.mount) {
              _context2.next = 5;
              break;
            }

            _context2.next = 5;
            return slaveRuntime.mount.apply(slaveRuntime, _args2);

          case 5:
            // 第一次 mount umi 会自动触发 render，非第一次 mount 则需手动触发
            if (hasMountedAtLeastOnce) {
              render();
            }

            hasMountedAtLeastOnce = true;

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
}

function genUnmount(mountElementId) {
  return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
    var container,
        slaveRuntime,
        _args3 = arguments;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            container = document.getElementById(mountElementId);

            if (container) {
              _reactDom.default.unmountComponentAtNode(container);
            }

            slaveRuntime = getSlaveRuntime();

            if (!slaveRuntime.unmount) {
              _context3.next = 6;
              break;
            }

            _context3.next = 6;
            return slaveRuntime.unmount.apply(slaveRuntime, _args3);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
}