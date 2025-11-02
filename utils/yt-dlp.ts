import { spawn } from 'node:child_process';
import { Readable } from 'node:stream';

export const execYtDlp = (
  url: string,
  {
    args,
    abortSignal,
    binary = process.env.YT_DLP_BIN,
  }: {
    args?: string[];
    abortSignal?: AbortSignal;
    binary?: string;
  } = {},
) => {
  const readStream = new Readable({ read() {} });
  const ytDlpProcess = spawn(binary, [
    url,
    '-o',
    '-', // this is stdout yt-dlp handle
    ...(args ?? []),
  ]);

  abortSignal?.addEventListener('abort', () => {
    ytDlpProcess.kill('SIGINT');
  });

  ytDlpProcess.stdout.on('data', (data) => readStream.push(data));

  const stderrData = Buffer.alloc(256); // 256 bytes
  ytDlpProcess.stderr.on('data', (data) => {
    stderrData.write(data.toString());
  });

  let processError: Error;
  ytDlpProcess.on('error', (error) => {
    processError = error;
  });

  ytDlpProcess.on('close', (code) => {
    if (code === 0 || ytDlpProcess.killed) {
      readStream.emit('close');
      readStream.destroy();
      readStream.emit('end');
      return;
    }

    readStream.destroy(
      new YTDlpError(code, processError, stderrData.toString()),
    );
  });

  return readStream;
};

class YTDlpError extends Error {
  constructor(
    readonly code: number | null,
    readonly processError: Error,
    readonly stderr: string,
  ) {
    super();
  }
}
