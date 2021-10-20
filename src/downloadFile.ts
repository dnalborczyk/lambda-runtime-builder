import { exit } from 'node:process'
import fetch, { Response } from 'node-fetch'

const NODE_BUILD_URL = 'https://nodejs.org'

export default async function downloadFile(
  nodeVersion: string,
  tarArchive: string,
): Promise<Response> {
  const url = new URL(
    `dist/v${nodeVersion}/${tarArchive}.tar.gz`,
    NODE_BUILD_URL,
  )
  // console.log(String(url))

  try {
    return await fetch(String(url))
  } catch (err) {
    console.error(`ERROR ${err.message}`)
    exit(1) // TODO temp, cli only
  }
}
