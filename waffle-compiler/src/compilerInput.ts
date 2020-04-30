import {ImportFile} from '@resolver-engine/imports';

export function getCompilerInput(
  files: ImportFile[],
  overrides: any = {},
  language: 'Solidity' | 'Vyper'
) {
  const sources: Record<string, { content: string}> = {};
  for (const file of files) {
    sources[file.url] = {content: file.source};
  }
  return JSON.stringify({
    language,
    sources,
    settings: {
      outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}},
      ...overrides
    }
  });
}
