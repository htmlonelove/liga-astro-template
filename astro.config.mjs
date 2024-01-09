import { defineConfig, squooshImageService } from 'astro/config'
import viteSassGlob from 'vite-plugin-sass-glob-import'
import icon from 'astro-icon'

// const outputPluginStats = () => ({
//   name: 'output-plugin-stats',
//   configResolved(config) {
//     const plugins = config.plugins.map((plugin) => plugin.name)
//     console.log(`Your project has ${plugins.length} Vite plugins.`)
//     console.table(plugins)
//   }
// }) // показывает все подключенные плагины

// const noAttr = () => {
//   return ({
//     name: 'no-attribute',
//     enforce: 'post',
//     transformIndexHtml(html) {
//       return html.replace('type="module"', '')
//     },
//   })
// } // должен убирать type="module" из тега скрипт

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://htmlonelove.github.io',
  compressHTML: false,
  output: 'static',
  publicDir: './public',
  build: {
    format: 'file', // вытаскивает вложенные страницы в корень src/pages/subpage/subpage.html => dist/subpage.html
    assets: 'assets', // собирает скрипты и стили в папку dist/assets
    assetsPrefix: '.', // добавляет `.` в пути скриптов и стилей
    // inlineStylesheets: 'never', // запрещает инлайн стилей
  },
  image: {
    service: squooshImageService(),
  },
  integrations: [
    icon({
      svgoOptions: {
        plugins: [
          'preset-default'
        ],
      },
    })
  ],
  vite: {
    build: {
      assetsInlineLimit: 0, // запрещает инлайн скриптов. по дефолту инлайнит скрипты в html
      cssCodeSplit: false, // css в один файл
      rollupOptions: {
        output: {
          entryFileNames: 'scripts.js',
          assetFileNames: (assetInfo) => {
            return assetInfo.name === 'style.css'
              ? `${assetInfo.name}` // задается имя и папка (корень) для css
              : `assets/${assetInfo.name}` // задается имя и папка картинкам
          },
        },
      },
    },
    plugins: [
      viteSassGlob()
    ],
  },
})
