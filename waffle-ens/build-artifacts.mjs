import {mkdir, stat, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import ens from '@ensdomains/ens';
import resolver from '@ensdomains/resolver';

const outputFolder = './src/abis/';
const names = ['ENSRegistry', 'FIFSRegistrar', 'ReverseRegistrar', 'PublicResolver']

try {
  await stat(outputFolder);
} catch (error) {
  await mkdir(outputFolder, {recursive: true});
}

await writeContracts(ens);
await writeContracts(resolver);

async function writeContracts(contracts) {
  for (const key in contracts) {
    if(!names.includes(key)) continue;
    await writeFile(resolve(outputFolder, `${key}.json`), JSON.stringify(contracts[key]));
  }
}
