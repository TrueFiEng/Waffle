import {join, dirname} from 'path';
import fs from 'fs';
import {Config} from '../config/config';

export interface BytecodeJson {
  linkReferences: object;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface EvmJson {
  bytecode: BytecodeJson;
}

export interface ContractJson {
  interface: object[];
  abi: object[];
  bytecode: string;
  evm: EvmJson;
}

export async function saveOutput(output: any, config: Config, filesystem = fs) {
  for (const [, file] of Object.entries(output.contracts)) {
    for (const [contractName, contractJson] of Object.entries(file)) {
      const filePath = join(config.targetPath, `${contractName}.json`);
      const dirPath = dirname(filePath);
      if (!filesystem.existsSync(dirPath)) {
        filesystem.mkdirSync(dirPath);
      }
      filesystem.writeFileSync(filePath, getContent(contractJson, config));
    }
  }
}

function getContent(contractJson: ContractJson, config: Config) {
  if (config.legacyOutput || !contractJson.interface) {
    contractJson.interface = contractJson.abi;
    contractJson.bytecode = contractJson.evm.bytecode.object;
  }
  return JSON.stringify(contractJson, null, 2);
}
