import path from 'path'
import fs from 'fs/promises'

export async function getVersion() {
  const pkgLocation = path.join(__dirname, '../package.json')
  const packageJson = await fs.readFile(pkgLocation, 'utf-8')
  const parsedPackageJson = JSON.parse(packageJson)
  return parsedPackageJson.version
}

export const noop = () => {
  // do nothing
}
