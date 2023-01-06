#!/usr/bin/env node

const { exec } = require("child_process");
const { writeFileSync } = require("fs");

async function readExecOutput(script) {
  return new Promise((resolve, reject) => {
    exec(script, (err, stdout, stderr) => {
      if (!!err || !!stderr || !stdout) {
        reject(`Error running script: ${script}`);
        return;
      }

      resolve(stdout.trimEnd());
    });
  });
}

async function getBranchName() {
  return readExecOutput("git branch --show-current");
}

async function getBranchCommit(branchName) {
  return readExecOutput(`git rev-parse "${branchName}"`);
}

async function main() {
  const branchName = await getBranchName();
  const branchCommit = await getBranchCommit(branchName);
  writeFileSync(`./!gitrev__${branchName}@${branchCommit}`, "");
}

main();
