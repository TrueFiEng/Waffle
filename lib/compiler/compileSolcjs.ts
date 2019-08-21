import solc from 'solc';
import {promisify} from 'util';
import {readFileContent, isDirectory, fullPath} from '../utils';
import {Config} from '../config/config';
import {buildInputObject} from './buildUitls';
import { ImportFile } from '@resolver-engine/imports';

const loadRemoteVersion = promisify(solc.loadRemoteVersion);

export async function loadCompiler(config: Config) {
  if (config.solcVersion) {
    if (isDirectory(config.solcVersion)) {
      return require(fullPath(config.solcVersion));
    }
    return loadRemoteVersion(config.solcVersion);
  }
  return solc;
}

export function compileSolcjs(config: Config) {
  return async function compile(sources: ImportFile[], findImports: (file: string) => any) {
    const solc = await loadCompiler(config);
    const input = buildInputObject(sources, config.compilerOptions);
    const output = solc.compile(JSON.stringify(input), findImports);
    return JSON.parse(output);
  };
}

export function findInputs(files: string[]) {
  return Object.assign({}, ...files.map((file) => ({
    [file]: readFileContent(file)
  })));
}
