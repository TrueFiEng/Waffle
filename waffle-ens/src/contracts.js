/* eslint-disable import/no-extraneous-dependencies */

const contracts = [
  'DNSResolver',
  'Deed',
  'DeedImplementation',
  'DefaultReverseResolver',
  'ENS',
  'ENSRegistry',
  'FIFSRegistrar',
  'HashRegistrar',
  'Migrations',
  'OwnedResolver',
  'PublicResolver',
  'Registrar',
  'Resolver',
  'ReverseRegistrar',
  'TestRegistrar'
];

try {
  for (const contract of contracts) {
    exports[contract] = require(`../contracts/${contract}.json`);
  }
} catch (contractsRequireError) {
  try {
    module.exports = {
      ...require('@ensdomains/ens'),
      ...require('@ensdomains/resolver')
    };
  } catch {
    // If the dependencies are missing, a descriptive error is thrown
    // when trying to use one of the ENS functions.
  }
}
