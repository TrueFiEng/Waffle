import fs from 'fs';
import path from 'path';
import solc from 'solc';
import defaultConfig from './defaultConfig';
import readFileContent from '../lib/readFileContent';

export default class Compiler {
  constructor(config = {}) {    
    this.config = {...defaultConfig, ...config};
  }

  async findInputFiles() {
    const dirs = [this.config.sourcesPath];
    const inputFiles = [];
    while (dirs.length) {      
      const dir = dirs.pop();      
      const files = fs.readdirSync(dir);            
      for (const file of files) {        
        const filePath = path.join(dir, file);
        const stat = await fs.statSync(filePath);
        if (stat.isDirectory(filePath)) {
          dirs.push(filePath);
        } else if (file.endsWith('.sol')) {          
          inputFiles.push(filePath);
        }        
      }
    }    
    return inputFiles;
  }

  async findInputs() {
    const files = await this.findInputFiles(this.config);
    return Object.assign(...files.map((file) => ({[file]: readFileContent(file)})));
  }
  
  findImports(file) {    
    const libPath = path.join(this.config.npmPath, file);
    if (fs.existsSync(file)) {
      const contents = fs.readFileSync(file).toString();
      return {contents};
    } else if (fs.existsSync(libPath)) {    
      const contents = fs.readFileSync(libPath).toString();
      return {contents};
    }
    return {error: `File not found: ${file}`};
  }
  
  async doCompile() {
    const sources = await this.findInputs();
    return solc.compile({sources}, 1, this.findImports.bind(this));
  }

  async saveOutput(output) {    
    for (const key of Object.keys(output.contracts)) {
      const [, fileName] = key.split(':');
      const filePath = path.join(this.config.targetPath, `${fileName}.json`);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const content = JSON.stringify(output.contracts[key], null, 2);
      try {        
        fs.writeFileSync(filePath, content);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async compile() {
    const output = await this.doCompile();
    this.saveOutput(output);  
  }
}
