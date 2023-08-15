import path from 'path'
import fs from 'fs/promises'
import os from 'os'
import { blue, bold, green, red, underline, yellow } from './colors'

export const configLocation = path.join(os.homedir(), '.config', 'siteblocker.json')

export interface Config {
  sites: string[]
}

export function getConfig(): Config {
  try {
    return require(configLocation)
  } catch (e) {
    return {
      sites: [],
    }
  }
}

export function generateSiteAlternatives(site: string) {
  let domain = site
  if (site.startsWith('http')) {
    const url = new URL(site)
    domain = url.hostname
  }
  return [domain, `www.${domain}`]
}

export async function add(site: string) {
  const config = getConfig()
  const alts = generateSiteAlternatives(site)
  if (!config.sites.includes(alts[0])) {
    config.sites.push(...alts)
    await writeConfig(config)
  }
  console.log(green(`added ${bold(site)}`))
}

export function list() {
  const config = getConfig()
  if (config.sites.length) {
    console.log(blue(underline('Blocked sites:\n')))
    config.sites.forEach((site) => console.log(`> ${site}`))
  } else {
    console.log(yellow('No sites blocked'))
  }
}

export async function deleteSite(site: string) {
  const config = getConfig()
  const [domain] = generateSiteAlternatives(site)
  console.log(domain)
  config.sites = config.sites.filter((s) => !s.includes(domain))
  await writeConfig(config)
  console.log(green(`Deleted ${bold(site)}`))
}

export async function clearList() {
  const config = getConfig()
  config.sites = []
  await writeConfig(config)
  console.log(green('Cleared blocked sites'))
}

export async function writeConfig(config: Config) {
  try {
    await fs.writeFile(configLocation, JSON.stringify(config, null, 2))
  } catch (e) {
    console.error(red('Error writing config file'))
    if (e instanceof Error) {
      console.error(red(e.message))
    } else {
      console.error(red(e as string))
    }
  }
}
