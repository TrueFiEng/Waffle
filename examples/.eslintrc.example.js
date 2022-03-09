const baseConfig = require('../.eslintrc.json')

module.exports = {
  ...baseConfig,
  overrides: [
    {
      files: [
        "test/**/*.ts"
      ],
      rules: {
        "import/no-extraneous-dependencies": "off"
      }
    }
  ]
}
