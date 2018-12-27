import chai, {expect} from 'chai';
import ImportsMappingBuilder, {IMPORT_TYPE_A, IMPORT_TYPE_B, IMPORT_TYPE_C} from '../../../lib/wrappers/importMappingBuilder';

chai.use(require('chai-string'));

const customContactPath = './test/compiler/custom/custom_contracts/Custom.sol';

describe('ImportsMappingBuilder', () => {
  let builder;
  let expectedPath;
  let expectedMapping;

  before(() => {
    builder = new ImportsMappingBuilder('./test/compiler/custom/custom_contracts', './test/compiler/custom/custom_node_modules');
    expectedPath = `${process.cwd()}/test/compiler/custom/custom_node_modules/openzeppelin-solidity`;
    expectedMapping = {'openzeppelin-solidity': expectedPath};
  });

  describe('convertPath', () => {
    it('no mapping for local file', async () => {
      expect(builder.getMapping('Custom.sol', customContactPath)).to.deep.eq({});
    });

    it('no mapping for local file in subdir', async () => {
      expect(builder.getMapping('./One.sol', './test/compiler/custom/custom_contracts/sub/Two.sol'
      )).to.deep.eq({});
    });

    it('generates mapping for npm import', async () => {
      const mapping = builder.getMapping('openzeppelin-solidity/CustomSafeMath.sol', customContactPath);
      expect(mapping).to.deep.eq(expectedMapping);
    });

    it('generates mapping for import directive type A (no transformation)', async () => {
      const input = 'import "Custom.sol";';
      expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContactPath)).to.deep.eq({});
    });

    it('generates mapping for import directive type A', async () => {
      const input = 'import "openzeppelin-solidity/CustomSafeMath.sol";';
      expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContactPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for import directive type A with as', async () => {
      const input = 'import "openzeppelin-solidity/CustomSafeMath.sol" as SomeName;';
      expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContactPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for import directive type B', async () => {
      const input = 'import * as SomeName from "openzeppelin-solidity/CustomSafeMath.sol";';
      expect(builder.getMappingForImport(input, IMPORT_TYPE_B, customContactPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for import directive type C', async () => {
      const input = 'import {symbol1 as alias, symbol2} from "openzeppelin-solidity/CustomSafeMath.sol";';
      expect(builder.getMappingForImport(input, IMPORT_TYPE_C, customContactPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for a compilation unit', async () => {
      const input = `pragma solidity ^0.5.1;
      import "openzeppelin-solidity/CustomSafeMath.sol";
      import "Custom.sol";
      contract SomeCustomContract {
      }`;
      expect(builder.getMappingForUnit(input, customContactPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for sources', async () => {
      const sources = ['./test/compiler/custom/custom_contracts/Custom.sol'];
      expect(builder.getMappings(sources)).to.deep.eq(expectedMapping);
    });
  });
});
