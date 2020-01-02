import {ImportFile} from '@resolver-engine/imports';

export function findImports(sources: ImportFile[]) {
  return (file: string) => {
    const result = sources.find((importFile) => importFile.url === file);
    if (result) {
      return {contents: result.source};
    }
    return {error: `File not found: ${file}`};
  };
}
