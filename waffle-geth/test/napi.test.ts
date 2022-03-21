import {expect} from 'chai';
const libNapi = require('../build/Release/addon.node');

import ffi from 'ffi-napi';
import {join} from 'path';
import {readFileSync} from 'fs'

const libFfi = ffi.Library(join(__dirname, '../go/build/wafflegeth.dylib'), {
  countLines: ['int', ['string']],
});

const TEXT = readFileSync(join(__dirname, '../../yarn.lock'), { encoding: 'utf-8' })
const LINES = TEXT.split('\n').length - 1;

describe('napi', () => {
  it('cgoCurrentMillis', () => {
    const millis = libNapi.cgoCurrentMillis();

    console.log({ millis });

    expect(millis).to.be.a('number');
  })

  describe('count lines', () => {
    it('napi', () => {
      const lines = libNapi.countLines(TEXT);
      expect(lines).to.eq(LINES);
    })

    it('ffi', () => {
      const lines = libFfi.countLines(TEXT);
      expect(lines).to.eq(LINES);
    })    
  })

  describe.only('bench count lines', () => {
    it('napi', () => {
      formatBench(bench(() => {
        const lines = libNapi.countLines(TEXT);
        expect(lines).to.eq(LINES);
      }))
    })

    it('ffi', () => {
      formatBench(bench(() => {
        const lines = libFfi.countLines(TEXT);
        expect(lines).to.eq(LINES);
      }))
    })    
  })
})

interface BenchResult {
  iterations: number
  timePerIter: bigint;
  iterPerSec: bigint;
}

function bench(func: () => void): BenchResult {
  let totalElapsed = 0n;
  let iterations = 0;
  while(iterations++ < 10_000) {
    const before = process.hrtime.bigint();
    func();
    const after = process.hrtime.bigint();
    totalElapsed += after - before;
    if(totalElapsed > 1_000_000_000n) {
      break;
    }
  }

  const timePerIter = totalElapsed / BigInt(iterations);
  const iterPerSec = 1_000_000_000n * BigInt(iterations) / totalElapsed;
  return { iterations, timePerIter, iterPerSec };
}

function formatBench(result: BenchResult, label?: string) {
  console.log(`${label || 'bench'}: ${result.iterPerSec} iterations/sec, ${result.timePerIter} ns/iter`);
}