export function buildInputObject(sources: any, remappings?: any) {
  return {
    language: 'Solidity',
    sources: sources,
    settings: {
      remappings,
      outputSelection: {'*': {'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']}}
    }
  };
}

export function buildSources(inputs: string[], transform: (input: string) => string) {
  const sources: Record<string, { urls: string[] }> = {};
  for (const input of inputs) {
    sources[input.replace(/\\/g, '/')] = {urls: [transform(input)]};
  }
  return sources;
}
