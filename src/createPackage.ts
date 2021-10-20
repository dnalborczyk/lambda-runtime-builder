import type { Buffer } from 'node:buffer'
import { createWriteStream } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { exit } from 'node:process'
import type { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'
import { Parse } from 'tar'
import checkDir from './checkDir.js'
import checkFile from './checkFile.js'
import downloadFile from './downloadFile.js'

// temp
const bootstrapDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..', // temp
  'src',
)

const ricDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..', // temp
  'node_modules',
  'aws-lambda-ric',
)

// console.log(bootstrapDir)

export interface Options {
  cpuArchitecture: 'arm64' | 'x64'
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
    cpuArchitecture,
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

  const tarArchive = `node-v${nodeVersion}-${operatingSystem}-${cpuArchitecture}`

  const response = await downloadFile(nodeVersion, tarArchive)

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
      archive
        .append(entry, { name: 'bin/node', mode: 0o755 }) // file bug in tar?
        .file(join(bootstrapDir, 'bootstrap/bootstrap'), {
          name: 'bootstrap',
        })
        .file(join(bootstrapDir, 'bootstrap/bootstrap.js'), {
          name: 'bootstrap.js',
        })
        .file(join(ricDir, 'package.json'), { name: 'package.json' })
        .file(join(ricDir, 'dist/index.js'), { name: 'ric.js' })
        .file(join(ricDir, 'dist/index.js.map'), { name: 'ric.js.map' })
        .pipe(output)

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
