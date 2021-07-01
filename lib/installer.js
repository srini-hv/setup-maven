"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTekton = void 0;
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
if (!tempDirectory) {
    let baseLocation;
    if (process.platform === 'win32') {
        baseLocation = process.env['USERPROFILE'] || 'C:\\';
    }
    else {
        if (process.platform === 'darwin') {
            baseLocation = '/Users';
        }
        else {
            baseLocation = '/home';
        }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
}
function getTekton(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let toolPath;
        toolPath = tc.find('tkn', version);
        if (!toolPath) {
            toolPath = yield downloadTekton(version);
        }
        toolPath = path.join(toolPath, 'bin');
        core.debug(`toolPath = ${toolPath}`);
        core.addPath(toolPath);
    });
}
exports.getTekton = getTekton;
function downloadTekton(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const toolDirectoryName = `tekton-${version}`;
        const os = process.platform;
        core.debug(`OS = '${os}'`);
        const downloadUrl = `https://github.com/tektoncd/cli/releases/download/${version}/tkn_${version}_${os}_x86_64.tar.gz&action=download`;
        core.debug(`downloading ${downloadUrl}`);
        try {
            const downloadPath = yield tc.downloadTool(downloadUrl);
            const extractedPath = yield tc.extractTar(downloadPath);
            let toolRoot = path.join(extractedPath, toolDirectoryName);
            return yield tc.cacheDir(toolRoot, 'tkn', version);
        }
        catch (err) {
            throw err;
        }
    });
}
