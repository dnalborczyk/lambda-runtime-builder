import fetch from 'node-fetch'

interface NodeBuildInfo {
  date: string
  files: string[]
  lts: boolean
  modules: string
  npm: string
  openssl: string
  security: boolean
  uv: string
  v8: string
  version: string
  zlib: string
}

const NODE_DIST_URL = 'https://nodejs.org/dist/index.json'

export default async function downloadNodeVersionsFile(): Promise<
  NodeBuildInfo[]
> {
  const response = await fetch(NODE_DIST_URL)

  return response.json() as unknown as NodeBuildInfo[]
}
