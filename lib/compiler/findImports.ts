import fs from 'fs';
import path from 'path';
import {readFileContent} from '../utils';

export function findImports(libraryPath: string) {
  return (file: string) => {
    try {
      const libFile = path.join(libraryPath, file);
      if (fs.existsSync(file)) {
        return { contents: readFileContent(file) };
      } else if (fs.existsSync(libFile)) {
        return { contents: readFileContent(libFile) };
      } else {
        throw new Error(`File not found: ${file}`);
      }
    } catch (e) {
      return { error: e.message };
    }
  };
}
