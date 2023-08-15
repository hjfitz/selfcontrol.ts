# 👽 selfcontrol.ts

A small CLI util to block and unblock websites, to help you get on with and focus on work.

## Pre-requisites

- Node.js 20

## Installation

1. Clone the repo
1. Install the dependencies `npm i`
1. Link the binary `npm link`
1. Check that this has been installed with `which selfcontrol`

## Usage

[![asciicast](https://asciinema.org/a/OObGQBobQrS8SwpmIAqAC9T6g.svg)](https://asciinema.org/a/OObGQBobQrS8SwpmIAqAC9T6g)

```
Usage: selfcontrol [options]

Options:
  -V, --version        output the version number
  -l, --list           list blocked sites
  -a, --add <site>     add site to blocked list
  -d, --delete <site>  delete site from blocked list
  -s, --start          start blocking sites
  -x, --stop           stop blocking sites
  -c, --clear          clear blocked sites
  -h, --help           display help for command
```
