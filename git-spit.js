#!/usr/bin/env node

const { exec } = require("child_process");
const { writeFileSync } = require("fs");

async function getBranchName() {
  return new Promise((resolve, reject) => {
    exec("git branch --show-current", (err, stdout, stderr) => {
      console.log(4);

      if (!!err || !!stderr || !stdout) {
        reject("Error getting branch");
        return;
      }

      resolve(stdout);
    });
  });
}

async function getBranchCommit(branchName) {
  return new Promise((resolve, reject) => {
    exec(`git rev-parse "${branchName}"`, (err, stdout, stderr) => {
      console.log(5);

      if (!!err || !!stderr || !stdout) {
        reject("Error getting commit hash");
        return;
      }

      resolve(stdout);
    });
  });
}

async function main() {
  const branchName = await getBranchName();
  const branchCommit = await getBranchCommit(branchName);
  writeFileSync(`./commit-${branchCommit}.txt`);
}

main();
