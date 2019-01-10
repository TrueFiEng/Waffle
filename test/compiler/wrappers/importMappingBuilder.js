import chai, {expect} from 'chai';
import ImportsMappingBuilder, {IMPORT_TYPE_A, IMPORT_TYPE_B, IMPORT_TYPE_C} from '../../../lib/wrappers/importMappingBuilder';

chai.use(require('chai-string'));

const customContractPath = './test/projects/custom/custom_contracts/Custom.sol';

describe('UNIT: ImportsMappingBuilder', () => {
  let builder;
  let expectedPath;
  let expectedMapping;


  it('within container', () => {
    const builder = new ImportsMappingBuilder('./test/projects/custom/custom_contracts', './test/projects/custom/custom_node_modules', '/home/project', '/home/npm');
    const mapping = builder.getMapping('openzeppelin-solidity/CustomSafeMath.sol', customContractPath);
    const expectedPath = '/home/npm/openzeppelin-solidity';
    expect(mapping['openzeppelin-solidity']).to.deep.eq(expectedPath);
  });

  describe('convertPath', () => {
    before(() => {
      builder = new ImportsMappingBuilder('./test/projects/custom/custom_contracts', './test/projects/custom/custom_node_modules');
      expectedPath = `${process.cwd()}/test/projects/custom/custom_node_modules/openzeppelin-solidity`;
      expectedMapping = {'openzeppelin-solidity': expectedPath};
    });

    it('no mapping for local file', async () => {
      expect(builder.getMapping('Custom.sol', customContractPath)).to.deep.eq({});
    });

    it('no mapping for local file in subdir', async () => {
      expect(builder.getMapping('./One.sol', './test/projects/custom/custom_contracts/sub/Two.sol'
      )).to.deep.eq({});
    });

    it('generates mapping for npm import', async () => {
      const mapping = builder.getMapping('openzeppelin-solidity/CustomSafeMath.sol', customContractPath);
      expect(mapping).to.deep.eq(expectedMapping);
    });

    describe('generates mapping for import directive', () => {
      it('type A (no transformation)', async () => {
        const input = 'import "Custom.sol";';
        expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContractPath)).to.deep.eq({});
      });

      it('type A', async () => {
        const input = 'import "openzeppelin-solidity/CustomSafeMath.sol";';
        expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContractPath)).to.deep.eq(expectedMapping);
      });

      it('type A with as', async () => {
        const input = 'import "openzeppelin-solidity/CustomSafeMath.sol" as SomeName;';
        expect(builder.getMappingForImport(input, IMPORT_TYPE_A, customContractPath)).to.deep.eq(expectedMapping);
      });

      it('type B', async () => {
        const input = 'import * as SomeName from "openzeppelin-solidity/CustomSafeMath.sol";';
        expect(builder.getMappingForImport(input, IMPORT_TYPE_B, customContractPath)).to.deep.eq(expectedMapping);
      });

      it('type C', async () => {
        const input = 'import {symbol1 as alias, symbol2} from "openzeppelin-solidity/CustomSafeMath.sol";';
        expect(builder.getMappingForImport(input, IMPORT_TYPE_C, customContractPath)).to.deep.eq(expectedMapping);
      });
    });

    it('generates mapping for a compilation unit', async () => {
      const input = `pragma solidity ^0.5.1;
      import "openzeppelin-solidity/CustomSafeMath.sol";
      import "Custom.sol";
      contract SomeCustomContract {
      }`;
      expect(builder.getMappingForUnit(input, customContractPath)).to.deep.eq(expectedMapping);
    });

    it('generates mapping for sources', async () => {
      const sources = ['./test/projects/custom/custom_contracts/Custom.sol'];
      expect(builder.getMappings(sources)).to.deep.eq(expectedMapping);
    });
  });
});
