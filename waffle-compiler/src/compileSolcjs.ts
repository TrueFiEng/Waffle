import solc from 'solc';
import {promisify} from 'util';
import {readFileContent, isDirectory, relativePathToWorkingDir} from './utils';
import {Config} from './config';
import {buildInputObject} from './buildUitls';
import {ImportFile} from '@resolver-engine/imports';

const loadRemoteVersion = promisify(solc.loadRemoteVersion);

export async function loadCompiler(config: Config) {
  if (config.compilerVersion !== 'default') {
    if (isDirectory(config.compilerVersion)) {
      return require(relativePathToWorkingDir(config.compilerVersion));
    }
    return loadRemoteVersion(config.compilerVersion);
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
