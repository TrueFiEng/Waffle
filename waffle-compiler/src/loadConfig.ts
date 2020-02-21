import path from 'path';
import {Config} from './config';

export async function loadConfig(configPath?: string): Promise<Config> {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  } else {
    return {};
  }
}
