"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fontFeatureSettings", {
  enumerable: true,
  get: function get() {
    return _fontFeatureSettings["default"];
  }
});
Object.defineProperty(exports, "fontList", {
  enumerable: true,
  get: function get() {
    return _fontList["default"];
  }
});
Object.defineProperty(exports, "graphiteEnabledFeatures", {
  enumerable: true,
  get: function get() {
    return _graphiteEnabledFeatures["default"];
  }
});
Object.defineProperty(exports, "graphiteEnabledFontList", {
  enumerable: true,
  get: function get() {
    return _graphiteEnabledFontList["default"];
  }
});
Object.defineProperty(exports, "openTypeEnabledFeatures", {
  enumerable: true,
  get: function get() {
    return _openTypeEnabledFeatures["default"];
  }
});
Object.defineProperty(exports, "useAssumeGraphite", {
  enumerable: true,
  get: function get() {
    return _useAssumeGraphite["default"];
  }
});
Object.defineProperty(exports, "useDetectDir", {
  enumerable: true,
  get: function get() {
    return _useDetectDir["default"];
  }
});
Object.defineProperty(exports, "useDetectFonts", {
  enumerable: true,
  get: function get() {
    return _useDetectFonts["default"];
  }
});
Object.defineProperty(exports, "useDetectRender", {
  enumerable: true,
  get: function get() {
    return _useDetectRender["default"];
  }
});
var _useDetectFonts = _interopRequireDefault(require("./hooks/useDetectFonts/useDetectFonts.js"));
var _useAssumeGraphite = _interopRequireDefault(require("./hooks/useAssumeGraphite/useAssumeGraphite.js"));
var _useDetectDir = _interopRequireDefault(require("./hooks/useDetectDir/useDetectDir.js"));
var _useDetectRender = _interopRequireDefault(require("./hooks/useDetectRender/useDetectRender.js"));
var _fontList = _interopRequireDefault(require("./fonts/fontList.json"));
var _graphiteEnabledFontList = _interopRequireDefault(require("./fonts/graphiteEnabledFontList.json"));
var _graphiteEnabledFeatures = _interopRequireDefault(require("./fonts/graphiteEnabledFeatures.json"));
var _openTypeEnabledFeatures = _interopRequireDefault(require("./fonts/openTypeEnabledFeatures.json"));
var _fontFeatureSettings = _interopRequireDefault(require("./fonts/fontFeatureSettings.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }