process.env.NODE_ENV = 'test'
module.exports = {
  require: '@swc-node/register',
  timeout: 50000,
  spec: 'test/**/*.{js,ts}'
}
