import path from 'path';
import defaultConfig, { Config } from './config';

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
