# @ethereum-waffle/provider

## 3.3.1

### Patch Changes

- 6952eb9: Fixes HardHat problem: @ethereum-waffle/provider breaks source maps #281 (Lazy load ganache-core to avoid loading source-map-support too early)

## 3.3.0

### Minor Changes

- 1d7b466: Fix changeTokenBalance and changeTokenBalances matchers for contracts with overloaded balanceOf

  New matchers for BigNumber: within and closeTo

  Typechain integration

  Fix revertedWith functionality
