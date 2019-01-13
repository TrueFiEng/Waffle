import {utils} from 'ethers';

export interface LinkableContract {
  evm: {
    bytecode: {
      object: any
    }
  };
}

export function linkSolidity4(
  contract: LinkableContract,
  libraryName: string,
  libraryAddress: string
) {
  const address = libraryAddress.replace('0x', '');
  const libraryNamePrefix = libraryName.slice(0, 36);
  const pattern = new RegExp(`_+${libraryNamePrefix}_+`, 'g');
  if (!pattern.exec(contract.evm.bytecode.object)) {
    throw new Error(`Can't link '${libraryName}'.`);
  }
  contract.evm.bytecode.object = contract.evm.bytecode.object.replace(pattern, address);
}

export function linkSolidity5(
  contract: LinkableContract,
  libraryName: string,
  libraryAddress: string
) {
  const address = libraryAddress.replace('0x', '');
  const encodedLibraryName = utils
    .solidityKeccak256(['string'], [libraryName])
    .slice(2, 36);
  const pattern = new RegExp(`_+\\$${encodedLibraryName}\\$_+`, 'g');
  const bytecode = contract.evm.bytecode.object;
  if (!pattern.exec(bytecode)) {
    throw new Error(`Can't link '${libraryName}'.`);
  }
  contract.evm.bytecode.object = bytecode.replace(pattern, address);
}
