"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersion = exports.versionToString = exports.compareVersions = void 0;
function compareVersions(a, b) {
    if (a.major !== b.major)
        return a.major - b.major;
    if (a.minor !== b.minor)
        return a.minor - b.minor;
    return a.patch - b.patch;
}
exports.compareVersions = compareVersions;
function versionToString(version) {
    return "".concat(version.major, ".").concat(version.minor, ".").concat(version.patch);
}
exports.versionToString = versionToString;
function parseVersion(versionString) {
    var match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match)
        return null;
    return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10)
    };
}
exports.parseVersion = parseVersion;
//# sourceMappingURL=version.js.map