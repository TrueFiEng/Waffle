import { ImportFile } from '@resolver-engine/imports-fs';

export function findImports(fileCache: ImportFile[]) {
  return (file: string) => {
    const result = fileCache.find((importFile) => importFile.url === file);
    if (result) {
      return {contents: result.source};
    }
    throw new Error(`File not found: ${file}`);
  };
}
