import {exec} from 'child_process';

const MAX_BUFFER_SIZE = 4 * 1024 * 1024; // 4 MB

export async function executeCommand(command: string, input: string) {
  return new Promise<string>((resolve, reject) => {
    const childProcess = exec(
      command,
      {maxBuffer: MAX_BUFFER_SIZE},
      (err, stdout) => err ? reject(err) : resolve(stdout)
    );
    childProcess.stdin?.write(input);
    childProcess.stdin?.end();
  });
}
