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
exports.SimulationRunner = void 0;
var child_process_1 = require("child_process");
var fs = __importStar(require("fs/promises"));
var path = __importStar(require("path"));
var electron_1 = require("electron");
var errors_1 = require("../utils/errors");
var logger_1 = require("../utils/logger");
var SimulationRunner = /** @class */ (function () {
    function SimulationRunner(simcPath) {
        this.simcPath = simcPath;
    }
    SimulationRunner.prototype.run = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var tempDir, inputFile, jsonFile, output, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDir = electron_1.app.getPath('temp');
                        inputFile = path.join(tempDir, "simc_input_".concat(Date.now(), ".simc"));
                        jsonFile = path.join(tempDir, "simc_output_".concat(Date.now(), ".json"));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 8]);
                        return [4 /*yield*/, this.writeInput(inputFile, params.input)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.runSimulation(inputFile, jsonFile, params)];
                    case 3:
                        output = _a.sent();
                        return [4 /*yield*/, this.parseResults(jsonFile)];
                    case 4:
                        result = _a.sent();
                        return [2 /*return*/, {
                                dps: result.sim.players[0].collected_data.dps.mean,
                                error: null,
                                rawOutput: output
                            }];
                    case 5:
                        error_1 = _a.sent();
                        throw new errors_1.SimulationError(error_1 instanceof Error ? error_1.message : String(error_1));
                    case 6: return [4 /*yield*/, this.cleanup(inputFile, jsonFile)];
                    case 7:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SimulationRunner.prototype.writeInput = function (inputFile, input) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanedInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cleanedInput = input
                            .split('\n')
                            .map(function (line) { return line.trim(); })
                            .filter(function (line) { return line && !line.startsWith('#'); })
                            .join('\n');
                        return [4 /*yield*/, fs.writeFile(inputFile, cleanedInput, 'utf8')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SimulationRunner.prototype.runSimulation = function (inputFile, jsonFile, params) {
        return __awaiter(this, void 0, void 0, function () {
            var child, output, exitCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        child = (0, child_process_1.spawn)(this.simcPath, [
                            "input=".concat(inputFile),
                            "iterations=".concat(params.iterations),
                            "threads=".concat(params.threads),
                            "json2=".concat(jsonFile)
                        ]);
                        output = '';
                        child.stdout.on('data', function (data) {
                            output += data.toString();
                        });
                        return [4 /*yield*/, new Promise(function (resolve) {
                                child.on('close', resolve);
                            })];
                    case 1:
                        exitCode = _a.sent();
                        if (exitCode !== 0) {
                            throw new errors_1.SimulationError('Simulation failed');
                        }
                        return [2 /*return*/, output];
                }
            });
        });
    };
    SimulationRunner.prototype.parseResults = function (jsonFile) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.readFile(jsonFile, 'utf8')];
                    case 1:
                        jsonOutput = _a.sent();
                        return [2 /*return*/, JSON.parse(jsonOutput)];
                }
            });
        });
    };
    SimulationRunner.prototype.cleanup = function () {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(files.map(function (file) {
                            return fs.unlink(file).catch(function (err) {
                                return logger_1.logger.warn("Failed to cleanup file ".concat(file, ":"), err);
                            });
                        }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SimulationRunner;
}());
exports.SimulationRunner = SimulationRunner;
//# sourceMappingURL=SimulationRunner.js.map