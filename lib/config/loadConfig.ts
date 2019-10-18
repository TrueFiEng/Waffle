import path from 'path';
import defaultConfig, {Config} from './config';

export async function loadConfig(configPath: string): Promise<Config> {
  if (configPath) {
    const config = await require(path.join(process.cwd(), configPath));
    return {...defaultConfig, ...config};
  } else {
    return {...defaultConfig};
  }
}
