import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';

export class SourceMapLoader {
  constructor(private readonly outputDir: string) {}

  locateLineByBytecodeAndProgramCounter(bytecode: string, programCounter: number) {
    const contracts = readdirSync(this.outputDir);
    let contract;
    for (const file of contracts) {
      try {
        const data = JSON.parse(readFileSync(join(this.outputDir, file), {encoding: 'utf-8'}));
        if (data.evm.deployedBytecode.object === bytecode.slice(2)) {
          contract = data;
          break;
        }
      } catch {}
    }
    const sourceMap = parseSourceMap(contract.evm.deployedBytecode.sourceMap);
    const instructionIndex = getInstructionIndex(contract.evm.deployedBytecode.object, programCounter);
    const location = sourceMap[instructionIndex];
    const file = (Object.entries(contract.sources).find(([file, x]) => (x as any).id === location.file)![1] as any).uri;
    const source = readFileSync(file, {encoding: 'utf-8'});
    const line = getLine(source, location.offset);
    return {
      file,
      line
    };
  }
}

export type JumpType = 'in' | 'out' | 'normal'

export interface SourceMapItem {
  offset: number;
  length: number;
  file: number;
  jumpType: JumpType;
  modifierDepth: number;
}

export type SourceMap = SourceMapItem[]

function parseSourceMap(sourceMap: string) {
  const res: SourceMap = [];
  sourceMap.split(';')
    .forEach(x => {
      const [offset, length, file, jumpType, modifierDepth] = x.split(':');
      const prevItem = res[res.length - 1];
      const item: SourceMapItem = {
        offset: offset ? parseInt(offset, 10) : prevItem.offset,
        length: length ? parseInt(length, 10) : prevItem.length,
        file: file ? parseInt(file, 10) : prevItem.file,
        jumpType: jumpType ? parseJumpType(jumpType) : prevItem.jumpType,
        modifierDepth: modifierDepth ? parseInt(modifierDepth, 10) : prevItem?.modifierDepth ?? 0
      };
      res.push(item);
    });
  return res;
}

function parseJumpType(jumpType: string): JumpType {
  switch (jumpType) {
    case 'i': return 'in';
    case 'o': return 'out';
    case '-': return 'normal';
    default: throw new Error('Invalid jump type');
  }
}

function getInstructionIndex(bytecode: string, pc: number) {
  let idx = 0;
  for (let i = 0; i < pc; i++) {
    const byte = parseInt(bytecode.slice(i * 2, i * 2 + 2), 16);
    const pushSize = getPushSize(byte);
    idx++;
    i += pushSize;
  }
  return idx - 1;
}

function getLine(source: string, offset: number) {
  let line = 1;
  for (let i = 0; i < offset; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

function getPushSize(byte: number) {
  if (byte >= 0x60 && byte <= 0x7f) {
    return byte + 1 - 0x60;
  }
  return 0;
}
