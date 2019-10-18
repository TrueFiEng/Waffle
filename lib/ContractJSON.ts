export interface StandardContractJSON {
  abi: any;
  evm: {bytecode: {object: any}};
}

export interface SimpleContractJSON {
  abi: any[];
  bytecode: string;
}

export type ContractJSON = StandardContractJSON | SimpleContractJSON;

export const isStandard = (data: ContractJSON): data is StandardContractJSON =>
  typeof (data as any).evm === 'object' &&
  (data as any).evm !== null &&
  typeof (data as any).evm.bytecode === 'object' &&
  (data as any).evm.bytecode !== null;

export function hasByteCode(bytecode: {object: any} | string) {
  if (typeof bytecode === 'object') {
    return Object.entries(bytecode.object).length !== 0;
  }
  return Object.entries(bytecode).length !== 0;
}
