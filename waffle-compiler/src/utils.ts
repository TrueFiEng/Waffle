import fs from 'fs';
import path from 'path';
import {Config} from './config';

export const readFileContent = (path: string): string =>
  fs.readFileSync(path).toString();

export const isFile = (filePath: string) =>
  fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

export const isDirectory = (directoryPath: string) =>
  fs.existsSync(path.resolve(directoryPath)) &&
  fs.statSync(path.resolve(directoryPath)).isDirectory();

export const getExtensionForCompilerType = (config: Config) => {
  return config.compilerType === 'dockerized-vyper' ? '.vy' : '.sol';
};

export const insert = (source: string, insertedValue: string, index: number) =>
  `${source.slice(0, index)}${insertedValue}${source.slice(index)}`;
