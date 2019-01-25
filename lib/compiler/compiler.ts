import path from 'path';
import defaultConfig, {Config} from '../config/config';
import {isWarningMessage} from '../utils';
import {createWrapper, Wrapper} from './createWrapper';
import {findInputs} from './findInputs';
import { findImports } from './findImports';

export default class Compiler {
  private config: Config;
  private wrapper: Wrapper;

  constructor(config: Partial<Config>) {
    this.config = {...defaultConfig, ...config};
    this.wrapper = createWrapper(this.config);
  }

  public async doCompile() {
    return this.wrapper.compile(
      findInputs(this.config.sourcesPath),
      findImports(this.config.npmPath)
    );
  }

  private anyNonWarningErrors(errors?: any[]) {
    if (!errors) {
      return false;
    }
    for (const error of errors) {
      if (!isWarningMessage(error)) {
        return true;
      }
    }
    return false;
  }

  private toFormattedMessage(error: any) {
    return typeof error === 'string' ? error : error.formattedMessage;
  }

  public async compile() {
    const output = await this.doCompile();
    if (output.errors) {
      const errors = output.errors.map((error: any) => this.toFormattedMessage(error)).join('\n');
      console.error(errors);
    }
    if (this.anyNonWarningErrors(output.errors)) {
      throw new Error('Compilation failed');
    } else {
      await this.wrapper.saveOutput(output, this.config.targetPath);
    }
  }
}

export function loadConfig(configPath: string) {
  if (configPath) {
    return require(path.join(process.cwd(), configPath));
  }
  return {};
}

export async function compile(configPath: string) {
  const config = loadConfig(configPath);
  const compiler = new Compiler(config);
  await compiler.compile();
}
