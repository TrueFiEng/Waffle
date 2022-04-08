import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {waffleChai} from '../src';

chai.use(chaiAsPromised);
chai.use(waffleChai);

export {calledOnContractTest} from './matchers/calledOnContract/calledOnContractTest';
export {calledOnContractValidatorsTest} from './matchers/calledOnContract/calledOnContractValidatorsTest';
export {calledOnContractWithTest} from './matchers/calledOnContract/calledOnContractWithTest';
export {changeEtherBalanceTest} from './matchers/changeEtherBalanceTest';
export {changeEtherBalancesTest} from './matchers/changeEtherBalancesTest';
export {changeTokenBalanceTest} from './matchers/changeTokenBalanceTest';
export {changeTokenBalancesTest} from './matchers/changeTokenBalancesTest';
export {eventsTest} from './matchers/eventsTest';
export {revertedTest} from './matchers/revertedTest';
export {revertedWithTest} from './matchers/revertedWithTest';
