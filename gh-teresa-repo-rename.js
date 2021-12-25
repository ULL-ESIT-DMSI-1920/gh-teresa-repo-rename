#!/usr/bin/env node

const ins = require("util").inspect;
const deb = (...args) => { 
    if (debug) console.log(ins(...args, {depth: null})); 
};

const fs = require("fs");
const shell = require('shelljs');
const { program } = require('commander');
const {version} = require("./package.json");

program 
  .version(version)
  .option('-o, --org <organization>', 'specifies the organization')
  .option('-r, --repo <reponame>', 'specifies the repository')
  .option('-n, --name <name>', 'name');

program.parse(process.argv);

let args = program.args;

let { org, repo, name } = program.opts();

if (!org || ! repo || !name) program.help();

if (!shell.which('git')) {
    shell.echo('Sorry, this extension requires git');
}
if (!shell.which('gh')) {
   shell.echo('Sorry, this extension requires GitHub Cli');
}

let r = shell.exec(
    `gh api -X PATCH /repos/${org}/${repo} -f name=${name}`, 
    {silent: true}
);

r = JSON.parse(r.stdout)
console.log(`The repo has been renamed to ${r.full_name}`);