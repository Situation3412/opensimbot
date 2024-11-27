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
exports.ConfigError = exports.SimulationError = exports.InstallationError = exports.BuildError = exports.DownloadError = exports.SimcError = void 0;
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
var DownloadError = /** @class */ (function (_super) {
    __extends(DownloadError, _super);
    function DownloadError(message) {
        return _super.call(this, message, 'DOWNLOAD_ERROR') || this;
    }
    return DownloadError;
}(SimcError));
exports.DownloadError = DownloadError;
var BuildError = /** @class */ (function (_super) {
    __extends(BuildError, _super);
    function BuildError(message) {
        return _super.call(this, message, 'BUILD_ERROR') || this;
    }
    return BuildError;
}(SimcError));
exports.BuildError = BuildError;
var InstallationError = /** @class */ (function (_super) {
    __extends(InstallationError, _super);
    function InstallationError(message) {
        return _super.call(this, message, 'INSTALLATION_ERROR') || this;
    }
    return InstallationError;
}(SimcError));
exports.InstallationError = InstallationError;
var SimulationError = /** @class */ (function (_super) {
    __extends(SimulationError, _super);
    function SimulationError(message) {
        return _super.call(this, message, 'SIMULATION_ERROR') || this;
    }
    return SimulationError;
}(SimcError));
exports.SimulationError = SimulationError;
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
//# sourceMappingURL=errors.js.map