import { expect } from 'chai';
import {cgoCurrentMillis, getBlockNumber} from '../src/native';

describe('Native', () => {
    it('can call a native function', () => {
        expect(cgoCurrentMillis()).to.be.a('number')
        expect(cgoCurrentMillis()).to.be.gt(0)
    })

  it('can get block number', () => {
    expect(getBlockNumber()).to.equal('0')
  })
})
