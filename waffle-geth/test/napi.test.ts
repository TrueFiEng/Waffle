import {expect} from 'chai';

describe('napi', () => {
  it.only('cgoCurrentMillis', () => {
    const lib = require('../build/Release/addon.node');
    const millis = lib.cgoCurrentMillis();

    console.log({ millis });

    expect(millis).to.be.a('number');
  })
})