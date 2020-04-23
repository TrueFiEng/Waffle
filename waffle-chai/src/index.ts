import './types';
import {supportBigNumber} from './matchers/bigNumber';
import {supportReverted} from './matchers/reverted';
import {supportRevertedWith} from './matchers/revertedWith';
import {supportEmit} from './matchers/emit';
import {supportProperAddress} from './matchers/properAddress';
import {supportProperPrivateKey} from './matchers/properPrivateKey';
import {supportProperHex} from './matchers/properHex';
import {supportChangeBalance} from './matchers/changeBalance';
import {supportChangeBalances} from './matchers/changeBalances';
import {supportEthCalled} from './matchers/ethCalled';
import {supportEthCalledWith} from './matchers/ethCalledWith';

export function waffleChai(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
  supportBigNumber(chai.Assertion, utils);
  supportReverted(chai.Assertion);
  supportRevertedWith(chai.Assertion);
  supportEmit(chai.Assertion);
  supportProperAddress(chai.Assertion);
  supportProperPrivateKey(chai.Assertion);
  supportProperHex(chai.Assertion);
  supportChangeBalance(chai.Assertion);
  supportChangeBalances(chai.Assertion);
  supportEthCalled(chai.Assertion);
  supportEthCalledWith(chai.Assertion);
}
