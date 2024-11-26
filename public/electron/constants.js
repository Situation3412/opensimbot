"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_INTERVAL = exports.SIMC_PATHS = void 0;
exports.SIMC_PATHS = {
    WINDOWS: [
        'C:\\Program Files\\SimulationCraft\\simc.exe',
        'C:\\Program Files (x86)\\SimulationCraft\\simc.exe'
    ],
    LINUX: [
        '/usr/local/bin/simc',
        '/usr/bin/simc'
    ],
    MAC: [
        '/Applications/SimulationCraft/simc',
        '/usr/local/bin/simc'
    ]
};
exports.UPDATE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds 
//# sourceMappingURL=constants.js.map