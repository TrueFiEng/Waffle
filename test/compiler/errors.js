import chai, {expect} from 'chai';
import {readFileContent} from '../../lib/utils';
import {compile} from '../../lib/compiler';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const configurations = [
  './test/compiler/invalidContracts/config.json',
  './test/compiler/invalidContracts/config_docker.json'
];

describe('(INTEGRATION) Compiler integration - error messages', () => {
  for (const configurationPath of configurations)  {
    const configuration = JSON.parse(readFileContent(configurationPath));

    /* eslint-disable no-loop-func */
    it(configuration.name, async () => {
      const overrideConsole = {error: sinon.spy()};
      const overrideProcess = {exit: sinon.spy()};
      await compile(configurationPath, {overrideConsole, overrideProcess});
      const expectedPattern = /invalid\.sol.*Identifier not found or not.*/;
      expect(overrideConsole.error).to.be.calledWith(sinon.match(expectedPattern));
      expect(overrideProcess.exit).to.be.calledWith(1);
    });
  }
});
