import {readdirSync, readFileSync} from 'fs';
import {join} from 'path';

export type JumpType = 'in' | 'out' | 'normal'

export type SourceMap = SourceMapItem[]

interface ContractSourceInfo {
  id: number;
  uri: string;
}

export type ContractSources = Array<[string, ContractSourceInfo]>;

export interface SourceMapItem {
  offset: number;
  length: number;
  file: number;
  jumpType: JumpType;
  modifierDepth: number;
}

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
    if (location.file === -1) {
      return null;
    }
    const contractSources = Object.entries(contract.sources) as ContractSources;
    const contractUri = findContractUri(contractSources, location);
    const contractSource = readFileSync(contractUri, {encoding: 'utf-8'});
    const line = getLine(contractSource, location.offset);
    return {
      file: contractUri,
      line
    };
  }
}

export function findContractUri(contractSources: ContractSources, location: SourceMapItem): string {
  const obj = contractSources.find(contractSource => contractSource[1].id === location.file);
  if (!obj) return '';
  return obj[1].uri;
}

export function parseItem(prevItem: SourceMapItem, curItem: string): SourceMapItem {
  const [offset, length, file, jumpType, modifierDepth] = curItem.split(':');
  return {
    offset: offset ? parseInt(offset) : prevItem.offset,
    length: length ? parseInt(length) : prevItem.length,
    file: file ? parseInt(file) : prevItem.file,
    jumpType: jumpType ? parseJumpType(jumpType) : prevItem.jumpType,
    modifierDepth: modifierDepth ? parseInt(modifierDepth) : prevItem?.modifierDepth ?? 0
  };
}

export function parseSourceMap(sourceMap: string): SourceMap {
  return sourceMap.split(';')
    .reduce((accumulator, currentItem, index) =>
      [...accumulator, parseItem(accumulator[index - 1], currentItem)],
    [] as SourceMap
    );
}

function parseJumpType(jumpType: string): JumpType {
  switch (jumpType) {
    case 'i': return 'in';
    case 'o': return 'out';
    case '-': return 'normal';
    default: throw new Error('Invalid jump type');
  }
}

export function getInstructionIndex(bytecode: string, programCounter: number): number {
  if (bytecode.length === 0) return 0;
  let idx = 0;
  for (let i = 0; i < programCounter; i++) {
    const byte = parseInt(bytecode.slice(i * 2, i * 2 + 2), 16);
    const pushSize = getPushSize(byte);
    idx++;
    i += pushSize;
  }
  return idx - 1;
}

export function getLine(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

export function getPushSize(byte: number): number {
  if (byte >= 0x60 && byte <= 0x7f) {
    return byte + 1 - 0x60;
  }
  return 0;
}
