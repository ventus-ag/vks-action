import * as core from '@actions/core';
import { ToolRunner, argStringToArray } from "@actions/exec/lib/toolrunner";

const exec = require('@actions/exec');

async function runOpenstackClusterConfig() {
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
    const toolRunner = new ToolRunner(openstackPath, args, { failOnStdErr: false, ignoreReturnCode: true, silent: true });
    core.debug(`openstack coe cluster config`);    
    await toolRunner.exec();
    core.exportVariable('KUBECONFIG', './config');
    await exec.exec('kubectl cluster-info');
}

async function exportKubeconfig() {
    core.exportVariable('KUBECONFIG', './config');
}

async function pipInstall(args: string[]) {
    const pipPath = "pip";
    const toolRunner = new ToolRunner(pipPath, args, { silent: true });
    core.debug(`pip install ` + args[1]);
    const code = await toolRunner.exec();
    if (code != 0) {
        throw new Error(args[1] + ' installation failed.')
    }
}

// test run: kubectl cluster-info
async function kubectl() {
    await exec.exec('kubectl cluster-info');
}

async function run() {
    let args = ['install', 'wheel'];
    await pipInstall(args);
    args = ['install', 'python-openstackclient'];
    await pipInstall(args);
    args = ['install', 'python-magnumclient'];
    await pipInstall(args);
    setTimeout(function(){
    //do what you need here
    }, 2000);
    await runOpenstackClusterConfig()
    //await exportKubeconfig();
    //await kubectl();
}

run();
