import ffi from 'ffi-napi';
import {join} from 'path';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []],
  sendTransaction: ['void', ['string']],
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber() {
  return library.getBlockNumber();
}
