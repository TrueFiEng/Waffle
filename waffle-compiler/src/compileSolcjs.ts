import solc from 'solc';
import path from 'path';
import fetch from 'node-fetch';
import {ImportFile} from '@resolver-engine/imports';
import {isDirectory, isFile, removeEmptyDirsRecursively} from './utils';
import {Config} from './config';
import {getCompilerInput} from './compilerInput';
import {findImports} from './findImports';
import mkdirp from 'mkdirp';
import fs from 'fs';
import https from 'https';

const semverRegex = /^\d+\.\d+\.\d+$/;

export function compileSolcjs(config: Config) {
  return async function compile(sources: ImportFile[]) {
    const solc = await loadCompiler(config);
    const input = getCompilerInput(sources, config.compilerOptions, 'Solidity');
    const imports = findImports(sources);
    const output = solc.compile(input, {imports});
    return JSON.parse(output);
  };
}

export async function loadCompiler({compilerVersion, cacheDirectory}: Config) {
  if (isDefaultVersion(compilerVersion)) {
    return solc;
  }
  if (isDirectory(compilerVersion)) {
    return require(path.resolve(compilerVersion));
  }
  try {
    const version = semverRegex.test(compilerVersion)
      ? await resolveSemverVersion(compilerVersion)
      : compilerVersion;
    return await loadVersion(version, cacheDirectory);
  } catch (e) {
    throw new Error(`Error fetching compiler version: ${compilerVersion}.`);
  }
}

function isDefaultVersion(version: string) {
  return version === 'default' ||
    (semverRegex.test(version) && solc.version().startsWith(`${version}+`));
}

async function resolveSemverVersion(version: string) {
  const releases = await fetchReleases();
  const item: string = releases[version];
  return item.substring('soljson-'.length, item.length - '.js'.length);
}

const VERSION_LIST_URL = 'https://solc-bin.ethereum.org/bin/list.json';
let cache: any = undefined;

async function fetchReleases() {
  if (!cache) {
    const res = await fetch(VERSION_LIST_URL);
    const {releases} = await res.json();
    cache = releases;
  }
  return cache;
}

async function loadVersion(version: string, cacheDirectory: string) {
  const cachedSolcPath = path.resolve(cacheDirectory, 'solcjs', `${version}.js`);
  if (!isFile(cachedSolcPath)) {
    await cacheRemoteVersion(version, cacheDirectory);
  }
  return loadCachedVersion(cachedSolcPath);
}

async function cacheRemoteVersion(version: string, cacheDirectory: string) {
  const solcCacheDirectory = path.resolve(cacheDirectory, 'solcjs');
  if (!isDirectory(solcCacheDirectory)) {
    mkdirp.sync(solcCacheDirectory);
  }

  const filePath = path.join(solcCacheDirectory, `${version}.js`);
  const file = fs.createWriteStream(filePath);
  const url = `https://solc-bin.ethereum.org/bin/soljson-${version}.js`;

  await new Promise<void>((resolve, reject) => {
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (error) => {
      try {
        fs.unlinkSync(filePath);
        removeEmptyDirsRecursively(path.resolve(cacheDirectory));
      } finally {
        reject(error);
      }
    });
  });
}

function loadCachedVersion(cachedVersionPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const solcjs = require(cachedVersionPath);
  return solc.setupMethods(solcjs);
}
