import {expect} from 'chai';
import {flatten, flattenAndSave, IMPORT_SOLIDITY_REGEX} from '../../src/flattener';
import {inputToConfig} from '../../src/config';
import fs from 'fs-extra';
import {gatherSources} from '@resolver-engine/imports';
import {findInputs} from '../../src/findInputs';
import {ImportsFsEngine, resolvers} from '@resolver-engine/imports-fs';

const sourceDirectory = './test/projects/example';
const flattenOutputDirectory = './test/flattener/flattenFiles';
const compilerVersion = 'v0.5.9+commit.e560f70d';
const config = inputToConfig({
  sourceDirectory,
  flattenOutputDirectory,
  compilerVersion
});

describe('flattening', () => {
  it('just flat', async () => {
    const output = await flatten(config);

    expect(output.some(contract => IMPORT_SOLIDITY_REGEX.test(contract.source))).to.be.false;
  });

  describe('saving to file', () => {
    after(async () => {
      await fs.remove(flattenOutputDirectory);
    });

    it('saves to file', async () => {
      await flattenAndSave(config);

      const resolver = ImportsFsEngine().addResolver(
        // Backwards compatibility - change node_modules path
        resolvers.BacktrackFsResolver(config.nodeModulesDirectory)
      );

      const flatted = await gatherSources(
        findInputs(flattenOutputDirectory),
        '.',
        resolver
      );

      expect(flatted.some(contract => IMPORT_SOLIDITY_REGEX.test(contract.source))).to.be.false;
    });
  });
});
