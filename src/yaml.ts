import yaml = require('yaml')
const YAML = yaml.default
import fs = require('fs')

require.extensions['.yml'] = function(module, filename) {
  module.exports = YAML.parse(fs.readFileSync(filename, 'utf8'))
}

export = YAML
