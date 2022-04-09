#!/usr/bin/env node

const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const { program, Option } = require('commander')
const {
  getConfig,
  getPrettier,
  getExtensions,
  getIndexTemplate,
  addDefaultExport,
} = require('./helpers')

async function main() {
  // Load our package.json, so that we can pass the version onto `commander`.
  const { version } = require('../package.json')

  // Get the default config for this component (looks for local/global overrides,
  // falls back to sensible defaults).
  const config = getConfig()

  // Convenience wrapper around Prettier, so that config doesn't have to be
  // passed every time.
  const prettify = getPrettier(config.prettierConfig)

  // Build CLI here
  program
    .version(version)
    .argument('<componentName>')
    .addOption(
      new Option(
        '-t, --type <componentType>',
        'Type of React component to generate (default: functional)'
      )
        .choices(['functional', 'class', 'pure'])
        .default(config.type)
    )
    .addOption(
      new Option(
        '-x, --extension <fileExtension>',
        'Which file extension to use for the component (default: javascript)'
      )
        .choices(['javascript', 'typescript'])
        .default(config.extension)
    )
    .option('--default', 'Add a default export to files')
    .option(
      '-d, --dir <pathToDirectory>',
      'Path to the "components" directory (default: src/components)',
      config.dir
    )
    .parse(process.argv)

  // get component name
  const [componentName] = program.args

  // get extensions
  const [componentExt, indexExt] = getExtensions(program.opts().extension)

  // Find the path to the selected template file.
  const templatePath = `./templates/${program.opts().type}.js`

  // Get all of our file paths worked out, for the user's project.
  const parentDir = program.opts().dir
  const componentDir = `${parentDir}/${componentName}`
  const componentPath = `${componentDir}/${componentName}${componentExt}`
  const indexPath = `${componentDir}/index${indexExt}`

  // Check if componentName is provided
  if (!componentName) {
    console.error('A component name must be given.')
    process.exit(0)
  }

  // Check to see if a directory at the given path exists
  const fullPathToParentDir = path.resolve(parentDir)
  if (!fs.existsSync(fullPathToParentDir)) {
    console.error(
      `Sorry, you need to create a parent directory.\n(new-component is looking for a directory at ${
        program.opts().dir
      })`
    )
    process.exit(0)
  }

  // Check to see if this component has already been created
  const fullPathToComponentDir = path.resolve(componentDir)
  if (fs.existsSync(fullPathToComponentDir)) {
    console.error('Looks like this component already exists!')
    process.exit(0)
  }

  // Start by creating the directory that our component lives in.
  await fsp.mkdir(componentDir)

  // Replace our placeholders with real data
  const indexTemplate = prettify(
    getIndexTemplate(componentName, program.opts().default)
  )
  const template = await fsp.readFile(
    path.join(__dirname, templatePath),
    'utf-8'
  )
  let modifiedTemplate = template.replace(/COMPONENT_NAME/, componentName)
  if (program.opts().default) {
    modifiedTemplate = addDefaultExport(componentName, modifiedTemplate)
  }

  // Format it using prettier, to ensure style consistency, and write to file.
  const prettyTemplate = prettify(modifiedTemplate)
  await fsp.writeFile(componentPath, prettyTemplate, 'utf-8')

  // We also need the `index.js` file, which allows easy importing.
  await fsp.writeFile(indexPath, indexTemplate, 'utf-8')
}

main()
