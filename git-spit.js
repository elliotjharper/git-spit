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

function substituteSlashes(branchName) {
  return branchName.replace("\\", "-").replace("/", "-");
}

async function main() {
  const branchName = await getBranchName();
  const branchCommit = await getBranchCommit(branchName);

  console.log(
    `Writing out marker file for last commit [${branchCommit}] on branch [${branchName}]`
  );

  writeFileSync(
    `./!gitrev__${substituteSlashes(branchName)}@${branchCommit}`,
    ""
  );
}

main();
