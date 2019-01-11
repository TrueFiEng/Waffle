export interface Config {
  sourcesPath: string;
  targetPath: string;
  npmPath: string;
  compiler?: 'native' | 'dockerized-solc' | 'solcjs';
}

const defaultConfig: Config = {
  sourcesPath: './contracts',
  targetPath: './build',
  npmPath: 'node_modules'
};

export default defaultConfig;
