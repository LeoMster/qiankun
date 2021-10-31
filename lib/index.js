"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _assert = _interopRequireDefault(require("assert"));

var _master = _interopRequireDefault(require("./master"));

var _slave = _interopRequireDefault(require("./slave"));

function _default(api, options) {
  api.addRuntimePluginKey('qiankun'); // 监听插件配置变化

  api.onOptionChange(newOpts => {
    const _ref = newOpts || {},
          masterOpts = _ref.master,
          slaveOpts = _ref.slave;

    (0, _assert.default)(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项');

    if (masterOpts) {
      api.changePluginOption('qiankun-master', (0, _objectSpread2.default)((0, _objectSpread2.default)({}, masterOpts), {}, {
        registerRuntimeKeyInIndex: true
      }));
    } else {
      api.changePluginOption('qiankun-slave', (0, _objectSpread2.default)((0, _objectSpread2.default)({}, slaveOpts), {}, {
        registerRuntimeKeyInIndex: true
      }));
    }
  });

  const _ref2 = options || {},
        masterOpts = _ref2.master,
        slaveOpts = _ref2.slave,
        _ref2$shouldNotModify = _ref2.shouldNotModifyRuntimePublicPath,
        shouldNotModifyRuntimePublicPath = _ref2$shouldNotModify === void 0 ? false : _ref2$shouldNotModify;

  (0, _assert.default)(!(masterOpts && slaveOpts), '请勿同时配置 master 和 slave 配置项');

  if (masterOpts) {
    api.registerPlugin({
      id: 'qiankun-master',
      apply: _master.default,
      opts: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, masterOpts), {}, {
        registerRuntimeKeyInIndex: true
      })
    });
  } else {
    api.registerPlugin({
      id: 'qiankun-slave',
      apply: _slave.default,
      opts: (0, _objectSpread2.default)({
        shouldNotModifyRuntimePublicPath,
        registerRuntimeKeyInIndex: true
      }, slaveOpts)
    });
  }
}