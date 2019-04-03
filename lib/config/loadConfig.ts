import path from 'path';
import defaultConfig, { Config } from './config';

function readConfigFile(configPath: string) {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  }
  return {};
}

export async function loadConfig(configPath: string): Promise<object> {
  if (configPath) {
    return new Promise((resolve, reject) => {
      resolve(require(path.join(process.cwd(), configPath)));
    });
  } else {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }
}
