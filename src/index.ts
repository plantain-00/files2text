import minimist from 'minimist'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as packageJson from '../package.json'

let suppressError = false

function showToolVersion() {
  console.log(`Version: ${packageJson.version}`)
}

function showHelp() {
  console.log(`Version ${packageJson.version}
Syntax:   files2text [options] [file...]
Examples: files2text . -e node_modules -e .git
Options:
 -h, --help                                         Print this message.
 -v, --version                                      Print the version
 -e, --exclude                                      Directories, eg: "node_modules,.git", repeatable
`)
}

async function executeCommandLine() {
  const argv = minimist(process.argv.slice(2), { '--': true }) as unknown as {
    v?: unknown
    version?: unknown
    h?: unknown
    help?: unknown
    suppressError: boolean
    e: string | string[]
    exclude: string | string[]
    _: string[]
  }

  const showVersion = argv.v || argv.version
  if (showVersion) {
    showToolVersion()
    return
  }

  if (argv.h || argv.help) {
    showHelp()
    process.exit(0)
  }

  suppressError = argv.suppressError

  const exclude: string | string[] = argv.e || argv.exclude
  const excludedDirectories: string[] = []
  if (Array.isArray(exclude)) {
    for (const e of exclude) {
      excludedDirectories.push(e)
    }
  } else if (exclude) {
    excludedDirectories.push(exclude)
  }

  interface Node {
    name: string
    isDirectory?: boolean
    children?: Node[]
  }

  const statAsync = util.promisify(fs.stat)
  const readdirAsync = util.promisify(fs.readdir)
  async function readAsync(node: Node): Promise<boolean> {
    const directoryName = path.basename(node.name)
    if (excludedDirectories.some(d => directoryName === d)) {
      return false
    }
    const stats = await statAsync(node.name)
    if (stats.isFile()) {
      node.isDirectory = false
      return true
    } else if (stats.isDirectory()) {
      node.isDirectory = true
      node.children = []
      const files = await readdirAsync(node.name)
      for (const file of files) {
        const child: Node = {
          name: path.resolve(node.name, file)
        }
        const isValid = await readAsync(child)
        if (isValid) {
          node.children.push(child)
        }
      }
      return true
    }
    return false
  }

  const result: Node[] = []
  for (const file of argv._) {
    const basename = path.basename(file)
    if (excludedDirectories.every(d => basename !== d)) {
      const node: Node = {
        name: file
      }
      const isValid = await readAsync(node)
      if (isValid) {
        result.push(node)
      }
    }
  }

  function print(node: Node, depth: number, isEnd: boolean) {
    const head = depth === 0 ? '' : '│  '.repeat(depth - 1) + (isEnd ? '└─ ' : '├─ ')
    console.log(head + path.basename(node.name))
    if (node.children) {
      const children = node.children
      children.forEach((c, i) => {
        print(c, depth + 1, i === children.length - 1)
      })
    }
  }

  result.forEach((r, i) => {
    print(r, 0, i === result.length - 1)
  })
}

executeCommandLine().then(() => {
  console.log('files2text success.')
}, (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message)
  } else {
    console.log(error)
  }
  if (!suppressError) {
    process.exit(1)
  }
})
