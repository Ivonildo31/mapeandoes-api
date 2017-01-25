import * as JSData from 'js-data'
import { UserController } from '../controllers'
import { Router } from 'express'
import {Routes, Config} from 'js-data-dao'
import {IUser} from '@prodest/mapeandoes-typings'
export class UserRouter extends Routes.PersistRouter<IUser, UserController> {
    controller: UserController
    router: Router

    constructor (store: JSData.DS, appConfig: Config.AppConfig) {
        let ctrl = new UserController(store, appConfig)
        super(store, ctrl)
    }
}
