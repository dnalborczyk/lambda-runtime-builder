import { pathExists } from 'fs-extra'

export default async function checkFile(path: string): Promise<boolean> {
  try {
    return await pathExists(path)
  } catch (err) {
    console.error(`ERROR: ${err.message}`)
    throw new Error('Unable to check if the file exists.')
  }
}
