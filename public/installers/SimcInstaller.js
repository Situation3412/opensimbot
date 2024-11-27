"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimcInstaller = exports.LinuxSimcInstaller = exports.MacSimcInstaller = exports.WindowsSimcInstaller = void 0;
var electron_1 = require("electron");
var path = __importStar(require("path"));
var fs = __importStar(require("fs/promises"));
var sevenZip = __importStar(require("7zip-min"));
var util_1 = require("util");
var child_process_1 = require("child_process");
var errors_1 = require("../utils/errors");
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var extractFull = (0, util_1.promisify)(sevenZip.unpack);
var SIMC_DOWNLOAD_BASE = 'http://downloads.simulationcraft.org/nightly/';
var WindowsSimcInstaller = /** @class */ (function () {
    function WindowsSimcInstaller() {
    }
    WindowsSimcInstaller.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version, url, downloadPath, installPath, filename, filePath, simcPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLatestVersion()];
                    case 1:
                        _a = _b.sent(), version = _a.version, url = _a.url;
                        downloadPath = path.join(electron_1.app.getPath('userData'), 'downloads');
                        installPath = path.join(electron_1.app.getPath('userData'), 'simc');
                        return [4 /*yield*/, fs.mkdir(downloadPath, { recursive: true })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, fs.mkdir(installPath, { recursive: true })];
                    case 3:
                        _b.sent();
                        filename = url.split('/').pop();
                        filePath = path.join(downloadPath, filename);
                        return [4 /*yield*/, this.downloadFile(url, filePath)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, extractFull(filePath, installPath)];
                    case 5:
                        _b.sent();
                        simcPath = path.join(installPath, 'simc.exe');
                        return [4 /*yield*/, fs.unlink(filePath)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, simcPath];
                }
            });
        });
    };
    WindowsSimcInstaller.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.install()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WindowsSimcInstaller.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementation
                return [2 /*return*/, null];
            });
        });
    };
    WindowsSimcInstaller.prototype.getLatestVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementation
                throw new Error('Not implemented');
            });
        });
    };
    WindowsSimcInstaller.prototype.downloadFile = function (url, destination) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Implementation
                throw new Error('Not implemented');
            });
        });
    };
    return WindowsSimcInstaller;
}());
exports.WindowsSimcInstaller = WindowsSimcInstaller;
var MacSimcInstaller = /** @class */ (function () {
    function MacSimcInstaller() {
    }
    MacSimcInstaller.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Similar to Windows implementation but with .dmg handling
                throw new Error('Not implemented');
            });
        });
    };
    MacSimcInstaller.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.install()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MacSimcInstaller.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null];
            });
        });
    };
    return MacSimcInstaller;
}());
exports.MacSimcInstaller = MacSimcInstaller;
var LinuxSimcInstaller = /** @class */ (function () {
    function LinuxSimcInstaller() {
    }
    LinuxSimcInstaller.prototype.install = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buildPath, simcPath, binPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buildPath = path.join(electron_1.app.getPath('userData'), 'simc-build');
                        return [4 /*yield*/, fs.mkdir(buildPath, { recursive: true })];
                    case 1:
                        _a.sent();
                        // Clone repo
                        return [4 /*yield*/, execAsync('git clone https://github.com/simulationcraft/simc.git', { cwd: buildPath })];
                    case 2:
                        // Clone repo
                        _a.sent();
                        simcPath = path.join(buildPath, 'simc');
                        return [4 /*yield*/, execAsync('make -C engine OPENSSL=1 optimized', { cwd: simcPath })];
                    case 3:
                        _a.sent();
                        binPath = '/usr/local/bin/simc';
                        return [4 /*yield*/, execAsync("sudo ln -sf \"".concat(path.join(simcPath, 'engine/simc'), "\" \"").concat(binPath, "\""))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, binPath];
                }
            });
        });
    };
    LinuxSimcInstaller.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buildPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buildPath = path.join(electron_1.app.getPath('userData'), 'simc-build/simc');
                        return [4 /*yield*/, execAsync('git pull', { cwd: buildPath })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, execAsync('make -C engine OPENSSL=1 optimized', { cwd: buildPath })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LinuxSimcInstaller.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stdout, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, execAsync('git rev-parse --short HEAD')];
                    case 1:
                        stdout = (_b.sent()).stdout;
                        return [2 /*return*/, {
                                major: 0,
                                minor: 0,
                                patch: 0,
                                gitVersion: stdout.trim()
                            }];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return LinuxSimcInstaller;
}());
exports.LinuxSimcInstaller = LinuxSimcInstaller;
function createSimcInstaller() {
    switch (process.platform) {
        case 'win32':
            return new WindowsSimcInstaller();
        case 'darwin':
            return new MacSimcInstaller();
        case 'linux':
            return new LinuxSimcInstaller();
        default:
            throw new errors_1.InstallationError("Unsupported platform: ".concat(process.platform));
    }
}
exports.createSimcInstaller = createSimcInstaller;
//# sourceMappingURL=SimcInstaller.js.map