#!/usr/bin/env node

/* eslint-disable no-process-exit, no-console, node/shebang */
// @flow

import program from 'commander';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import createPages from './create-pages';
import appPackage from '../package.json';

program
  .version(appPackage.version)
  .usage('[options] <file>')
  .option(
    '--out-dir <dir>',
    'The output directory where the pages will be written to',
  )
  .parse(process.argv);

const { args, outDir } = program;

if (args.length <= 0) {
  console.log(chalk.red('Please provide a file.'));
  process.exit(1);
}

if (args.length > 1) {
  console.log(chalk.red('Only one file is supported.'));
  process.exit(1);
}

if (outDir == null) {
  console.log(chalk.red('out-dir not given.'));
  process.exit(1);
}

const [fileName] = args;
const currentPath = process.cwd();
const outputDirectory = path.join(currentPath, outDir);
const filePath = path.join(currentPath, fileName);

if (!fs.existsSync(outputDirectory)) {
  console.log(chalk.red(`out-dir '${outputDirectory}'' does not exist.`));
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.log(chalk.red(`file '${filePath}' does not exist.`));
  process.exit(1);
}

createPages(filePath, outputDirectory);
