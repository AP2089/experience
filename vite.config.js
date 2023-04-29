import { defineConfig } from 'vite';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import nunjucks from 'vite-plugin-nunjucks';
import viteImagemin from 'vite-plugin-imagemin';
import vitePluginAutoGenerationWebp from './plugins/vite-plugin-auto-generation-webp';
import vitePluginHtmlBeautify from './plugins/vite-plugin-html-beautify';

export default defineConfig(({ command }) => {
  const config = {
    root: path.resolve(process.cwd(), 'src'),
    build: {
      emptyOutDir: true,
      outDir: path.resolve(__dirname, 'dist')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'node_modules')
      },
      extensions: ['.js', '.json', '.scss', '.html']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_config.scss";
            @import "@/styles/_mixins.scss";
          `
        }
      }
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/sprites')],
        symbolId: '[name]',
        inject: 'body-first',
        customDomId: 'sprite-svg'
      }),
      nunjucks.default({
        nunjucksEnvironment: {
          filters: {
            typeof: value => typeof value,
            json: value => value.trim().length ? JSON.parse(value) : null,
            merge: (obj1, obj2) => {
              if (typeof obj1 === 'object' && typeof obj2 === 'object') {
                return { ...obj1, ...obj2 }
              }

              return null;
            }
          }
        }
      }),
      vitePluginAutoGenerationWebp({
        src: [
          './src/images/**/*.{png,jpg,jpeg}',
          './public/images/**/*.{png,jpg,jpeg}'
        ]
      })
    ]
  }

  if (command === 'build') {
    config.base = '/experience/';

    config.plugins = [
      ...config.plugins,
      vitePluginHtmlBeautify({
        indent_size: 2,
        preserve_newlines: false,
        extra_liners: []
      }),
      viteImagemin(),
    ]
  }

  return config;
});