process.env.NODE_ENV = 'test'
module.exports = {
  require: 'ts-node/register',
  timeout: 50000,
  spec: 'test/**/*.{js,ts}'
}
