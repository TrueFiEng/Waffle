module.exports = new Promise((resolve, reject) => {
  resolve({
    name: "solidity 5, promise returned solcjs config",
    sourcesPath: "./test/projects/custom/custom_contracts",
    targetPath: "./test/projects/custom/custom_build",
    npmPath: "./test/projects/custom/custom_node_modules"
  });
});
