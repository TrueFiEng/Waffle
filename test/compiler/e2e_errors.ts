import chai, {expect} from 'chai';
import {readFileContent} from '../../lib/utils';
import {compileProject} from '../../lib/compiler/compiler';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const configurations = [
  './test/projects/invalidContracts/config_solcjs.json',
  './test/projects/invalidContracts/config_docker.json',
  './test/projects/invalidContracts/config_native.json'
];

describe('E2E: Compiler integration - error messages', () => {
  for (const configurationPath of configurations)  {
    const configuration = JSON.parse(readFileContent(configurationPath));

    it(configuration.name, async () => {
      const consoleError = console.error;
      console.error = sinon.spy();

      const expectedPattern = /invalid\.sol.*Identifier not found or not.*/;

      const promise = compileProject(configurationPath);
      await expect(promise).to.be.rejectedWith(Error, 'Compilation failed');
      expect(console.error).to.be.calledWith(sinon.match(expectedPattern));

      console.error = consoleError;
    });
  }
});
