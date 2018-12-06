import fs from 'fs';
import path from 'path';
import solc from 'solc';
import {readFileContent} from '../utils';

class SolcjsWrapper {
  constructor(config) {
    this.config = config;
  }

  async findInputs(files) {
    return Object.assign(...files.map((file) => ({[file]: readFileContent(file)})));
  }

  convertSources(sources) {
    Object.keys(sources).map((key) => sources[key] = {content: sources[key]});
    return sources;
  }

  async compile(sourcesFiles, findImports) {
    const sources = await this.findInputs(sourcesFiles);
    const input = {
      language: 'Solidity',
      sources: this.convertSources(sources),
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    };
    const output = solc.compile(JSON.stringify(input), findImports);
    return JSON.parse(output);
  }

  async saveOutput(output, targetPath) {
    for (const key of Object.keys(output.contracts)) {
      for (const contract of Object.keys(output.contracts[key])) {
        const filePath = path.join(targetPath, `${contract}.json`);
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        const content = JSON.stringify(output.contracts[key][contract], null, 2);
        try {
          fs.writeFileSync(filePath, content);
        } catch (err) {
          this.console.error(err);
        }
      }
    }
  }
}

export default SolcjsWrapper;
