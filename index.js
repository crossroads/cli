#!/usr/bin/env node

require('dotenv').config()

const { Command }       = require('commander');
const { version}        = require('./package.json');
const { task, logger }  = require('./lib/output');
const env               = require('./lib/env');
const fs                = require('fs');
const os                = require('os');
const path              = require('path');
const Git               = require('simple-git');
const { execSync }      = require('child_process');
const { Octokit }       = require('@octokit/core')

const program = new Command();
const notesGenerator = path.join(__dirname, 'node_modules/.bin/release-notes');

program.version(version)

program
  .command('release <repo> <version>')
  .description('Creates a release PR for the specified project')
  .action(async (repo, version) => {
    const git     = Git();
    const octokit = new Octokit({ auth: env.read('GITHUB_TOKEN') });

    env.assert('JIRA_USERNAME');
    env.assert('JIRA_PASSWORD');

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'goodcity-repo-'));

    await task(`Cloning ${repo}`, () => git.clone(`git@github.com:crossroads/${repo}.git`, tmp));

    const body = await task('Generating release notes', () => {
      return execSync(`${notesGenerator}`, { cwd: tmp, stdio: 'pipe' }).toString();
    });

    const owner = 'crossroads';
    const title = `[Release] v${version}`;
    const head  = 'master';
    const base  = 'live';

    const response = await task('Creating release PR', () => octokit.request(
      `POST /repos/{owner}/{repo}/pulls`, { owner, repo, title, body, head, base }
    ));

      logger.success('done');
  });


program.parse(process.argv);
