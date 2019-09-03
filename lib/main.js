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
function pipInstall() {
    return __awaiter(this, void 0, void 0, function* () {
        const userName = core.getInput('userName');
        const authUrl = core.getInput('authUrl');
        const projectDomainName = core.getInput('projectDomainName');
        const userPassword = core.getInput('userPassword');
        const userDomainName = core.getInput('userDomainName');
        const projectName = core.getInput('projectName');
        const clusterName = core.getInput('clusterName');
        let args1 = ['install', 'wheel'];
        let pipPath = "pip";
        let openstackPath = "openstack";
        const toolRunner1 = new toolrunner_1.ToolRunner(pipPath, args1);
        yield toolRunner1.exec();
        core.debug(`pip install wheel`);
        let args2 = ['install', 'python-openstackclient'];
        const toolRunner2 = new toolrunner_1.ToolRunner(pipPath, args2);
        yield toolRunner2.exec();
        core.debug(`pip install openstack-client`);
        let args3 = ['install', 'python-magnumclient'];
        const toolRunner3 = new toolrunner_1.ToolRunner(pipPath, args3);
        yield toolRunner3.exec();
        core.debug(`pip install python-magnumclient`);
        let args4 = ['coe', 'cluster', 'config', clusterName, '--os-auth-url', authUrl, '--os-identity-api-version', '3', '--os-project-name', projectName, '--os-project-domain-name', projectDomainName, '--os-username', userName, '--os-user-domain-name', userDomainName, '--os-password', userPassword];
        const toolRunner4 = new toolrunner_1.ToolRunner(openstackPath, args4, { failOnStdErr: true, ignoreReturnCode: false, silent: true });
        yield toolRunner4.exec();
        core.debug(`openstack coe cluster config`);
    });
}
function exportKubeconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        core.exportVariable('KUBECONFIG', './config');
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
        yield pipInstall();
        yield exportKubeconfig();
        yield kubectl();
    });
}
run();
