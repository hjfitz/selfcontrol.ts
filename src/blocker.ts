import path from 'path'
import os from 'os'
import fs from 'fs/promises'
import { getConfig } from './store'
import { getPassword, run } from './shell'
import { green, underline, yellow } from './colors'
import { noop } from './util'

export const HEAD = '## siteblocker start'
export const TAIL = '## siteblocker end'

export async function isBlocking() {
  const hosts = await fs.readFile('/etc/hosts', 'utf-8')
  return hosts.includes(HEAD)
}

const BROWSER_CACHE_DIRS = [
  '/Library/Caches/Firefox/Profiles',
  '/Library/Caches/Google/Chrome/Default/Cache/Cache_Data',
].map((dir) => path.join(os.homedir(), dir))

export async function startBlocking() {
  const config = getConfig()

  if (await isBlocking()) {
    console.log(yellow('Already blocking'))
    return
  }

  const hosts = config.sites.map((site) => `0.0.0.0 ${site}\n:: ${site}`)
  const block = [HEAD, ...hosts, TAIL].join('\n').trim()

  const pass = await getPassword()
  const shCommand = `echo '${pass}' | sudo -S -- sh -c "echo '${block}' >> /etc/hosts"`

  await run(shCommand)
  await run('dscacheutil -flushcache')
  await run('killall -HUP mDNSResponder').catch(noop)
  await Promise.all(BROWSER_CACHE_DIRS.map((dir) => fs.rm(dir, { recursive: true }).catch(noop)))
  console.log(green(underline('Blocking started')))
  console.log(green('Blocked sites:'))
  config.sites.forEach((site) => console.log(`> ${site}`))
}

export async function stopBlocking() {
  const pass = await getPassword()
  const hosts = await fs.readFile('/etc/hosts', 'utf-8')

  const block = hosts.replace(new RegExp(`${HEAD}.*${TAIL}`, 's'), '').trim()
  const shCommand = `echo '${pass}' | sudo -S -- sh -c "echo '${block}' > /etc/hosts"`

  await run(shCommand)

  const config = getConfig()
  console.log(green(underline('Blocking stopped')))
  console.log(green('Sites now accessible:'))
  config.sites.forEach((site) => console.log(`> ${site}`))
}
