import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json';

export default defineConfig({
  build: { minify: true },
  plugins: [
    monkey({
      entry: 'src/index.ts',
      build: {
        externalGlobals: {
          jquery: ['$', 'https://cdn.hellolin.top/npm/jquery@3.7.1/dist/jquery.min.js'],
        },
      },
      userscript: {
        name: pkg.name,
        namespace: pkg.name,
        description: pkg.description,
        author: pkg.author,
        version: pkg.version,
        license: pkg.license,
        connect: ['www.luogu.com.cn'],
        match: ['*://www.luogu.com.cn'],
      },
    }),
  ],
});
