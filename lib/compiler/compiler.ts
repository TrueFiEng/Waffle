import {Config} from '../config/config';
import {isWarningMessage} from '../utils';
import {createWrapper, Wrapper} from './createWrapper';
import {findInputs} from './findInputs';
import {findImports} from './findImports';
import {loadConfig} from '../config/loadConfig';

function anyNonWarningErrors(errors?: any[]) {
  return errors && !errors.every(isWarningMessage)
}

function toFormattedMessage(error: any) {
  return typeof error === 'string' ? error : error.formattedMessage;
}

export default class Compiler {
  private wrapper: Wrapper;

  constructor(private config: Config) {
    this.wrapper = createWrapper(this.config);
  }

  public async doCompile() {
    return this.wrapper.compile(
      findInputs(this.config.sourcesPath),
      findImports(this.config.npmPath)
    );
  }

  public async compile() {
    const output = await this.doCompile();
    if (output.errors) {
      const errors = output.errors
        .map((error: any) => toFormattedMessage(error))
        .join('\n');
      console.error(errors);
    }
    if (anyNonWarningErrors(output.errors)) {
      throw new Error('Compilation failed');
    } else {
      await this.wrapper.saveOutput(output, this.config.targetPath);
    }
  }
}

export async function compile(configPath: string) {
  const config = loadConfig(configPath);
  const compiler = new Compiler(config);
  await compiler.compile();
}
