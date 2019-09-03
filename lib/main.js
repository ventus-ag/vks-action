"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const toolrunner_1 = require("@actions/exec/lib/toolrunner");
const exec = require('@actions/exec');
function runOpenstackClusterConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const userName = core.getInput('userName', { required: true });
        const authUrl = core.getInput('authUrl', { required: true });
        const projectDomainName = core.getInput('projectDomainName');
        const userPassword = core.getInput('userPassword', { required: true });
        const userDomainName = core.getInput('userDomainName');
        const projectName = core.getInput('projectName', { required: true });
        const clusterName = core.getInput('clusterName', { required: true });
        let openstackPath = "openstack";
        let args = ['coe', 'cluster',
            'config', clusterName,
            '--os-auth-url', authUrl,
            '--os-identity-api-version', '3',
            '--os-project-name', projectName,
            '--os-project-domain-name', projectDomainName,
            '--os-username', userName,
            '--os-user-domain-name', userDomainName,
            '--os-password', userPassword];
        const toolRunner = new toolrunner_1.ToolRunner(openstackPath, args, { failOnStdErr: false, ignoreReturnCode: true, silent: true });
        core.debug(`openstack coe cluster config`);
        yield toolRunner.exec();
        core.exportVariable('KUBECONFIG', './config');
        yield exec.exec('kubectl cluster-info');
    });
}
function exportKubeconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        core.exportVariable('KUBECONFIG', './config');
    });
}
function pipInstall(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const pipPath = "pip";
        const toolRunner = new toolrunner_1.ToolRunner(pipPath, args, { silent: true });
        core.debug(`pip install ` + args[1]);
        const code = yield toolRunner.exec();
        if (code != 0) {
            throw new Error(args[1] + ' installation failed.');
        }
    });
}
// test run: kubectl cluster-info
function kubectl() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec.exec('kubectl cluster-info');
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let args = ['install', 'wheel'];
        yield pipInstall(args);
        args = ['install', 'python-openstackclient'];
        yield pipInstall(args);
        args = ['install', 'python-magnumclient'];
        yield pipInstall(args);
        setTimeout(function () {
            //do what you need here
        }, 2000);
        yield runOpenstackClusterConfig();
        //await exportKubeconfig();
        //await kubectl();
    });
}
run();
