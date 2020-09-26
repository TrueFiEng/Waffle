import {Wallet, BigNumber} from 'ethers';
import {Numberish} from '../types';

export async function toChangeBalances(
  transactionCallback: () => Promise<any>,
  wallets: Wallet[],
  balanceChanges: Numberish[]
) {
  if (typeof transactionCallback !== 'function') {
    /* eslint-disable max-len */
    throw new Error(
      'Expect subject should be a callback returning the Promise' +
        'e.g.: await expect(() => wallet.send({to: \'0xb\', value: 200})).to.changeBalances([\'0xa\', \'0xb\'], [-200, 200])'
    );
    /* eslint-enable max-len */
  }

  const balancesBefore = await Promise.all(
    wallets.map((wallet) => wallet.getBalance())
  );
  await transactionCallback();
  const balancesAfter = await Promise.all(
    wallets.map((wallet) => wallet.getBalance())
  );

  const actualChanges = balancesAfter.map((balance, ind) =>
    balance.sub(balancesBefore[ind])
  );
  const pass = actualChanges.every((change, ind) =>
    change.eq(BigNumber.from(balanceChanges[ind]))
  );

  const walletsAddresses = wallets.map((wallet) => wallet.address);
  if (pass) {
    return {
      pass: true,
      message: () =>
        `Expected ${walletsAddresses} to not change balance by ${balanceChanges} wei,`
    };
  } else {
    return {
      pass: false,
      message: () =>
        `Expected ${walletsAddresses} to change balance by ${balanceChanges} wei, ` +
        `but it has changed by ${actualChanges} wei`
    };
  }
}
