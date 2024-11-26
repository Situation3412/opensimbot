"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
        this.isDev = process.env.NODE_ENV === 'development';
    }
    Logger.prototype.log = function (level, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timestamp = new Date().toISOString();
        var prefix = "[".concat(timestamp, "] [").concat(level.toUpperCase(), "]");
        if (this.isDev || level === 'error') {
            console[level].apply(console, __spreadArray(["".concat(prefix, " ").concat(message)], args, false));
        }
    };
    Logger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['debug', message], args, false));
    };
    Logger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['info', message], args, false));
    };
    Logger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['warn', message], args, false));
    };
    Logger.prototype.error = function (message, error) {
        if (error instanceof Error) {
            this.log('error', message, {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        else {
            this.log('error', message, error);
        }
    };
    return Logger;
}());
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map