#!/usr/bin/env node

import meow from 'meow'
import createPackage, { Options } from '../index.js'
import cliMenu from '../cli-menu/index.js'

// --latest               show latest version of node.js
// --latest-lts           show latest LTS version of node.js
// Options
// --build-path               file path to node.js gzip build         NOT YET SUPPORTED
// --operating-system, -os    darwin | linux | windows           default: linux (for now, only Linux is supported)

const cli = meow(
  `
  Usage
    $ lambda-runtime-builder <input>

  Options
    --cpu-architecture  -a     possible values: arm64 | x86_64    default: x86_64
    --interactive       -i     interactive menu, ignores all other flags
    --node-version      -n     version of node.js, e.g. 16.10.0   default: 16.10.0 (soon: latest-lts)
    --overwrite         -o     overwrite existing file            default: false
    --runtime-filename         file name of zipped runtime        default: ./package/custom-node-runtime-v{node-version}.zip
    --runtime-path             path to zipped runtime             default: ./package/custom-node-runtime-v{node-version}.zip

  Examples
	  $ lambda-runtime-builder --arch arm64
`,
  {
    flags: {
      cpuArchitecture: {
        alias: 'a',
        default: 'x86_64',
        type: 'string',
      },

      interactive: {
        alias: 'i',
        default: false,
        type: 'boolean',
      },

      nodeVersion: {
        alias: 'n',
        // default: '17.0.0', // TODO temp, support: latest, latest-lts
        type: 'string',
      },

      overwrite: {
        alias: 'o',
        default: false,
        type: 'boolean',
      },

      runtimeFilename: {
        alias: 'f',
        default: './node-runtime',
        type: 'string',
      },

      runtimePath: {
        alias: 'p',
        default: './runtime',
        type: 'string',
      },
    },
    importMeta: import.meta,
  },
)

const {
  cpuArchitecture,
  interactive,
  nodeVersion,
  overwrite,
  runtimeFilename,
  runtimePath,
} = cli.flags

if (interactive || nodeVersion == null) {
  cliMenu()
} else {
  const options: Options = {
    cpuArchitecture: cpuArchitecture === 'arm64' ? 'arm64' : 'x64',
    nodeVersion,
    operatingSystem: 'linux', // for now the only one supported
    overwrite,
    runtimeFilename:
      runtimeFilename === './node-runtime'
        ? `${runtimeFilename}-v${nodeVersion}-${cpuArchitecture}.zip`
        : 'node-runtime',
    runtimePath,
  }

  createPackage(options)
}
