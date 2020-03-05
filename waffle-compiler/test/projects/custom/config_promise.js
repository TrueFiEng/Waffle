module.exports = new Promise((resolve, reject) => {
  resolve({
    name: "solidity 5, promise returned solcjs config",
    sourceDirectory: "./test/projects/custom/custom_contracts",
    outputDirectory: "./test/projects/custom/custom_build",
    nodeModulesDirectory: "./test/projects/custom/custom_node_modules",
    compilerVersion: "v0.5.9+commit.e560f70d"
  });
});
