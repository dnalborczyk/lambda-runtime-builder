import type { Buffer } from 'node:buffer'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import type { Readable } from 'node:stream'
import archiver from 'archiver'
import { ensureDir, pathExists } from 'fs-extra'
import fetch, { Response } from 'node-fetch'
import { Parse } from 'tar'

const NODE_BUILD_URL = 'https://nodejs.org'

async function checkDir(path: string): Promise<void> {
  try {
    await ensureDir(path)
  } catch (err) {
    console.error(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  }
}

async function checkFile(path: string): Promise<boolean> {
  try {
    return await pathExists(path)
  } catch (err) {
    console.error(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  }
}

export interface Options {
  architecture: 'arm64' | 'x64'
  nodeVersion: string
  operatingSystem: 'linux'
  overwrite: boolean
  runtimeFilename: string
  runtimePath: string
}

export default async function createPackage(
  options: Options,
): Promise<boolean> {
  const {
    architecture,
    nodeVersion,
    operatingSystem,
    overwrite,
    runtimeFilename,
    runtimePath,
  } = options

  await checkDir(runtimePath)

  const filePath = resolve(runtimePath, runtimeFilename)

  const exists = await checkFile(filePath)

  if (!overwrite && exists) {
    console.error(`ERROR: file ${filePath} already exists.`)
    exit(1) // TODO temp, cli only
  }

  const tarArchive = `node-v${nodeVersion}-${operatingSystem}-${architecture}`

  const url = new URL(
    `dist/v${nodeVersion}/${tarArchive}.tar.gz`,
    NODE_BUILD_URL,
  )
  console.log(String(url))

  let response: Response

  try {
    response = await fetch(String(url))
  } catch (err) {
    console.error(`ERROR ${err.message}`)
    exit(1) // TODO temp, cli only
  }

  const output = createWriteStream(filePath)

  output.on('error', (err) => {
    console.log(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  })

  const archive = archiver('zip', {
    zlib: {
      level: 9,
    },
  })

  archive.on('error', (err) => {
    console.log(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  })

  // @ts-ignore
  const tarExtract = new Parse({
    filter(path: string) {
      return path === `${tarArchive}/bin/node`
    },

    onentry(entry: string | Readable | Buffer) {
      archive.append(entry, { name: 'bin/node', mode: 0o755 }) // file bug in tar?
      // archive.file('bootstrap', { name: 'bootstrap' })
      // archive.file('bootstrap.js', { name: 'bootstrap.js' })
      // archive.file('package.json', { name: 'package.json' })
      // archive.file('ric.js', { name: 'ric.js' })
      // archive.file('ric.js.map', { name: 'ric.js.map' })

      archive.pipe(output)

      archive.finalize()
    },

    strip: 1,
    // C: "bin", // alias for cwd:'some-dir', also ok
  })

  tarExtract.on('error', (err: any) => {
    console.log(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  })

  if (response.body == null) {
    console.error(`ERROR: no response body.`) // TODO temp, cli only
    exit(1)
  }

  response.body.pipe(tarExtract)

  // TODO reject, error handling, temp, cli only
  return new Promise((resolve /* reject */) => {
    archive.on('end', () => {
      resolve(true)
      console.log(`Done! File created at ${filePath}`)
    })
  })
}
