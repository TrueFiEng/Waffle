import {join, dirname} from 'path';
import fs from 'fs';
import {Config} from '../config/config';
import { getHumanReadableAbi } from './getHumanReadableAbi';

export interface BytecodeJson {
  linkReferences: object;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface EvmJson {
  bytecode: BytecodeJson;
  deployedBytecode?: BytecodeJson;
}

export interface ContractJson {
  'srcmap-runtime'?: string;
  srcmap?: string;
  bin?: string;
  'bin-runtime'?: string;
  interface?: object[];
  abi: object[];
  bytecode?: string;
  humanReadableAbi?: string[];
  evm: EvmJson;
}

export async function saveOutput(output: any, config: Config, filesystem = fs) {
  config.outputType = config.outputType || 'multiple';

  if (['multiple', 'all'].includes(config.outputType)) {
    saveOutputSingletons(output, config, filesystem);
  }

  if (['combined', 'all'].includes(config.outputType)) {
    saveOutputCombined(output, config, filesystem);
  }
}

export async function saveOutputSingletons(output: any, config: Config, filesystem = fs) {
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

export async function saveOutputCombined(output: any, config: Config, filesystem = fs) {
  for (const [key, file] of Object.entries(output.contracts)) {
    for (const [contractName, contractJson] of Object.entries(file)) {
      contractJson.bin = contractJson.evm.bytecode.object;
      contractJson['bin-runtime'] = contractJson.evm.deployedBytecode.object;
      contractJson.srcmap = contractJson.evm.bytecode.sourceMap;
      contractJson['srcmap-runtime'] = contractJson.evm.deployedBytecode.sourceMap;

      output.contracts[String(key) + ':' + String(contractName)] = contractJson;
    }
    delete output.contracts[key];
  }

  const allSources: string[] =  [];

  for (const [key, value] of Object.entries(output.sources) as any) {
    value.AST = value.ast;
    delete value.ast;
    allSources.push(key);
  }

  output.sourceList = allSources;

  filesystem.writeFileSync(
    join(config.targetPath, `Combined-Json.json`), JSON.stringify(output, null, 2)
  );

}

function getContent(contractJson: ContractJson, config: Config) {
  if (config.legacyOutput || !contractJson.interface) {
    contractJson.interface = contractJson.abi;
    contractJson.bytecode = contractJson.evm.bytecode.object;
  }
  if (config.outputHumanReadableAbi) {
    contractJson.humanReadableAbi = getHumanReadableAbi(contractJson.abi);
  }
  return JSON.stringify(contractJson, null, 2);
}
