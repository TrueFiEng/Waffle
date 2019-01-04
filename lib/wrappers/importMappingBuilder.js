import {isFile, falttenObjectArray, readFileContent} from '../utils';
import {join, sep, resolve, dirname, relative} from 'path';

const PATH = `\\"(?<path>([^"\\r\\n\\\\]|'\\\\'.)*)\\"`;
const TYPE = `([a-zA-Z][a-zA-Z0-9]*)`;
const AS = `([a-zA-Z][a-zA-Z0-9]*)`;
const IMPORT_TYPE_A = new RegExp(`import\\s+${PATH}\\s*(as\\s+${AS})?\\s*;`);
const IMPORT_TYPE_B = new RegExp(`import\\s+(\\*|${TYPE})\\s+(as\\s+${AS})?\\s*from\\s+${PATH};`);
const IMPORT_TYPE_C = new RegExp(`import\\s+\\{(.*)\\}\\s*from\\s+${PATH};`);

class ImportMappingBuilder {
  constructor(contractBasePath, npmPath, containerPath) {
    this.contractBasePath = contractBasePath;
    this.npmPath = npmPath;
    this.containerPath = containerPath;
  }

  mapPath(prefix) {
    if (this.containerPath) {
      return join(this.containerPath, this.npmPath, prefix);
    }
    return resolve(join(this.npmPath, prefix));
  }

  getMapping(importPath, filePath) {
    const interPath = dirname(relative(this.contractBasePath, filePath));
    const joinedPath = join(this.contractBasePath, interPath, importPath);
    if (isFile(joinedPath)) {
      return {};
    }
    const npmPath = join(this.npmPath, importPath);
    if (isFile(npmPath)) {
      const [prefix] = importPath.split(sep);
      return {[prefix]: this.mapPath(prefix)};
    }
    throw TypeError(`Invalid import, file does not exist: ${importPath}`);
  }

  getMappingForImport(importDirective, importRegExp, filePath) {
    const {path} = importRegExp.exec(importDirective).groups;
    return this.getMapping(path, filePath);
  }

  getMappingForUnitWithRegexp(unit, regexp, filePath) {
    const regexpWithGlobal = new RegExp(regexp, 'g');
    const reducer = (accum, importDirective) =>
      Object.assign(accum, this.getMappingForImport(importDirective, regexp, filePath));
    const mappings = unit.match(regexpWithGlobal) || [];
    return mappings.reduce(reducer, {});
  }

  getMappingForUnit(unit, filePath) {
    return falttenObjectArray([
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_A, filePath),
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_B, filePath),
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_C, filePath)
    ]);
  }

  getMappings(sources) {
    return falttenObjectArray(
      sources.map((path) =>
        this.getMappingForUnit(readFileContent(path), path)
      ));
  }
}

export default ImportMappingBuilder;
export {IMPORT_TYPE_A, IMPORT_TYPE_B, IMPORT_TYPE_C};
