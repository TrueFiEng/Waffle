export function buildInputObject(sources: any, remappings?: any) {
  return {
    language: 'Solidity',
    sources,
    settings: {
      remappings,
      outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
    }
  };
}

function toFullyQualifiedName(path: string): string {
  return path.replace(/\\/g, '/');
}

export function buildSources(inputs: string[], transform: (input: string) => string) {
  const sources: Record<string, { urls: string[] }> = {};
  for (const input of inputs) {
    sources[toFullyQualifiedName(input)] = {urls: [transform(input)]};
  }
  return sources;
}
