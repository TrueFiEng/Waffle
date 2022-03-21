import {expect} from 'chai';
const libNapi = require('../build/Release/addon.node');

import ffi from 'ffi-napi';
import {join} from 'path';

const libFfi = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  countLines: ['int', ['string']],
});

const TEXT = 'foo\nbar\nbaz\n'
const LINES = 3

describe('napi', () => {
  it('cgoCurrentMillis', () => {
    const millis = libNapi.cgoCurrentMillis();

    console.log({ millis });

    expect(millis).to.be.a('number');
  })

  describe.only('count lines', () => {
    it('napi', () => {
      const lines = libNapi.countLines(TEXT);
      expect(lines).to.eq(LINES);
    })

    it('ffi', () => {
      const lines = libFfi.countLines(TEXT);
      expect(lines).to.eq(LINES);
    })    
  })
})