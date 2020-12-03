declare module 'solc' {
  export interface SolcCompiler {
    compile(sources: string, findImports: (...args: any[]) => any): any;
  }
  export function compile(sources: string, findImports: (...args: any[]) => any): any

  export function setupMethods(solcjs: any): SolcCompiler

  export function loadRemoteVersion(
    version: string,
    callback: (err?: Error, solc?: SolcCompiler) => void
  ): void;
  export function version(): string;
}
