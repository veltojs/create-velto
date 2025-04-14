#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import degit from 'degit';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'node:url'

const pwd = process.cwd();
const VERSION = '1.0.0';
const templateList = ['velto', 'velto-ts'];

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

const command = async (projectName: string, options: Record<string, string>) => {
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManagerName = pkgInfo?.name ?? 'npm';
  
  try {
    if (!projectName) {
      const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Project name: ',
        validate: (input) => !!input.trim() || 'Project name is required',
      });
      projectName = name;
    }

    const targetDir = path.resolve(projectName);
    if (fs.existsSync(targetDir)) {
      const { overwrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'overwrite',
        message: 'The directory already exists, is it overwritten?',
        default: false,
      });
      if (!overwrite) process.exit(1);
      await fs.remove(targetDir);
    }

    let template = options.template;
    if (!options.template || !templateList.includes(template)) {
      const { selectedTemplate } = await inquirer.prompt({
        type: 'list',
        name: 'selectedTemplate',
        message: options.template
          ? `"${template}" isn't a valid template. Please choose from below: `
          : 'Select a template: ',
        choices: templateList,
      });
      template = selectedTemplate;
    }

    const templatePath = path.resolve(
      fileURLToPath(import.meta.url),
      `../../templates/${template}`,
    )

    // const emitter = degit(templatePath, {
    //   cache: false,
    //   force: true,
    // });
    // await emitter.clone(targetDir);
    await fs.copy(templatePath, targetDir);

    const packagePath = path.join(targetDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      pkg.name = projectName;
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    }

    console.log('Done. Now run:  ');
    console.log(
      chalk.yellow(`\ncd ${projectName}`),
      chalk.yellow(`\n${pkgManagerName} install`),
      chalk.yellow(`\n${pkgManagerName} run dev`),
      '\n',
    );
  } catch (error) {
    console.error(chalk.red('❌ Error: '), error);
    process.exit(1);
  }
}

program
  .version(VERSION)
  .argument('[project-name]', 'Project name')
  .option('-t, --template <template>', 'template')
  .action(command);
program.parse(process.argv);
