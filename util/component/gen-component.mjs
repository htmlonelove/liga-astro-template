import fs from 'fs'
import inquirer from 'inquirer'
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt'
import uppercamelcase from 'uppercamelcase'
import { astroTemplate, scssTemplate } from './template.js'
import path from 'path'
import chalk from "chalk";

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

inquirer
  .prompt([
    {
      name: 'componentName',
      message: chalk.blueBright('Введите название компонента:')
    },
    {
      name: 'componentFolder',
      message: chalk.blueBright('Выберите директорию:'),
      type: 'file-tree-selection',
      root: './src',
      onlyShowDir: true,
      onlyShowValid: true,
      validate: (input) => {
        const dirName = input.split(path.sep).pop()
        return ['components', 'layouts', 'ui', 'modules'].includes(dirName)
      },
      transformer: (input) => {
        return input.split(path.sep).pop()
      }
    }
  ])
  .then((answers) => {
  const { componentName, componentFolder } = answers

  console.log(chalk.greenBright('📜 Используем шаблон компонента с названием: ' + chalk.whiteBright(uppercamelcase(componentName))))

  const componentDirectory = `${componentFolder}/${uppercamelcase(
    componentName
  )}`

  if (fs.existsSync(componentDirectory)) {
    console.error(chalk.red(`❌ Компонет ${chalk.whiteBright(uppercamelcase(componentName))} уже существует`))
    process.exit(1)
  }

  if (!fs.existsSync(componentDirectory)) {
    fs.mkdirSync(componentDirectory, {
      recursive: true
    })
  }

  const generatedTemplates = [astroTemplate, scssTemplate].map((template) =>
    template(uppercamelcase(componentName))
  )

  generatedTemplates.forEach((template) => {
    fs.writeFileSync(
      `${componentDirectory}/${template.filename}`,
      template.content
    )
  })

  const dirName = `./src/${componentFolder.split(path.sep).pop()}`
  console.log(`✅  ${chalk.greenBright(`Создан компонент`)} ${chalk.whiteBright(uppercamelcase(componentName))} ${chalk.greenBright('в директории')} ${chalk.whiteBright(dirName)}`)
})
