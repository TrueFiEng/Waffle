import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {waffleChai} from '@ethereum-waffle/chai';

chai.use(chaiAsPromised);
chai.use(waffleChai);
