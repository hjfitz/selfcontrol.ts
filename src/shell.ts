import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import readline from 'readline/promises'
import { Writable } from 'stream'

export async function getPassword(): Promise<string> {
  const mutableStdout = new Writable({
    write: function (chunk, _, callback) {
      const chunkStr = chunk.toString()
      if (chunkStr.trim() && chunkStr.length === 1) {
        process.stdout.write('*')
      }
      callback()
    },
  })

  const input = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true,
  })

  process.stdout.write('Enter your password to continue: ')
  const pass = await input.question('')
  input.close()
  return pass
}

export async function deleteChildrenFiles(parentDir: string) {
  const files = await fs.readdir(parentDir)
  for (const file of files) {
    await fs.unlink(path.join(parentDir, file))
  }
}

export function run(command: string) {
  return new Promise((res, rej) => {
    exec(command, (err, stdout) => {
      if (err) {
        return rej()
      }
      res(stdout)
    })
  })
}
