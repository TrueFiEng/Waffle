import fs from 'fs';
import path from 'path';
import defaultConfig from './config/defaultConfig';
import {isDirectory, readFileContent, isWarningMessage} from './utils';
import createWrapper from './wrappers/createWrapper';

export default class Compiler {
  constructor(config = {}, {wrapper = null, overrideProcess = process, overrideConsole = console} = {}) {
    this.config = {...defaultConfig, ...config};
    this.process = overrideProcess;
    this.console = overrideConsole;
    this.wrapper = wrapper || createWrapper(this.config);
  }

  async findInputFiles(sourcesPath) {
    const dirs = [sourcesPath];
    const inputFiles = [];
    while (dirs.length) {
      const dir = dirs.pop();
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (isDirectory(filePath)) {
          dirs.push(filePath);
        } else if (file.endsWith('.sol')) {
          inputFiles.push(filePath);
        }
      }
    }
    return inputFiles;
  }

  findImports(file) {
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

  async doCompile() {
    const sourcesFiles = await this.findInputFiles(this.config.sourcesPath);
    return this.wrapper.compile(sourcesFiles, this.findImports.bind(this));
  }

  anyNonWarningErrors(errors) {
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

  toFormattedMessage(error) {
    return typeof error === 'string' ? error : error.formattedMessage;
  }

  async compile() {
    const output = await this.doCompile();
    if (output.errors) {
      const errors = output.errors.map((error) => this.toFormattedMessage(error)).join('\n');
      this.console.error(errors);
    }
    if (this.anyNonWarningErrors(output.errors)) {
      this.process.exit(1);
    } else {
      await this.wrapper.saveOutput(output, this.config.targetPath);
    }
  }
}

export async function compile(configPath, options = {}) {
  try {
    let config = {};
    if (configPath) {
      const contents = fs.readFileSync(configPath);
      config = JSON.parse(contents);
    }
    const compiler = new Compiler(config, options);
    await compiler.compile();
  } catch (err) {
    console.error(err);
  }
}
