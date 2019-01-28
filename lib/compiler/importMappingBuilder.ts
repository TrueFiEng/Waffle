import {isFile, falttenObjectArray, readFileContent} from '../utils';
import {join, sep, resolve, dirname, relative} from 'path';

const PATH = `\\"(?<path>([^"\\r\\n\\\\]|'\\\\'.)*)\\"`;
const TYPE = `([a-zA-Z][a-zA-Z0-9]*)`;
const AS = `([a-zA-Z][a-zA-Z0-9]*)`;
const IMPORT_TYPE_A = new RegExp(`import\\s+${PATH}\\s*(as\\s+${AS})?\\s*;`);
const IMPORT_TYPE_B = new RegExp(`import\\s+(\\*|${TYPE})\\s+(as\\s+${AS})?\\s*from\\s+${PATH};`);
const IMPORT_TYPE_C = new RegExp(`import\\s+\\{(.*)\\}\\s*from\\s+${PATH};`);

class ImportMappingBuilder {
  constructor(
    private contractBasePath: string,
    private npmPath: string,
    private containerPath?: string,
    private containerNpmPath?: string
  ) {}

  public mapPath(prefix: string) {
    if (this.containerPath) {
      return join(this.containerNpmPath, prefix);
    }
    return resolve(join(this.npmPath, prefix));
  }

  public getMapping(importPath: string, filePath: string) {
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

  public getMappingForImport(
    importDirective: string,
    importRegExp: RegExp,
    filePath: string
  ) {
    const {path} = importRegExp.exec(importDirective).groups;
    return this.getMapping(path, filePath);
  }

  public getMappingForUnitWithRegexp(unit: string, regexp: RegExp, filePath: string) {
    const regexpWithGlobal = new RegExp(regexp, 'g');
    const reducer = (accum: object, importDirective: string) =>
      Object.assign(accum, this.getMappingForImport(importDirective, regexp, filePath));
    const mappings = unit.match(regexpWithGlobal) || [];
    return mappings.reduce(reducer, {});
  }

  public getMappingForUnit(unit: string, filePath: string) {
    return falttenObjectArray([
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_A, filePath),
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_B, filePath),
      this.getMappingForUnitWithRegexp(unit, IMPORT_TYPE_C, filePath)
    ]);
  }

  public getMappings(sources: string[]) {
    const mappings = falttenObjectArray(
      sources.map((path) =>
        this.getMappingForUnit(readFileContent(path), path)
      ));
    return Object.entries(mappings).map(([key, value]) => `${key}=${value}`);
  }
}

export default ImportMappingBuilder;
export {IMPORT_TYPE_A, IMPORT_TYPE_B, IMPORT_TYPE_C};
