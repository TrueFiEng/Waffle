import '@nomiclabs/hardhat-waffle'

module.exports = {
  networks: {
    hardhat: {
      initialDate: '2020-01-01T00:00:00',
      allowUnlimitedContractSize: true,
    },
  }
}
