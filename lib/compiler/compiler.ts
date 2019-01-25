import fs from 'fs';
import path from 'path';
import defaultConfig, {Config} from '../config/config';
import {readFileContent, isWarningMessage} from '../utils';
import {createWrapper, Wrapper} from './createWrapper';
import {findInputs} from './findInputs';

interface CompilerOptions {
  wrapper?: Wrapper;
  overrideProcess?: NodeJS.Process;
  overrideConsole?: Console;
}

export default class Compiler {
  private config: Config;
  private process: NodeJS.Process;
  private console: Console;
  private wrapper: Wrapper;

  constructor(config: Partial<Config> = {}, options: CompilerOptions = {}) {
    this.config = {...defaultConfig, ...config};
    this.process = options.overrideProcess || process;
    this.console = options.overrideConsole || console;
    this.wrapper = options.wrapper || createWrapper(this.config);
  }

  public findImports(file: string) {
    const libPath = path.join(this.config.npmPath, file);
    if (fs.existsSync(file)) {
      const contents = readFileContent(file);
      return {contents};
    } else if (fs.existsSync(libPath)) {
      const contents = readFileContent(libPath);
      return {contents};
    }
    return {error: `File not found: ${file}`};
  }

  public async doCompile() {
    return this.wrapper.compile(
      findInputs(this.config.sourcesPath),
      this.findImports.bind(this)
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
      this.console.error(errors);
    }
    if (this.anyNonWarningErrors(output.errors)) {
      this.process.exit(1);
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

export async function compile(configPath: string, options = {}) {
  try {
    const config = loadConfig(configPath);
    const compiler = new Compiler(config, options);
    await compiler.compile();
  } catch (err) {
    console.error(err);
  }
}
