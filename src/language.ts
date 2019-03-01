const objectAssignDeep = require('object-assign-deep')

const languages = {
  en: require('./lang/en.json'),
  ja: require('./lang/ja.json'),
}

module.exports = languages
module.exports.get = lang => {
  return objectAssignDeep(languages['en'], languages[lang])
}
