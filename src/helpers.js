const os = require('os')
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')

const { requireOptional } = require('./utils')
/**
 * Get configuration for the component.
 * Priority:
 *  - Default
 *  - globally set configuration
 *  - locally set configuration
 * @returns any
 */
module.exports.getConfig = () => {
  const homeDir = os.homedir()
  const currentDir = process.cwd()

  const defaultConfig = {
    type: 'functional',
    dir: 'src/components',
    extension: 'js',
  }

  const globalConfig = requireOptional(`/${homeDir}/nc-config.json`)
  const localConfig = requireOptional(`/${currentDir}/nc-config.json`)

  return Object.assign({}, defaultConfig, globalConfig, localConfig)
}

/**
 * Get prettier function with configuration added
 * @param {string} config Prettier configuration object
 * @returns function
 */
module.exports.getPrettier = config => {
  let prettierConfig = config

  if (!prettierConfig) {
    const currentDir = process.cwd()

    try {
      prettierConfig = fs.readFileSync(path.join(currentDir, '/.prettierrc'))
    } catch (error) {
      // no .prettierrc file, no problem
    }

    if (prettierConfig) {
      try {
        prettierConfig = JSON.parse(prettierConfig)
      } catch (error) {
        console.error(
          'Error parsing prettierrc, it does not appear to be valid JSON.'
        )
      }
    }
  }

  return text => prettier(text, prettierConfig)
}

/**
 * Get component and index extension based on environment type
 * @param {string} extensionType Type of extension to return: Javascript | Typescript
 * @returns [string, string]
 */
module.exports.getExtensions = extensionType => {
  if (extensionType.toLowerCase() === 'javascript') {
    return ['.jsx', '.js']
  } else {
    return ['.tsx', '.ts']
  }
}
