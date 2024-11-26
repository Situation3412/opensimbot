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
exports.SimcManager = void 0;
var electron_1 = require("electron");
var child_process_1 = require("child_process");
var util_1 = require("util");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var SimcManager = /** @class */ (function () {
    function SimcManager() {
        this.simcPath = null;
        this.initialize();
    }
    SimcManager.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadState()];
                    case 1:
                        state = _a.sent();
                        this.simcPath = state.simcPath;
                        return [2 /*return*/];
                }
            });
        });
    };
    SimcManager.prototype.findSimcInstallation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commonPaths, _i, commonPaths_1, path_1, stdout, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Checking common installation paths...');
                        commonPaths = [
                            process.env.SIMC_PATH,
                            '/usr/local/bin/simc',
                            '/usr/bin/simc',
                            'C:\\Program Files\\SimulationCraft\\simc.exe',
                            path.join(process.env.HOME || '', '.local/bin/simc')
                        ];
                        for (_i = 0, commonPaths_1 = commonPaths; _i < commonPaths_1.length; _i++) {
                            path_1 = commonPaths_1[_i];
                            if (path_1) {
                                console.log("Checking path: ".concat(path_1));
                                if (fs.existsSync(path_1)) {
                                    console.log("Found SimC at: ".concat(path_1));
                                    return [2 /*return*/, path_1];
                                }
                            }
                        }
                        console.log('Checking PATH environment...');
                        return [4 /*yield*/, execAsync('which simc')];
                    case 1:
                        stdout = (_a.sent()).stdout;
                        if (stdout.trim()) {
                            console.log("Found SimC in PATH: ".concat(stdout.trim()));
                            return [2 /*return*/, stdout.trim()];
                        }
                        console.log('SimC not found in any location');
                        return [2 /*return*/, null];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error finding SimC:', error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SimcManager.prototype.getInstalledVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stdout, versionMatch, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.simcPath)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, execAsync("\"".concat(this.simcPath, "\" --version"))];
                    case 2:
                        stdout = (_a.sent()).stdout;
                        versionMatch = stdout.match(/SimulationCraft (\d+)\.(\d+)\.(\d+)/i);
                        if (versionMatch) {
                            return [2 /*return*/, {
                                    major: parseInt(versionMatch[1]),
                                    minor: parseInt(versionMatch[2]),
                                    patch: parseInt(versionMatch[3])
                                }];
                        }
                        return [2 /*return*/, null];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SimcManager.prototype.checkForUpdates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInstalledVersion()];
                    case 1:
                        currentVersion = _a.sent();
                        if (!currentVersion)
                            return [2 /*return*/, true];
                        return [2 /*return*/, false]; // TODO: Implement actual version checking
                }
            });
        });
    };
    SimcManager.prototype.downloadLatestVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement download logic
                throw new Error('Not implemented');
            });
        });
    };
    SimcManager.prototype.performCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentVersion, needsUpdate;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Find SimC installation
                        _a = this;
                        return [4 /*yield*/, this.findSimcInstallation()];
                    case 1:
                        // Find SimC installation
                        _a.simcPath = _b.sent();
                        return [4 /*yield*/, this.getInstalledVersion()];
                    case 2:
                        currentVersion = _b.sent();
                        return [4 /*yield*/, this.checkForUpdates()];
                    case 3:
                        needsUpdate = _b.sent();
                        return [2 /*return*/, {
                                needsInstall: !this.simcPath,
                                needsUpdate: needsUpdate,
                                currentVersion: currentVersion
                            }];
                }
            });
        });
    };
    SimcManager.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stateFile, state, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        stateFile = path.join(electron_1.app.getPath('userData'), SimcManager.STATE_FILE);
                        return [4 /*yield*/, fs.promises.readFile(stateFile, 'utf-8')];
                    case 1:
                        state = _a.sent();
                        return [2 /*return*/, JSON.parse(state)];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, { lastCheckTime: 0, installedVersion: null, simcPath: null }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SimcManager.prototype.saveState = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateFile, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        stateFile = path.join(electron_1.app.getPath('userData'), SimcManager.STATE_FILE);
                        return [4 /*yield*/, fs.promises.writeFile(stateFile, JSON.stringify(state, null, 2))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error saving state:', error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SimcManager.STATE_FILE = 'simc-state.json';
    SimcManager.CHECK_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
    SimcManager.LATEST_VERSION = { major: 1, minor: 0, patch: 0 };
    return SimcManager;
}());
exports.SimcManager = SimcManager;
//# sourceMappingURL=SimcManager.js.map