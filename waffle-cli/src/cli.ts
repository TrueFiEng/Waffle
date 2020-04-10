import {compileProject} from '@ethereum-waffle/compiler';
import {flattenProject} from '@ethereum-waffle/compiler/src/flattener';

export async function runCli(args: string[]) {
  const options = args.filter((x) => x.startsWith('-'));
  const other = args.filter((x) => !x.startsWith('-'));
  const isTypeFlatten = args[0] === ('flatten');
  const isTypeProvided = isTypeFlatten || args[0] === 'compile';
  const configFile = isTypeProvided ? args[1] : args[0];

  if (options.length > 0) {
    for (const option of options) {
      if (option === '--help' || option === '-h') {
        console.log(USAGE);
      } else {
        exitWithError(`Error: Unknown option ${option}`);
      }
    }
  } else {
    if (other.length > 2) {
      exitWithError('Error: Too many arguments!');
    } else {
      if (isTypeFlatten) {
        return flattenProject(configFile);
      }
      return compileProject(configFile);
    }
  }
}

function exitWithError(error: string) {
  console.error(error);
  console.log(USAGE);
  process.exit(1);
}

const USAGE = `
  Usage:

    waffle [compile|flatten] [config-file] [options]

    Compiles solidity source code

  Config file:

    Read more about the configuration file in the documentation
    https://ethereum-waffle.readthedocs.io

  Options:

    --help, -h      Display this message
`;
