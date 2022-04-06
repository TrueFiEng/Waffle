import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {waffleChai} from '../src';

chai.use(chaiAsPromised);
chai.use(waffleChai);

export {changeEtherBalanceTest} from './matchers/changeEtherBalanceTest';
export {changeEtherBalancesTest} from './matchers/changeEtherBalancesTest';
