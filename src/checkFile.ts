import { exit } from 'node:process'
import { pathExists } from 'fs-extra'

export default async function checkFile(path: string): Promise<boolean> {
  try {
    return await pathExists(path)
  } catch (err) {
    console.error(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  }
}
