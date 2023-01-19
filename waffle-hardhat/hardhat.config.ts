import 'hardhat-waffle-dev'

module.exports = {
  networks: {
    hardhat: {
      initialDate: '2020-01-01T00:00:00',
      allowUnlimitedContractSize: true,
    },
  },
  paths: {
    sources: './contracts',
    artifacts: './build',
    cache: './cache',
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10"
      }
    ]
  },
  waffle: {
    injectCallHistory: true
  }
}
