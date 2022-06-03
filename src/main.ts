import { spawnSync } from 'child_process'
import { readFile } from 'fs/promises'
import { readFileSync } from 'fs'
import { homedir, platform, release } from 'os'
import { exit } from 'process'
import initSqlJs from 'sql.js'

type QueryResult = {
  values: string[]
}[]

/**
 * credit: https://github.com/sindresorhus/is-wsl/blob/8b20f129277e996027ab5714cb246d2f8f889ebb/index.js
 */
function isWsl() {
  if (process.platform !== 'linux') {
    return false
  }

  if (release().toLowerCase().includes('microsoft')) {
    return true
  }

  try {
    return readFileSync('/proc/version', 'utf8')
      .toLowerCase()
      .includes('microsoft')
  } catch {
    return false
  }
}

function getWindowsAppDataDirViaPowershell() {
  const { stdout } = spawnSync('powershell.exe', [
    '-NoProfile',
    '-NoLogo',
    '-Command',
    'echo $Env:APPDATA',
  ])

  const appDataDir = stdout
    .toString()
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .replace(/\\/g, '/')
    .replace(/^C:/, '/mnt/c')

  return appDataDir
}

function getDatabasePath() {
  if (isWsl()) {
    const appDataDir = getWindowsAppDataDirViaPowershell()

    return `${appDataDir}/Code/User/globalStorage/state.vscdb`
  }

  switch (platform()) {
    case 'linux':
      return `${homedir()}/.config/Code/User/globalStorage/state.vscdb`

    case 'darwin':
      return `${homedir()}/Library/Application Support/Code/User/globalStorage/state.vscdb`

    case 'win32':
      return `${homedir()}/AppData/Roaming/Code/User/globalStorage/state.vscdb`

    default:
      console.error(`Error: unsupported platform "${platform()}"`)
      exit(1)
  }
}

async function queryData(databasePath: string) {
  const fileBuffer = await readFile(databasePath)
  const SQL = await initSqlJs()
  const db = new SQL.Database(fileBuffer)
  const queryResult = db.exec(
    "SELECT value FROM ItemTable WHERE key = 'history.recentlyOpenedPathsList'",
  ) as unknown as QueryResult
  db.close()

  return queryResult
}

async function main() {
  const databasePath = getDatabasePath()

  const queryResult = await queryData(databasePath)

  console.log(
    queryResult.length
      ? JSON.stringify(JSON.parse(queryResult[0].values[0]).entries, null, 2)
      : [],
  )
}

main()
