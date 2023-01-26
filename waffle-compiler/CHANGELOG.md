# @ethereum-waffle/compiler

## 4.0.3

### Patch Changes

- a0f721a: Move ethers to peer deps

## 4.0.2

### Patch Changes

- 00e9f1b: 🪵 Upgrade solc

## 4.0.1

### Patch Changes

- e8adce7: 🧼 Add src folders to npm
- be6fd8e: 🔝 Update ethers to 5.6.2
- Exit prerelease

## 4.0.0-alpha.21

### Patch Changes

- e8adce7: 🧼 Add src folders to npm

## 4.0.0-alpha.20

### Patch Changes

- be6fd8e: 🔝 Update ethers to 5.6.2

## 4.0.0-alpha.1

### Patch Changes

- 4c4b2d6: v4.0.0-alpha.1

## 4.0.0-alpha.0

### Major Changes

- Bump typechain and ethers to the latest versions. Move them to peer deps.

## 3.4.0

### Minor Changes

- 80d215b: - Fix vulnerabilities shown by `yarn audit`
  - Fix typings in `closeTo` matcher
  - Add `flattenSingleFile` function to compiler

## 3.3.1

### Patch Changes

- 8f5699f: Fix how flattener handles sol imports

## 3.3.0

### Minor Changes

- 1d7b466: Fix changeTokenBalance and changeTokenBalances matchers for contracts with overloaded balanceOf

  New matchers for BigNumber: within and closeTo

  Typechain integration

  Fix revertedWith functionality

### Patch Changes

- 246281f: Allow contract deployment using TypeChain-generated types
