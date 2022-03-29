import { Simulator } from '../src/simulator';
import { expect } from 'chai';

describe.only('Simulator', () => {
  it('block number is 0 initially', () => {
    const simulator = new Simulator();
    expect(simulator.getBlockNumber()).to.eq('0');
  })
})