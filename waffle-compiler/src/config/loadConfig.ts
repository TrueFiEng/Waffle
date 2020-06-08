import fs from 'fs';
import path from 'path';
import {InputConfig} from './config';

export async function loadConfig(configPath?: string): Promise<InputConfig> {
  if (fs.existsSync('./waffle.json')) {
    return require(path.join(process.cwd(), './waffle.json'));
  } else if (configPath) {
    return require(path.join(process.cwd(), configPath));
  } else {
    return {};
  }
}
