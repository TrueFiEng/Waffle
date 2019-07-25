import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import sinonChai from 'sinon-chai';
import {solidity} from '../lib/waffle';

chai.use(chaiAsPromised);
chai.use(chaiString);
chai.use(sinonChai);
chai.use(solidity);
