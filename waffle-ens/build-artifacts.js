/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

const {promises: fs} = require('fs');
const path = require('path');
const ens = require('@ensdomains/ens');
const resolver = require('@ensdomains/resolver');

const outputFolder = './dist/contracts/';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    await fs.stat(outputFolder);
  } catch (error) {
    await fs.mkdir(outputFolder, {recursive: true});
  }

  await writeContracts(ens);
  await writeContracts(resolver);
})();

async function writeContracts(package) {
  for (const key in package) {
    await fs.writeFile(path.resolve(outputFolder, `${key}.json`), JSON.stringify(package[key]));
  }
}
