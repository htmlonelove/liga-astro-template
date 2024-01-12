import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { astroTemplate, scssTemplate } from './template.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = 'src'
const FILENAME = 'gen-component'
const SEPARATOR = ':'
// eslint-disable-next-line no-undef
const userInput = process.argv[process.argv.length - 1]
let componentName = null
let outputFolder = null

const outputFolders = {
  component: '/components',
  ui: '/ui',
  layout: '/layouts'
}

const defineNames = new Promise((next, reject) => {
  if (userInput.indexOf(SEPARATOR) === -1) {
    outputFolder = ROOT + outputFolders['component']
    componentName = userInput
    next()
  } else {
    componentName = userInput.slice(0, userInput.indexOf(':'))
    const folder = userInput.slice(userInput.indexOf(':') + 1, userInput.length)
    if (outputFolders[folder]) {
      outputFolder = ROOT + outputFolders[folder]
      next()
    } else {
      reject(
        `❌ ':${folder}' not allowed;\n👉 allowed options -${Object.keys(
          outputFolders
        ).map((el) => ` :${el}`)}`
      )
    }
  }
})

const checkComponentName = new Promise((next, reject) => {
  if (resolve(__dirname, FILENAME) == componentName) {
    return reject('🚫 enter component name')
  }

  componentName =
    componentName[0].toUpperCase() +
    componentName.slice(1, componentName.length)
  next()
})

const checkOverride = new Promise((next, reject) => {
  if (existsSync(`${outputFolder}/${componentName}`)) {
    return reject('❌ folder already exists')
  }

  next()
})

const createFolder = () =>
  new Promise((next) => {
    mkdirSync(`${outputFolder}/${componentName}`, { recursive: true })

    next()
  })

const createComponent = () =>
  new Promise((next) => {
    writeFileSync(
      `${outputFolder}/${componentName}/${componentName}.astro`,
      astroTemplate(componentName)
    )
    writeFileSync(
      `${outputFolder}/${componentName}/${componentName}.scss`,
      scssTemplate()
    )

    next()
  })

Promise.all([defineNames, checkComponentName, checkOverride])
  .then(() => console.info('✨ Checks completed!\n💫 Generating component...'))
  .then(() => Promise.all([createFolder(), createComponent()]))
  .then(() =>
    console.info(`✅ Created: '${componentName}' in '${outputFolder}'`)
  )
  .catch((err) => console.error(err))
