import * as JSData from 'js-data'
const DSRethinkDBAdapter = require('js-data-rethinkdb')
/**
 * Defining adapter
 */
interface IRethinkConfig {
  host: string,
  port: number,
  db: string
}

interface IDefaultAdapterOptions {
  default: boolean
}

export let adapterOptions: IDefaultAdapterOptions = { default: true }
export let database: string = 'rethinkdb'
export let rethinkConfig: IRethinkConfig = {
  host:   process.env.SERVER_RETHINKDB_HOST || 'localhost',
  port: process.env.SERVER_RETHINKDB_PORT || 28015,
  db: process.env.SERVER_RETHINKDB_DB || 'appserver'
}

/**
 * Create an instance of RethinkDBAdapter
 */
export const adapter: JSData.IDSAdapter = new DSRethinkDBAdapter(rethinkConfig)
