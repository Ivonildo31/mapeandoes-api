import { Controllers } from 'js-data-dao/lib/'
import { DemandDAO } from '../models/demand'
import { IDemand } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class DemandController extends Controllers.BasePersistController<IDemand> {
  public constructor(store: JSData.DS, appConfig: Config.AppConfig) {
    super(new DemandDAO(store, appConfig))
  }
}
