import {getBalanceChange, getBalanceChanges, overwriteBigNumberFunction} from './utils';
import {Contract, Wallet, utils} from 'ethers';

export const waffleChai = (chai: any, chaiUtils: any) => {
  const {Assertion} = chai;

  Assertion.overwriteMethod('equal', (_super: any) => overwriteBigNumberFunction('eq', 'equal', _super, chaiUtils));
  Assertion.overwriteMethod('eq', (_super: any) => overwriteBigNumberFunction('eq', 'equal', _super, chaiUtils));
  Assertion.overwriteMethod('above', (_super: any) => overwriteBigNumberFunction('gt', 'above', _super, chaiUtils));
  Assertion.overwriteMethod('below', (_super: any) => overwriteBigNumberFunction('lt', 'below', _super, chaiUtils));
  Assertion.overwriteMethod('least', (_super: any) => overwriteBigNumberFunction('gte', 'at least', _super, chaiUtils));
  Assertion.overwriteMethod('most', (_super: any) => overwriteBigNumberFunction('lte', 'at most', _super, chaiUtils));

  Assertion.addProperty('reverted', function (this: any) {
    const promise = this._obj;
    const derivedPromise = promise.then(
      (value: any) => {
        this.assert(false,
          'Expected transaction to be reverted',
          'Expected transaction NOT to be reverted',
          'not reverted',
          'reverted');
        return value;
      },
      (reason: any) => {
        reason = (reason instanceof Object && 'message' in reason) ? reason.message : reason;
        const isReverted = reason.toString().search('revert') >= 0;
        const isThrown = reason.toString().search('invalid opcode') >= 0;
        this.assert(isReverted || isThrown,
          `Expected transaction to be reverted, but other exception was thrown: ${reason}`,
          'Expected transaction NOT to be reverted',
          'Reverted',
          reason);
        return reason;
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });

  Assertion.addMethod('revertedWith', function (this: any, revertReason: string) {
    const promise = this._obj;
    const derivedPromise = promise.then(
      (value: any) => {
        this.assert(false,
          'Expected transaction to be reverted',
          'Expected transaction NOT to be reverted',
          'not reverted',
          'reverted');
        return value;
      },
      (reason: any) => {
        reason = (reason instanceof Object && 'message' in reason) ? reason.message : reason;
        const isReverted = reason.toString().search('revert') >= 0 && reason.toString().search(revertReason) >= 0;
        const isThrown = reason.toString().search('invalid opcode') >= 0 && revertReason === '';
        this.assert(isReverted || isThrown,
          `Expected transaction to be reverted with ${revertReason}, but other exception was thrown: ${reason}`,
          `Expected transaction NOT to be reverted with ${revertReason}`,
          'Reverted',
          reason);
        return reason;
      }
    );
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });

  const filterLogsWithTopics = (logs: any[], topic: any) =>
    logs.filter((log) => log.topics.includes(topic));

  Assertion.addMethod('emit', function (this: any, contract: Contract, eventName: string) {
    const promise = this._obj;
    const derivedPromise = promise.then((tx: any) =>
      contract.provider.getTransactionReceipt(tx.hash)
    ).then((receipt: any) => {
      const eventDescription = contract.interface.events[eventName];

      if (eventDescription === undefined) {
        const isNegated = this.__flags.negate === true;

        this.assert(
          isNegated,
          `Expected event "${eventName}" to be emitted, but it doesn't` +
          ' exist in the contract. Please make sure you\'ve compiled' +
          ' its latest version before running the test.',
          `WARNING: Expected event "${eventName}" NOT to be emitted.` +
          ' The event wasn\'t emitted because it doesn\'t' +
          ' exist in the contract. Please make sure you\'ve compiled' +
          ' its latest version before running the test.',
          eventName,
          ''
        );
      }

      const {topic} = eventDescription;
      this.logs = filterLogsWithTopics(receipt.logs, topic);
      this.assert(this.logs.length > 0,
        `Expected event "${eventName}" to be emitted, but it wasn't`,
        `Expected event "${eventName}" NOT to be emitted, but it was`
      );
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    this.contract = contract;
    this.eventName = eventName;
    return this;
  });

  const assertArgsArraysEqual = (context: any, expectedArgs: any[], actualArgs: any[]) => {
    context.assert(actualArgs.length === expectedArgs.length,
      `Expected "${context.eventName}" event to have ${expectedArgs.length} argument(s), ` +
      `but has ${actualArgs.length}`,
      'Do not combine .not. with .withArgs()',
      expectedArgs.length,
      actualArgs.length);
    for (let index = 0; index < expectedArgs.length; index++) {
      if (expectedArgs[index].length !== undefined && typeof expectedArgs[index] !== 'string') {
        for (let j = 0; j < expectedArgs[index].length; j++) {
          new chai.Assertion(expectedArgs[index][j]).equal(actualArgs[index][j]);
        }
      } else {
        new chai.Assertion((expectedArgs[index])).equal((actualArgs[index]));
      }
    }
  };

  Assertion.addMethod('withArgs', function (this: any, ...expectedArgs: any[]) {
    const derivedPromise = this.promise.then(() => {
      const actualArgs = this.contract.interface.parseLog(this.logs[0]);
      assertArgsArraysEqual(this, expectedArgs, actualArgs.values);
    });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    return this;
  });

  Assertion.addProperty('properAddress', function (this: any) {
    const subject = this._obj;
    this.assert(/^0x[0-9-a-fA-F]{40}$/.test(subject),
      `Expected "${subject}" to be a proper address`,
      `Expected "${subject}" not to be a proper address`,
      'proper address (eg.: 0x1234567890123456789012345678901234567890)',
      subject);
  });

  Assertion.addProperty('properPrivateKey', function (this: any) {
    const subject = this._obj;
    this.assert(/^0x[0-9-a-fA-F]{64}$/.test(subject),
      `Expected "${subject}" to be a proper private key`,
      `Expected "${subject}" not to be a proper private key`,
      'proper address (eg.: 0x1234567890123456789012345678901234567890)',
      subject);
  });

  Assertion.addMethod('properHex', function (this: any, length: number) {
    const subject = this._obj;
    const regexp = new RegExp(`^0x[0-9-a-fA-F]{${length}}$`);
    this.assert(regexp.test(subject),
      `Expected "${subject}" to be a proper hex of length ${length}`,
      `Expected "${subject}" not to be a proper hex of length ${length}, but it was`,
      'proper address (eg.: 0x1234567890123456789012345678901234567890)',
      subject);
  });

  Assertion.addMethod('changeBalance', function (this: any, wallet: Wallet, balanceChange: any) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalance('0xa', -200)`);
    }
    const derivedPromise = getBalanceChange(subject, wallet)
      .then((actualChange) => {
        this.assert(actualChange.eq(utils.bigNumberify(balanceChange)),
          `Expected "${wallet.address}" to change balance by ${balanceChange} wei, ` +
          `but it has changed by ${actualChange} wei`,
          `Expected "${wallet.address}" to not change balance by ${balanceChange} wei,`,
          balanceChange,
          actualChange);
      });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });

  Assertion.addMethod('changeBalances', function (this: any, wallets: Wallet[], balanceChanges: any[]) {
    const subject = this._obj;
    if (typeof subject !== 'function') {
      throw new Error(`Expect subject should be a callback returning the Promise
        e.g.: await expect(() => wallet.send({to: '0xb', value: 200})).to.changeBalances(['0xa', '0xb'], [-200, 200])`);
    }
    const derivedPromise = getBalanceChanges(subject, wallets)
      .then((actualChanges) => {
        const walletsAddresses = wallets.map((wallet) => wallet.address);
        this.assert(actualChanges.every((change, ind) => change.eq(utils.bigNumberify(balanceChanges[ind]))),
          `Expected ${walletsAddresses} to change balance by ${balanceChanges} wei, ` +
          `but it has changed by ${actualChanges} wei`,
          `Expected ${walletsAddresses} to not change balance by ${balanceChanges} wei,`,
          balanceChanges.map((balanceChange) => balanceChange.toString()),
          actualChanges.map((actualChange) => actualChange.toString()));
      });
    this.then = derivedPromise.then.bind(derivedPromise);
    this.catch = derivedPromise.catch.bind(derivedPromise);
    this.promise = derivedPromise;
    return this;
  });
};
