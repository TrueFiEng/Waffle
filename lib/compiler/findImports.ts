import { ImportFile } from '@resolver-engine/imports';

export function findImports(fileCache: ImportFile[]) {
  return (file: string) => {
    const result = fileCache.find((importFile) => importFile.url === file);
    if (result) {
      return {contents: result.source};
    }
    return {error: `File not found: ${file}`};
  };
}
