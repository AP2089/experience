import { defineConfig } from 'vite';
import path from 'path';
import glob from 'glob';
import { fileURLToPath } from 'node:url';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import liveReload from 'vite-plugin-live-reload';
import nunjucks from 'vite-plugin-nunjucks';
import viteImagemin from 'vite-plugin-imagemin';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import vitePluginAutoGenerationWebp from './plugins/vite-plugin-auto-generation-webp';
import vitePluginHtmlBeautify from './plugins/vite-plugin-html-beautify';

export default defineConfig(({ command }) => {
  const isProd = command === 'build';

  return {
    base: isProd ? '/experience/' : '',
    root: path.resolve(process.cwd(), 'src'),
    publicDir: './public',
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: Object.fromEntries(
          glob.sync('src/*.html').map(file => [
            path.relative('src', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ])
        ),
        output: {
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]'
        }
      }
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
      },
      postcss: {
        plugins: [
          autoprefixer()
        ]
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
      }),
      !isProd && liveReload('./components/**/*.{html,scss,json}', {
        alwaysReload: true
      }),
      isProd && vitePluginHtmlBeautify({
        indent_size: 2,
        preserve_newlines: false,
        extra_liners: []
      }),
      isProd && viteImagemin(),
      isProd && legacy()
    ]
  }
});