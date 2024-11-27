"use strict";
/**
 * Note: The "Failed to connect to the bus" errors on Linux are related to the
 * D-Bus connection and can be safely ignored. These errors occur when running
 * Electron in certain Linux environments without a desktop session.
 */
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
var electron_1 = require("electron");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var remoteMain = __importStar(require("@electron/remote/main"));
var SimcManager_1 = require("./SimcManager");
var logger_1 = require("./utils/logger");
logger_1.logger.info('Starting Open SimBot...');
// Simple development check
var isDev = process.env.NODE_ENV === 'development' || process.defaultApp;
remoteMain.initialize();
logger_1.logger.info('Remote initialized');
var simcManager = new SimcManager_1.SimcManager();
var checkInstallationTimeout = null;
function createWindow() {
    logger_1.logger.debug('Creating main window...');
    var preloadPath = path.join(__dirname, 'preload.js');
    logger_1.logger.debug('Preload path:', preloadPath);
    var mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: preloadPath,
            devTools: true // Always enable DevTools for debugging
        }
    });
    remoteMain.enable(mainWindow.webContents);
    var startUrl = isDev
        ? 'http://localhost:3000'
        : "file://".concat(path.join(__dirname, '..', 'build', 'index.html'));
    logger_1.logger.info('Loading URL:', startUrl);
    logger_1.logger.info('Current directory:', __dirname);
    logger_1.logger.info('Build path:', path.join(__dirname, '..', 'build'));
    mainWindow.loadURL(startUrl);
    // Always open DevTools in production too until we fix the issue
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
        logger_1.logger.error('Failed to load:', { errorCode: errorCode, errorDescription: errorDescription, startUrl: startUrl });
    });
    mainWindow.webContents.on('did-finish-load', function () {
        logger_1.logger.info('Main window loaded');
    });
    mainWindow.webContents
        .on('crashed', function (event) {
        logger_1.logger.error('Renderer process crashed', event);
    });
}
electron_1.app.whenReady().then(function () {
    logger_1.logger.info('App ready, creating window...');
    createWindow();
}).catch(function (err) {
    logger_1.logger.error('Error in app.whenReady:', err);
});
electron_1.app.on('window-all-closed', function () {
    console.log('All windows closed');
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    console.log('App activated');
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC Handlers
electron_1.ipcMain.handle('simc:checkInstallation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                logger_1.logger.info('Handling simc:checkInstallation');
                return [4 /*yield*/, simcManager.performCheck()];
            case 1:
                result = _a.sent();
                // Explicitly serialize the result
                return [2 /*return*/, {
                        needsInstall: !!result.needsInstall,
                        needsUpdate: !!result.needsUpdate,
                        currentVersion: result.currentVersion ? {
                            major: result.currentVersion.major,
                            minor: result.currentVersion.minor,
                            patch: result.currentVersion.patch
                        } : null
                    }];
            case 2:
                error_1 = _a.sent();
                logger_1.logger.error('Error in checkInstallation:', error_1);
                // Return a serializable error object
                return [2 /*return*/, {
                        error: {
                            message: error_1 instanceof Error ? error_1.message : String(error_1),
                            name: error_1 instanceof Error ? error_1.name : 'Unknown Error'
                        }
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('simc:getVersion', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('Handling simc:getVersion');
        return [2 /*return*/, simcManager.getInstalledVersion()];
    });
}); });
electron_1.ipcMain.handle('simc:downloadLatest', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('Handling simc:downloadLatest');
        return [2 /*return*/, simcManager.downloadLatestVersion()];
    });
}); });
electron_1.ipcMain.handle('config:load', function () { return __awaiter(void 0, void 0, void 0, function () {
    var configPath, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configPath = path.join(electron_1.app.getPath('userData'), 'config.json');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!fs.existsSync(configPath)) return [3 /*break*/, 3];
                return [4 /*yield*/, fs.promises.readFile(configPath, 'utf8')];
            case 2:
                data = _a.sent();
                return [2 /*return*/, JSON.parse(data)];
            case 3: return [2 /*return*/, {
                    simcPath: null,
                    iterations: 10000,
                    threads: Math.max(1, require('os').cpus().length - 1)
                }];
            case 4:
                error_2 = _a.sent();
                console.error('Error loading config:', error_2);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle('config:save', function (_, config) { return __awaiter(void 0, void 0, void 0, function () {
    var configPath, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                configPath = path.join(electron_1.app.getPath('userData'), 'config.json');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.promises.writeFile(configPath, JSON.stringify(config, null, 2))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error saving config:', error_3);
                throw error_3;
            case 4: return [2 /*return*/];
        }
    });
}); });
// Error handlers
process.on('uncaughtException', function (error) {
    logger_1.logger.error('Uncaught exception:', error);
});
process.on('unhandledRejection', function (error) {
    logger_1.logger.error('Unhandled rejection:', error);
});
//# sourceMappingURL=electron.js.map