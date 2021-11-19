import ffi from 'ffi-napi';
import {join} from 'path';

export const library = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  cgoCurrentMillis: ['int', []],
  getBlockNumber: ['string', []],
  sendTransaction: ['void', ['string']],
  getBalance: ['string', ['string']]
});

export function cgoCurrentMillis() {
  return library.cgoCurrentMillis();
}

export function getBlockNumber(): string {
  return library.getBlockNumber();
}

export function getBalance(address: string): string {
  return library.getBalance(address);
}

export function sendTransaction(data: string): void {
  return library.sendTransaction(data);
}
