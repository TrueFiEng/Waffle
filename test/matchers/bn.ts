import chai, {AssertionError} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from '../../lib/waffle';
import {utils} from 'ethers';

chai.use(solidity);
chai.use(chaiAsPromised);

const {expect} = chai;

describe('UNIT: Bignumber matchers', () => {
  it('equal', async () => {
    expect(utils.bigNumberify(10)).to.be.equal(10);
    expect(utils.bigNumberify(10)).to.be.equal('10');
    expect(utils.bigNumberify(10)).to.be.equal(utils.bigNumberify(10));
    expect(utils.bigNumberify(10)).to.be.eq(10);
    expect(utils.bigNumberify(10)).to.be.eq('10');
    expect(utils.bigNumberify(10)).to.be.eq(utils.bigNumberify(10));
  });

  it('not equal', async () => {
    expect(utils.bigNumberify(10)).to.be.not.equal(11);
    expect(utils.bigNumberify(10)).to.be.not.equal('11');
    expect(utils.bigNumberify(10)).to.be.not.equal(utils.bigNumberify(11));
  });

  it('throws proper message on error', async () => {
    expect(
      () => expect(utils.bigNumberify(10)).to.be.equal(11)
    ).to.throw(AssertionError, 'Expected "10" to be equal 11');
  });

  it('do not broke equal on numbers', async () => {
    expect(10).to.be.equal(10);
    expect(10).to.be.not.equal(11);
  });

  it('above', async () => {
    expect(utils.bigNumberify(10)).to.be.above(9);
    expect(utils.bigNumberify(10)).to.be.above('9');
    expect(utils.bigNumberify(10)).to.be.above(utils.bigNumberify(9));
    expect(utils.bigNumberify(10)).to.be.not.above(10);
    expect(utils.bigNumberify(10)).to.be.not.above('10');
    expect(utils.bigNumberify(10)).to.be.not.above(utils.bigNumberify(10));
    expect(utils.bigNumberify(10)).to.be.not.above(11);
    expect(utils.bigNumberify(10)).to.be.not.above('11');
    expect(utils.bigNumberify(10)).to.be.not.above(utils.bigNumberify(11));
  });

  it('do not broke above on numbers', async () => {
    expect(10).to.be.above(9);
    expect(10).to.be.not.above(10);
    expect(10).to.be.not.above(11);
  });

  it('below', async () => {
    expect(utils.bigNumberify(10)).to.be.not.below(9);
    expect(utils.bigNumberify(10)).to.be.not.below('9');
    expect(utils.bigNumberify(10)).to.be.not.below(utils.bigNumberify(9));
    expect(utils.bigNumberify(10)).to.be.not.below(10);
    expect(utils.bigNumberify(10)).to.be.not.below('10');
    expect(utils.bigNumberify(10)).to.be.not.below(utils.bigNumberify(10));
    expect(utils.bigNumberify(10)).to.be.below(11);
    expect(utils.bigNumberify(10)).to.be.below('11');
    expect(utils.bigNumberify(10)).to.be.below(utils.bigNumberify(11));
  });

  it('do not broke below on numbers', async () => {
    expect(10).to.be.not.below(9);
    expect(10).to.be.not.below(10);
    expect(10).to.be.below(11);
  });

  it('at least', async () => {
    expect(utils.bigNumberify(10)).to.be.at.least(9);
    expect(utils.bigNumberify(10)).to.be.at.least('9');
    expect(utils.bigNumberify(10)).to.be.at.least(utils.bigNumberify(9));
    expect(utils.bigNumberify(10)).to.be.at.least(10);
    expect(utils.bigNumberify(10)).to.be.at.least('10');
    expect(utils.bigNumberify(10)).to.be.at.least(utils.bigNumberify(10));
  });

  it('do not broke at least on numbers', async () => {
    expect(10).to.be.at.least(10);
    expect(10).to.be.at.least(9);
  });

  it('at most', async () => {
    expect(utils.bigNumberify(10)).to.be.at.most(11);
    expect(utils.bigNumberify(10)).to.be.at.most('11');
    expect(utils.bigNumberify(10)).to.be.at.most(utils.bigNumberify(11));
    expect(utils.bigNumberify(10)).to.be.at.most(10);
    expect(utils.bigNumberify(10)).to.be.at.most('10');
    expect(utils.bigNumberify(10)).to.be.at.most(utils.bigNumberify(10));
  });

  it('do not broke at most on numbers', async () => {
    expect(10).to.be.at.most(10);
    expect(10).to.be.at.most(11);
  });
});
