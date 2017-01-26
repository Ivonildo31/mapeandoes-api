import * as JSData from 'js-data'
import { DemandController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { IDemand } from '@prodest/mapeandoes-typings'
export class DemandRouter extends Routes.PersistRouter<IDemand, DemandController> {
  constructor(store: JSData.DS, appConfig: Config.AppConfig) {
    let ctrl = new DemandController(store, appConfig)
    super(store, ctrl)
  }
}
