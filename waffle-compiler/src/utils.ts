import fs from 'fs';
import path from 'path';

export const readFileContent = (path: string): string =>
  fs.readFileSync(path).toString();

export const isPositiveIntegerString = (value: unknown) =>
  typeof value === 'string' && /^\d+$/.test(value);

export const eventParseResultToArray = (eventResult: object) =>
  Object.keys(eventResult)
    .filter(isPositiveIntegerString)
    .map((key) => (eventResult as any)[key]);

export const isWarningMessage = (error: any) =>
  error.severity === 'warning';

export const isFile = (filePath: string) =>
  fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

export const flattenObjectArray = (array: object[]) =>
  array.reduce((accum, object) => Object.assign(accum, object), {});

export const last = <T>(array: T[]): T =>
  array[array.length - 1];

export const deepCopy = (obj: any) =>
  JSON.parse(JSON.stringify(obj));

export const isDirectory = (directoryPath: string) =>
  fs.existsSync(relativePathToWorkingDir(directoryPath)) &&
  fs.statSync(relativePathToWorkingDir(directoryPath)).isDirectory();

export const relativePathToWorkingDir = (pathName: string) => path.resolve(pathName);
