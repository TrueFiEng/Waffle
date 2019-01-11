declare module 'solc' {
  export interface SolcCompiler {
    compile(sources: string, findImports: Function): any
  }
  export function compile(sources: string, findImports: Function): any
  export function loadRemoteVersion(
    version: string,
    callback: (err?: Error, solc?: SolcCompiler) => void
  ): void;
}
