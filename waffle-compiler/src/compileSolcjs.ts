import solc from 'solc';
import {promisify} from 'util';
import {readFileContent, isDirectory, relativePathToWorkingDir} from './utils';
import {Config} from './config';
import {buildInputObject} from './buildUitls';
import {ImportFile} from '@resolver-engine/imports';
import fetch from 'node-fetch';

const loadRemoteVersion = promisify(solc.loadRemoteVersion);
const semverRegex = /^\d+\.\d+\.\d+$/;

export async function loadCompiler(config: Config) {
  if (config.compilerVersion !== 'default') {
    if (isDirectory(config.compilerVersion)) {
      return require(relativePathToWorkingDir(config.compilerVersion));
    } else if (semverRegex.test(config.compilerVersion)) {
      try {
        const version = await resolveSemverVersion(config.compilerVersion);
        return loadRemoteVersion(version);
      } catch (e) {
        throw new Error(`Error fetching version: ${config.compilerVersion}.`);
      }
    }
    return loadRemoteVersion(config.compilerVersion);
  }
  return solc;
}

async function resolveSemverVersion(version: string) {
  const releases = await fetchReleases();
  const item: string = releases[version];
  return item.substring('soljson-'.length, item.length - '.js'.length);
}

const VERSION_LIST_URL = 'https://ethereum.github.io/solc-bin/bin/list.json';
let cache: any = undefined;
async function fetchReleases() {
  if (!cache) {
    const res = await fetch(VERSION_LIST_URL);
    const {releases} = await res.json();
    cache = releases;
  }
  return cache;
}

export function compileSolcjs(config: Config) {
  return async function compile(sources: ImportFile[], findImports: (file: string) => any) {
    const solc = await loadCompiler(config);
    const input = buildInputObject(sources, config.compilerOptions);
    const output = solc.compile(JSON.stringify(input), {imports: findImports});
    return JSON.parse(output);
  };
}

export function findInputs(files: string[]) {
  return Object.assign({}, ...files.map((file) => ({
    [file]: readFileContent(file)
  })));
}
