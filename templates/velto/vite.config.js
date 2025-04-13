import { transformAsync, BabelFileResult } from '@babel/core';
import velto from '@velto/babel-plugin-velto';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vitePluginLite()],
})

function vitePluginLite() {

  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-velto',
    enforce: 'pre',

    async transform(source, id) {
      if (!(/\.js[x]?$/i.test(id))) {
        return null;
      }

      id = id.replace(/\?.+$/, '');

      const { code, map } = await transformAsync(source, {
        root: projectRoot,
        filename: id,
        sourceFileName: id,
        presets: [],
        plugins: [velto],
        ast: false,
        sourceMaps: true,
      });

      return { code: code ?? undefined, map };
    },
  };
}