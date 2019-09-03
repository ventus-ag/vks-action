import * as core from '@actions/core';
import { ToolRunner, argStringToArray } from "@actions/exec/lib/toolrunner";

const exec = require('@actions/exec');

async function pipInstall() {
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

    const toolRunner1 = new ToolRunner(pipPath, args1);
    await toolRunner1.exec();
    core.debug(`pip install wheel`);


    let args2 = ['install', 'python-openstackclient'];
    const toolRunner2 = new ToolRunner(pipPath, args2);
    await toolRunner2.exec();
    core.debug(`pip install openstack-client`);

    let args3 = ['install', 'python-magnumclient'];
    const toolRunner3 = new ToolRunner(pipPath, args3);
    await toolRunner3.exec();
    core.debug(`pip install python-magnumclient`);
    
    let args4 = ['coe', 'cluster', 'config', clusterName, '--os-auth-url', authUrl, '--os-identity-api-version', '3', '--os-project-name', projectName, '--os-project-domain-name', projectDomainName, '--os-username', userName, '--os-user-domain-name', userDomainName, '--os-password', userPassword];
    const toolRunner4 = new ToolRunner(openstackPath, args4, { failOnStdErr: true, ignoreReturnCode: true, silent: false });
    await toolRunner4.exec();
    core.debug(`openstack coe cluster config`);    
    }

async function exportKubeconfig() {
    core.exportVariable('KUBECONFIG', './config');
  }

// test run: kubectl cluster-info
async function kubectl() {
    await exec.exec('kubectl cluster-info');
    }

async function run() {
    await pipInstall();
    await exportKubeconfig();
    await kubectl();
}

run();
