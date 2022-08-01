import {expect} from 'chai';
import {getVolumes, createBuildCommand} from '../../../src/compileDockerSolc';
import {join} from 'path';
import {Config} from '../../../src/config';

const config = {
  sourceDirectory: './test/projects/custom/custom_contracts',
  nodeModulesDirectory: './test/projects/custom/custom_node_modules'
} as Config;

describe('UNIT: DockerWrapper', () => {
  describe('getVolumes', () => {
    it('simple config', () => {
      const hostProjectPath = process.cwd();
      const hostNpmPath = join(hostProjectPath, config.nodeModulesDirectory);
      const expectedVolumes = `-v ${hostProjectPath}:/home/project -v ${hostNpmPath}:/home/npm`;
      expect(getVolumes(config)).to.equal(expectedVolumes);
    });
  });

  describe('buildCommand', () => {
    it('no version', () => {
      const command = createBuildCommand(config);
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:stable ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });

    it('specific version', () => {
      const command = createBuildCommand({...config, compilerVersion: '0.4.24'});
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:0.4.24 ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });
  });
});
