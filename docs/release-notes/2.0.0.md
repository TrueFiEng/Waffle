# What's new in 2.0

## Documentation
In version 2.0 we introduce documentation available under url: [https://ethereum-waffle.readthedocs.io/](https://ethereum-waffle.readthedocs.io/).

## Faster compilation with native and dockerized solc
By default, Waffle uses solcjs. Solcjs is solidity complier cross-complied to javascript. It can be slow for bigger projects, but require no installation. You can now use native and dockerized solc instead.

Read more about fast compiliation [here](https://ethereum-waffle.readthedocs.io/en/latest/compilation.html)

## New chai matcher: changeBalance and changeBalances
Waffle 2.0 introduces `changeBalance` and `changeBalances` matchers that allows to check if balance of an account(s) changed.

Read more about new matchers [here](https://ethereum-waffle.readthedocs.io/en/latest/features.html#change-balance).

## Support for TypeScript
Partial TypeScript support. For now it does not include chai matchers.
We plan to include full TypeScript support in version 2.1

## Fixtures
When testing code dependent on smart contracts it is often useful to have a specific scenario play out before every test. That leads to repetition and slow code execution. With fixtures you can clean-up your code and speed it up by an order of magnitude.

Read more about fixtures [here](https://ethereum-waffle.readthedocs.io/en/latest/features.html#fixtures).


## Others
* Waffle now supports config file in both `json` and `js` extenstions.
* Linking should work for both solidity 4 and solidity 5
* Waffle is now officialy released under MIT license
* Compiliation is covered with extensive end-to-end tests

## Breaking changes
* `getWallet()` is not `async` anymore
* Support for node versions older than 10.* is now disabled
* New format on contract `.json` files is introduced. It is incompatible with older version and with truffle. Use ''