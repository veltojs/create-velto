#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import degit from 'degit';
import fs from 'fs-extra';
import path from 'path';

// 定义元数据
const VERSION = '1.0.0';
const DEFAULT_TEMPLATE = 'user/github-repo'; // 替换为你的模板仓库

program
  .version(VERSION)
  .argument('[project-name]', '项目名称')
  .option('-t, --template <template>', '指定模板')
  .action(async (projectName, options) => {
    try {
      // 1. 获取项目名称
      if (!projectName) {
        const { name } = await inquirer.prompt({
          type: 'input',
          name: 'name',
          message: '项目名称：',
          validate: input => !!input.trim() || '名称不能为空',
        });
        projectName = name;
      }

      // 2. 检查目录是否存在
      const targetDir = path.resolve(projectName);
      if (fs.existsSync(targetDir)) {
        const { overwrite } = await inquirer.prompt({
          type: 'confirm',
          name: 'overwrite',
          message: '目录已存在，是否覆盖？',
          default: false,
        });
        if (!overwrite) process.exit(1);
        await fs.remove(targetDir);
      }

      // 3. 选择模板
      let template = options.template || DEFAULT_TEMPLATE;
      if (!options.template) {
        const { selectedTemplate } = await inquirer.prompt({
          type: 'list',
          name: 'selectedTemplate',
          message: '选择模板：',
          choices: ['vue', 'react', 'node'], // 可自定义模板列表
        });
        template = `user/github-repo#${selectedTemplate}`; // 示例格式
      }

      // 4. 下载模板
      console.log(chalk.blue('🚀 下载模板...'));
      const emitter = degit(template, {
        cache: false,
        force: true,
      });
      await emitter.clone(targetDir);

      // 5. 替换变量（可选）
      const packagePath = path.join(targetDir, 'package.json');
      if (fs.existsSync(packagePath)) {
        const pkg = require(packagePath);
        pkg.name = projectName;
        fs.writeJsonSync(packagePath, pkg, { spaces: 2 });
      }

      // 6. 完成提示
      console.log(chalk.green(`✅ 项目创建成功！目录：${targetDir}`));
      console.log(chalk.yellow(`
下一步：
cd ${projectName}
npm install
npm run dev
      `));
    } catch (error) {
      console.error(chalk.red('❌ 错误：'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);