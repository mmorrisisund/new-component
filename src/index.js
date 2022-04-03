#!/usr/bin/env node

const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const { program } = require('commander')

async function main() {
  // Load our package.json, so that we can pass the version onto `commander`.

  // Get the default config for this component (looks for local/global overrides,
  // falls back to sensible defaults).

  // Convenience wrapper around Prettier, so that config doesn't have to be
  // passed every time.

  // Build CLI here
  program.argument('<componentName>').parse(process.argv)

  // get component name
  const [componentName] = program.args
  // Find the path to the selected template file.
  const templatePath = `./templates/functional.js`

  // Get all of our file paths worked out, for the user's project.
  const componentDir = `src/components/${componentName}`
  const componentPath = `${componentDir}/${componentName}.js`
  const indexPath = `${componentDir}/index.js`

  // Our index template is super straightforward, so we'll just inline it for now.
  const indexTemplate = `\
  export * from './${componentName}';
  export { default } from './${componentName}';
  `
  // Check if componentName is provided
  if (!componentName) {
    console.error('A component name must be given.')
    process.exit(0)
  }

  // Check to see if a directory at the given path exists
  const fullPathToParentDir = path.resolve('src/components')
  console.log(fullPathToParentDir)
  if (!fs.existsSync(fullPathToParentDir)) {
    console.error(
      'Sorry, you need to create a parent directory.\n(new-component is looking for a directory at ./src/components)'
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

  // Replace our placeholders with real data (so far, just the component name)
  const template = await fsp.readFile(
    path.join(__dirname, templatePath),
    'utf-8'
  )
  const modifiedTemplate = template.replace(/COMPONENT_NAME/, componentName)
  await fsp.writeFile(componentPath, modifiedTemplate, 'utf-8')

  // Format it using prettier, to ensure style consistency, and write to file.

  // We also need the `index.js` file, which allows easy importing.
  await fsp.writeFile(indexPath, indexTemplate, 'utf-8')
}

main()
