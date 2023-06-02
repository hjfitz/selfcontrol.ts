import { program } from 'commander'
import { startBlocking, stopBlocking } from './blocker'
import { add, list, deleteSite } from './store'
import { getVersion } from './util'

async function main() {
  const version = await getVersion()
  const opts = program
    .version(version)
    .option('-l, --list', 'list blocked sites')
    .option('-a, --add <site>', 'add site to blocked list')
    .option('-d, --delete <site>', 'delete site from blocked list')
    .option('-s, --start', 'start blocking sites')
    .option('-x, --stop', 'stop blocking sites')
    .parse(process.argv)
    .opts()

  if (opts.start) {
    await startBlocking()
  } else if (opts.stop) {
    await stopBlocking()
  } else if (opts.list) {
    list()
  } else if (opts.add) {
    await add(opts.add)
  } else if (opts.delete) {
    await deleteSite(opts.delete)
  } else {
    program.help()
  }
}

void main()
