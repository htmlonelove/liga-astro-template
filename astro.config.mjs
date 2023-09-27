import { defineConfig } from 'astro/config'

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
//       name: "no-attribute",
//       transformIndexHtml(html) {
//        return html.replace(`type="module"`, "");
//       }
//   })
// } // должен убирать type="module" из тега скрипт

// https://astro.build/config
export default defineConfig({
  compressHTML: false,
  output: 'static',
  publicDir: './public',
  build: {
    format: 'file', // вытаскивает вложенные страницы в корень src/pages/subpage/subpage.html => dist/subpage.html
    assets: 'assets', // собирает скрипты и стили в папку dist/assets
    assetsPrefix: '.', // добавляет `.` в пути скриптов и стилей
    // inlineStylesheets: 'never', // запрещает инлайн стилей
  },
  vite: {
    build: {
      assetsInlineLimit: 0, // запрещает инлайн скриптов. по дефолту инлайнит скрипты в html
      cssCodeSplit: false, // css в один файл
      rollupOptions: {
        output: {
          entryFileNames: 'assets/scripts.js',
          assetFileNames: (assetInfo) => {
            return `assets/${assetInfo.name}` // тут задается имя для css всех страниц
          },
        },
      },
    },
  },
  plugins: [],
})

