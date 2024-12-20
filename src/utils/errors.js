"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConfigError = exports.isSimcError = exports.ConfigError = exports.SimcError = void 0;
var SimcError = /** @class */ (function (_super) {
    __extends(SimcError, _super);
    function SimcError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = 'SimcError';
        return _this;
    }
    return SimcError;
}(Error));
exports.SimcError = SimcError;
var ConfigError = /** @class */ (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.name = 'ConfigError';
        return _this;
    }
    return ConfigError;
}(Error));
exports.ConfigError = ConfigError;
function isSimcError(error) {
    return error instanceof SimcError;
}
exports.isSimcError = isSimcError;
function isConfigError(error) {
    return error instanceof ConfigError;
}
exports.isConfigError = isConfigError;
//# sourceMappingURL=errors.js.map