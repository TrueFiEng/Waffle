import path from 'path';
import defaultConfig, { Config } from './config';

function readConfigFile(configPath: string) {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  }
  return {};
}

export async function loadConfig(configPath: string): Promise<Config> {
  if (configPath) {
    return new Promise(async (resolve, reject) => {
      resolve({
        ...defaultConfig,
        ...await require(path.join(process.cwd(), configPath))
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve({
        ...defaultConfig
      });
    });
  }
}
