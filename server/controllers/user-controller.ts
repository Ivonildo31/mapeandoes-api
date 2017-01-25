import {Controllers} from 'js-data-dao/lib/'
import { UserDAO } from '../models/user'
import { IUser } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import {Config} from 'js-data-dao'

export class UserController extends Controllers.BasePersistController<IUser> {
    public constructor(store: JSData.DS, appConfig: Config.AppConfig) {
        super(new UserDAO(store,appConfig))
    }
}
