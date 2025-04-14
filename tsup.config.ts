import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/index.ts'],
  format: ['esm'],      // 输出 ES 模块
  outExtension: () => ({ js: '.mjs' }), // 扩展名设为 .mjs
  dts: false,             // 生成类型声明文件
  clean: true,
  target: 'esnext',  
});