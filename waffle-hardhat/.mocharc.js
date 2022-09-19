process.env.NODE_ENV = 'test'
process.env.WAFFLE_EXPERIMENTAL_HARDHAT_CALL_HISTORY = true
module.exports = {
  require: 'ts-node/register/transpile-only',
  timeout: 50000,
  spec: 'test/**/*.test.{js,ts}',
  file: 'test/test-setup.ts'
}
