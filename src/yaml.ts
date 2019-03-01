import fs = require('fs')
import yaml = require('yaml')

export = {
  readYAMLSync(filename) {
    return yaml.parse(fs.readFileSync(filename, 'utf8'))
  }
}
