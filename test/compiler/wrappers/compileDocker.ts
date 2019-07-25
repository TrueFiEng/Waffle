import {expect} from 'chai';
import {getVolumes, createBuildCommand} from '../../../lib/compiler/compileDocker';
import {join} from 'path';

const config = {
  sourcesPath: './test/projects/custom/custom_contracts',
  npmPath: './test/projects/custom/custom_node_modules'
};

describe('UNIT: DockerWrapper', () => {
  describe('getVolumes', () => {
    it('simple config', () => {
      const hostProjectPath = process.cwd();
      const hostNpmPath = join(hostProjectPath, config.npmPath);
      const expectedVolumes = `-v ${hostProjectPath}:/home/project -v ${hostNpmPath}:/home/npm`;
      expect(getVolumes(config)).to.eq(expectedVolumes);
    });
  });

  describe('buildCommand', () => {
    it('no version', () => {
      const command = createBuildCommand(config);
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:stable solc ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });

    it('specific version', () => {
      const command = createBuildCommand({...config, 'docker-tag': '0.4.24'});
      expect(command).to.startWith('docker run -v ');
      expect(command).to.endWith(
        ':/home/npm -i -a stdin -a stdout ethereum/solc:0.4.24 solc ' +
        '--standard-json --allow-paths "/home/project,/home/npm"'
      );
    });
  });
});
