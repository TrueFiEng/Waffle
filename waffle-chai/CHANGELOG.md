# @ethereum-waffle/chai

## 4.0.0-alpha.25

### Patch Changes

- e69f739: Support testing on optimism
- 1e598c5: BN closeTo actual may be a js number
- 2ccc395: Fix emit.withArgs not enough elements in list
- 79a421f: Test args of custom errors with .withArgs matcher
- Updated dependencies [1e479c3]
  - @ethereum-waffle/provider@4.0.0-alpha.24

## 4.0.0-alpha.24

### Patch Changes

- ba71ce4: Add support for custom errors in hardhat
- 587ff49: Allow chaining matchers
- 4622881: Support panic codes in ganache
- Updated dependencies [4622881]
  - @ethereum-waffle/provider@4.0.0-alpha.23

## 4.0.0-alpha.23

### Patch Changes

- Updated dependencies [671f139]
  - @ethereum-waffle/provider@4.0.0-alpha.22

## 4.0.0-alpha.22

### Patch Changes

- e8adce7: 🧼 Add src folders to npm
- Updated dependencies [e8adce7]
  - @ethereum-waffle/provider@4.0.0-alpha.21

## 4.0.0-alpha.21

### Patch Changes

- aa18bfa: Improve hardhat error catching

## 4.0.0-alpha.20

### Patch Changes

- be6fd8e: 🔝 Update ethers to 5.6.2
- Updated dependencies [be6fd8e]
  - @ethereum-waffle/provider@4.0.0-alpha.20

## 4.0.0

### Patch Changes

- Updated dependencies [ede638e]
  - @ethereum-waffle/provider@4.0.0

## 4.0.0-alpha.1

### Patch Changes

- 4c4b2d6: v4.0.0-alpha.1
- Updated dependencies [4c4b2d6]
  - @ethereum-waffle/provider@4.0.0-alpha.1

## 4.0.0-alpha.0

### Major Changes

- Bump typechain and ethers to the latest versions. Move them to peer deps.

### Patch Changes

- Updated dependencies [undefined]
  - @ethereum-waffle/provider@4.0.0-alpha.0

## 3.4.3

### Patch Changes

- 9074f16: Adjust closeTo delta type to accept BigNumber inputs

## 3.4.2

### Patch Changes

- 71417c7: Provider compatibility with London hardfork
- Updated dependencies [71417c7]
  - @ethereum-waffle/provider@3.4.1

## 3.4.1

### Patch Changes

- 5407af7: changeEtherBalances/changeEtherBalance compatablity with london hardfork

## 3.4.0

### Minor Changes

- 80d215b: - Fix vulnerabilities shown by `yarn audit`
  - Fix typings in `closeTo` matcher
  - Add `flattenSingleFile` function to compiler

### Patch Changes

- Updated dependencies [80d215b]
  - @ethereum-waffle/provider@3.4.0

## 3.3.1

### Patch Changes

- dc7afe4: Bugfix: Handle messages with special symbols in `revertedWith`
- Updated dependencies [6952eb9]
  - @ethereum-waffle/provider@3.3.1

## 3.3.0

### Minor Changes

- 1d7b466: Fix changeTokenBalance and changeTokenBalances matchers for contracts with overloaded balanceOf

  New matchers for BigNumber: within and closeTo

  Typechain integration

  Fix revertedWith functionality

### Patch Changes

- Updated dependencies [1d7b466]
  - @ethereum-waffle/provider@3.3.0
