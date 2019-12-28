module.exports = {
  name: "KLAB friendly configuration",
  sourcesPath: "./test/projects/custom/custom_contracts",
  targetPath: "./test/projects/custom/custom_build",
  npmPath: "./test/projects/custom/custom_node_modules",
  compiler: process.env.WAFFLE_COMPILER,
  legacyOutput: true,
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

