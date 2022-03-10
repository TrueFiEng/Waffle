# ethereum-waffle

## 4.0.0-alpha.0

### Major Changes

- Bump typechain and ethers to the latest versions. Move them to peer deps.

### Patch Changes

- Updated dependencies [undefined]
  - @ethereum-waffle/chai@4.0.0-alpha.0
  - @ethereum-waffle/compiler@4.0.0-alpha.0
  - @ethereum-waffle/mock-contract@4.0.0-alpha.0
  - @ethereum-waffle/provider@4.0.0-alpha.0

## 3.4.0

### Minor Changes

- 80d215b: - Fix vulnerabilities shown by `yarn audit`
  - Fix typings in `closeTo` matcher
  - Add `flattenSingleFile` function to compiler

### Patch Changes

- Updated dependencies [80d215b]
  - @ethereum-waffle/compiler@3.4.0
  - @ethereum-waffle/chai@3.4.0
  - @ethereum-waffle/mock-contract@3.3.0
  - @ethereum-waffle/provider@3.4.0

## 3.3.0

### Minor Changes

- 1d7b466: Fix changeTokenBalance and changeTokenBalances matchers for contracts with overloaded balanceOf

  New matchers for BigNumber: within and closeTo

  Typechain integration

  Fix revertedWith functionality

### Patch Changes

- 246281f: Allow contract deployment using TypeChain-generated types
- Updated dependencies [246281f]
- Updated dependencies [1d7b466]
  - @ethereum-waffle/compiler@3.3.0
  - @ethereum-waffle/chai@3.3.0
  - @ethereum-waffle/provider@3.3.0
