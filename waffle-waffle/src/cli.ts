import {compileProject} from './compiler/compiler';

export async function runCli(args: string[]) {
  const options = args.filter((x) => x.startsWith('-'));
  const other = args.filter((x) => !x.startsWith('-'));

  if (options.length > 0) {
    for (const option of options) {
      if (option === '--help' || option === '-h') {
        console.log(USAGE);
      } else {
        exitWithError(`Error: Unknown option ${option}`);
      }
    }
  } else {
    if (other.length > 1) {
      exitWithError('Error: Too many arguments!');
    } else {
      return compileProject(args[0]);
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

    waffle [config-file] [options]

    Compiles solidity source code

  Config file:

    Read more about the configuration file in the documentation
    https://ethereum-waffle.readthedocs.io

  Options:

    --help, -h      Display this message
`;
