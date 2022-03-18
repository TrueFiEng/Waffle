import fs from 'fs';
import path from 'path';
import {isDirectory} from './utils';

export function findInputs(sourcePath: string, extension: string) {
  const stack = [sourcePath];
  const inputFiles: string[] = [];
  while (stack.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dir = stack.pop()!;
    console.log({dir})
    const files = fs.readdirSync(dir);
    for (const file of files) {
      console.log({file})
      const filePath = path.join(dir, file);
      if (isDirectory(filePath)) {
        stack.push(filePath);
      } else if (file.endsWith(extension)) {
        inputFiles.push(filePath);
      }
    }
  }
  console.log('All input files found')
  console.log(inputFiles)
  return inputFiles;
}
