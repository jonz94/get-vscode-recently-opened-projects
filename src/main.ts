import { readFile } from 'fs/promises'
import { homedir, platform } from 'os'
import { exit } from 'process'
import initSqlJs from 'sql.js'

type QueryResult = {
  values: string[]
}[]

function getDatabasePath() {
  switch (platform()) {
    case 'linux':
      return `${homedir()}/.config/Code/User/globalStorage/state.vscdb`

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
    queryResult.length ? JSON.parse(queryResult[0].values[0]).entries : [],
  )
}

main()
