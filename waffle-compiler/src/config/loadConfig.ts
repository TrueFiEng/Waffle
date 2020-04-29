import path from 'path';
import {InputConfig} from '.';

export async function loadConfig(configPath?: string): Promise<InputConfig> {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  } else {
    return {};
  }
}
