import path from 'path';
import defaultConfig, { Config } from './config';

function readConfigFile(configPath: string) {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  }
  return {};
}

export function loadConfig(configPath: string): Config {
  return {
    ...defaultConfig,
    ...readConfigFile(configPath)
  }
}