import '@nomiclabs/hardhat-waffle'

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
  abiExporter: {
    path: './build',
    flat: true,
    spacing: 2,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10"
      }
    ]
  } 
}
