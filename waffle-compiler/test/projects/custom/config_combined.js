module.exports = {
  name: "KLAB friendly configuration",
  sourceDirectory: "./test/projects/custom/custom_contracts",
  outputDirectory: "./test/projects/custom/custom_build",
  nodeModulesDirectory: "./test/projects/custom/custom_node_modules",
  outputType: 'all',
  compilerOptions: {
    outputSelection: {
      "*": {
        "*": [ "evm.bytecode.object", "evm.deployedBytecode.object",
               "abi" ,
               "evm.bytecode.sourceMap", "evm.deployedBytecode.sourceMap" ],

        "": [ "ast" ]
      },
    }
  }
};

