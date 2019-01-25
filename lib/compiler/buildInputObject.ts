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