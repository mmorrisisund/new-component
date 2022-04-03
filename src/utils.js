/**
 * Attempt to import file that may or may not
 * exist
 *
 * @param {string} filepath filepath to try to import
 * @returns any
 */
module.exports.requireOptional = filepath => {
  try {
    return require(filepath)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
  }
}
