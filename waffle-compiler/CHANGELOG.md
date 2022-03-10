# @ethereum-waffle/compiler

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
