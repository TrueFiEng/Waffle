import {Wallet, BigNumber} from 'ethers';
import {Numberish} from '../types';

export async function toChangeBalance(
  transactionCallback: () => Promise<any>,
  wallet: Wallet,
  balanceChange: Numberish
) {
  if (typeof transactionCallback !== 'function') {
    throw new Error(
      'Expect subject should be a callback returning a Promise\n' +
        'e.g.: await expect(() => wallet.send({to: \'0xb\', value: 200})).toChangeBalance(\'0xa\', -200)'
    );
  }

  const balanceBefore = await wallet.getBalance();
  await transactionCallback();
  const balanceAfter = await wallet.getBalance();

  const actualChange = balanceAfter.sub(balanceBefore);
  const pass = actualChange.eq(BigNumber.from(balanceChange));

  if (pass) {
    return {
      pass: true,
      message: () =>
        `Expected "${wallet.address}" to not change balance by ${balanceChange} wei,`
    };
  } else {
    return {
      pass: false,
      message: () =>
        `Expected "${wallet.address}" to change balance by ${balanceChange} wei, ` +
        `but it has changed by ${actualChange} wei`
    };
  }
}
