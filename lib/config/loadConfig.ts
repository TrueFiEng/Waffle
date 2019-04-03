import path from 'path';
import defaultConfig, { Config } from './config';

function readConfigFile(configPath: string) {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  }
  return {};
}

export function loadConfig(configPath: string): Config {
  const userConfig = readConfigFile(configPath);
  if (typeof userConfig !== 'object' && typeof userConfig.then === 'function') {
    userConfig.then((config: object) => {
      return {
        ...defaultConfig,
        ...config
      };
    });
  } else {
    return {
      ...defaultConfig,
      ...userConfig
    };
  }
}
