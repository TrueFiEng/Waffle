import ffi from 'ffi-napi';
import {join} from 'path';

const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []]
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber(): string {
  return library.getBlockNumber();
}
