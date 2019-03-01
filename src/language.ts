import objectAssignDeep = require('object-assign-deep')

const languages = {
  en: require('./lang/en.json'),
  ja: require('./lang/ja.json'),
}

export = {
  ...languages,
  get(lang) {
    return objectAssignDeep(languages['en'], languages[lang])
  },
}
