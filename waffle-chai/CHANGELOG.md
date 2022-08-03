# @ethereum-waffle/chai

## 4.0.4

### Patch Changes

- dd0c169: 🧒 Add withArgs and withNamedArgs alongside toEmit matcher

## 4.0.3

### Patch Changes

- dca8950: 🎩 Allow string addresses in `changeTokenBalance`
- Updated dependencies [1bc6cd0]
  - @ethereum-waffle/provider@4.0.3

## 4.0.2

### Patch Changes

- 41e809f: Decode revert string in hardhat 2.9.4+
- Updated dependencies [41e809f]
  - @ethereum-waffle/provider@4.0.2

## 4.0.1

### Patch Changes

- e8adce7: 🧼 Add src folders to npm
- 9b0e87c: Optimism fix revertedWith matcher
- ba71ce4: Add support for custom errors in hardhat
- 587ff49: Allow chaining matchers
- 62dd2f9: Added withNamedArgs method to the Chai emit matcher
- 4622881: Support panic codes in ganache
- e69f739: Support testing on optimism
- 1e598c5: BN closeTo actual may be a js number
- aa18bfa: Improve hardhat error catching
- b9af4f0: Support structs in events for withArgs matcher
- 2ccc395: Fix emit.withArgs not enough elements in list
- 79a421f: Test args of custom errors with .withArgs matcher
- 4ed0cc5: Allow to chain emit matchers
- 09dccac: Improve called on contract matchers error messages
- be6fd8e: 🔝 Update ethers to 5.6.2
- e631daf: Fix Optimism revertedWith matcher 2
- Updated dependencies [e8adce7]
- Updated dependencies [4622881]
- Updated dependencies [d0ce408]
- Updated dependencies [1e479c3]
- Updated dependencies [671f139]
- Exit prerelease
- Updated dependencies
  - @ethereum-waffle/provider@4.0.1

## 4.0.0-alpha.28

### Patch Changes

- 62dd2f9: Added withNamedArgs method to the Chai emit matcher

## 4.0.0-alpha.27

### Patch Changes

- b9af4f0: Support structs in events for withArgs matcher
- 09dccac: Improve called on contract matchers error messages
- Updated dependencies [d0ce408]
  - @ethereum-waffle/provider@4.0.0-alpha.25

## 4.0.0-alpha.26

### Patch Changes

- 9b0e87c: Optimism fix revertedWith matcher
- e631daf: Fix Optimism revertedWith matcher 2

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
