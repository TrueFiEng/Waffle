import fs from 'fs';
import path from 'path';
import {isDirectory} from './utils';

export function findInputs(sourcePath: string, extensions: string[]) {
  const stack = [sourcePath];
  const inputFiles: string[] = [];
  while (stack.length > 0) {
    const dir = stack.pop()!;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (isDirectory(filePath)) {
        stack.push(filePath);
      } else {
        for (const extension of extensions) {
          if (file.endsWith(extension)) {
            inputFiles.push(filePath);
          }
        }
      }
    }
  }
  return inputFiles;
}
