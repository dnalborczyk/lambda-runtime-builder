import { exit } from 'node:process'
import { ensureDir } from 'fs-extra'

export default async function checkDir(path: string): Promise<void> {
  try {
    await ensureDir(path)
  } catch (err) {
    console.error(`ERROR: ${err.message}`)
    exit(1) // TODO temp, cli only
  }
}
