import solc from 'solc';
import {promisify} from 'util';
import {readFileContent} from '../utils';
import {Config} from '../config/config';
import {buildInputObject} from './buildUitls';

const loadRemoteVersion = promisify(solc.loadRemoteVersion);

async function loadCompiler(config: Config) {
  if (config.solcVersion) {
    return loadRemoteVersion(config.solcVersion);
  } else {
    return solc;
  }
}

export function compileSolcjs(config: Config) {
  return async function compile(sources: string[], findImports: (file: string) => any) {
    const solc = await loadCompiler(config);
    const inputs = findInputs(sources);
    const input = buildInputObject(convertInputs(inputs));
    const output = solc.compile(JSON.stringify(input), findImports);
    return JSON.parse(output);
  };
}

function convertInputs(inputs: Record<string, any>) {
  const converted: Record<string, { content: string }> = {};
  Object.keys(inputs).map((key) => converted[key.replace(/\\/g, '/')] = {content: inputs[key]});
  return converted;
}

export function findInputs(files: string[]) {
  return Object.assign({}, ...files.map((file) => ({
    [file]: readFileContent(file)
  })));
}
