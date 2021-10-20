import semver from 'semver'
import downloadNodeVersionsFile from './downloadNodeVersionsFile.js'

const { inc, major, maxSatisfying } = semver

export interface LatestVersions {
  label: string
  value: string
}

export default async function getLatestVersions(): Promise<LatestVersions[]> {
  const list = await downloadNodeVersionsFile()

  const majorVersions = new Set(list.map(({ version }) => major(version)))

  const sorted = Array.from(majorVersions).sort((v1, v2) => v2 - v1)

  return sorted.map((majorVersion) => {
    const maxVersion = maxSatisfying(
      list.map(({ version }) => version),
      `>=${majorVersion}.0.0 <${inc(`${majorVersion}.0.0`, 'major')}`,
    )

    const findVersion = list.find(({ version }) => version === maxVersion)

    if (findVersion == null) {
      throw new Error('Could not find satisfying version.')
    }

    const { lts, version } = findVersion

    return {
      label: `${maxVersion}${lts !== false ? `  LTS (${lts})` : ''}`,
      value: version,
    }
  })
}
