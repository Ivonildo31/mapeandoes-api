import { ISource } from '@prodest/mapeandoes-typings'
import { lib } from '../services/lib'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import {Config, Services, Models, Interfaces} from 'js-data-dao'

/**
 * Model para os usuários
 *
 * @class User
 * @implements {Model.DAO<Model.User>}
 */

export class Source extends Models.BaseModel implements ISource {
    name: string
    constructor(obj: ISource) {
        super(obj.id)
        this.name = obj.name
    }
}

export class UserDAO extends Models.DAO<ISource> {
    storedb: JSData.DS
    serviceLib: Services.ServiceLib
    sendMail: Services.SendMail
    constructor(store: JSData.DS,appConfig: Config.AppConfig) {
        const users = store.defineResource<ISource>({
            name: 'sources'
            // relations: {
            //     belongsTo: {
            //         clients: {
            //             localField: 'client',
            //             localKey: 'clientId'
            //         }
            //     }
            // }
        })
        super(users, ['clients'])
        this.storedb = store
        this.serviceLib = new Services.ServiceLib(appConfig)
        this.sendMail = new Services.SendMail(appConfig.mailConfig)
    }

    /**
     * Cria um novo usuário
     * 
     * @param {User} obj
     * @param {*} userP
     * @returns {JSData.JSDataPromise<ISource>}
     * 
     * @memberOf UserDAO
     */
    public create(obj: ISource, userP: any): JSData.JSDataPromise<ISource> {
        let source: Source = new Source(obj)
        let objFilterName = { where: { email: { '===': source.name } } }
        return this.collection.findAll(objFilterName)
            .then((sources: Array<ISource>) => {
                if (!_.isEmpty(sources)) {
                    throw 'Exists other with same name'
                } else {
                    return this.collection.create(source)
                }
            })
            .then(() => obj)
    }

    /**
     * Atualiza os dados básicos do usuário
     * Como dados pessoais, email e senha.
     * 
     * @param {string} id
     * @param {ISource} obj
     * @param {*} user
     * @returns {JSData.JSDataPromise<ISource>}
     * 
     * @memberOf UserDAO
     */
    public update(id: string, obj: ISource, user: any): JSData.JSDataPromise<ISource> {
        let exclude = [
            'id', 'userId', 'active', 'isAdmin', 'updatedAt', 'createdAt', 'dataInclusao'
        ]
        let userFieldsUp = ['name']

        let newObj: ISource = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

        return this.collection.find(id)
            .then((source: ISource) => {
                if (_.isEmpty(source)) { throw 'Usuário não encontrado.' }
                return Bluebird.all([source, newObj])
            })
            .then((resp: any) => {
                let source: ISource = resp[0]
                let newObj: ISource = resp[1]
                let passwordCompared: boolean = resp[2]

                if (passwordCompared) {
                    return Bluebird.all([source, newObj])
                } else if (typeof passwordCompared === 'undefined') {
                    return Bluebird.all([source, newObj])
                } else {
                    throw 'A senha atual está incorreta'
                }
            })
            .then((resp: any) => {
                let user: ISource = resp[0]
                let newObj: ISource = resp[1]
                _.merge(user, newObj)
                if (!Services.ServiceLib.validateFields(user, Object.keys(user), exclude)) {
                    throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
                }
                return this.sendUpdate(id, user)
            })
    }

    /**
     * Deleta um usuário
     * 
     * @param {string} id
     * @returns {JSData.JSDataPromise<boolean>}
     * 
     * @memberOf UserDAO
     */
    public delete(id: string, user: any): JSData.JSDataPromise<boolean> {
        return this.collection.find(id)
            .then((user: ISource) => {
                if (_.isEmpty(user)) {
                    throw 'Usuário não encontrado'
                }
                let newObj: ISource = user
                newObj.active = false
                return this.collection.update(id, newObj).then(() => true)
            })
    }

    /**
     * Atualiza dados de usuário
     * 
     * @param {string} id
     * @param {ISource} obj
     * @returns {JSData.JSDataPromise<ISource>}
     * 
     * @memberOf UserDAO
     */
    public sendUpdate(id: string, obj: ISource): JSData.JSDataPromise<ISource> {
        return this.collection.update(id, obj)
    }

    /**
     * realize search query using limits and page control
     * 
     * @param {Object} search
     * @param {*} user
     * @param {number} [page]
     * @param {number} [limit]
     * @param {string[]} [order]
     * @returns {JSData.JSDataPromise<IResultSearch<ISource>>}
     * 
     * @memberOf UserDAO
     */
    paginatedQuery(
        search: Object, user: any, page?: number, limit?: number, order?: string[]
    ): JSData.JSDataPromise<Interfaces.IResultSearch<ISource>> {
        let _page: number = page || 1
        let _limit: number = limit || 10
        let _order: string[] = []
        let params = Object.assign({}, search, {
            orderBy: _order,
            offset: _limit * (_page - 1),
            limit: _limit
        })

        return Bluebird.all([
            this.collection.findAll(search),
            this.collection.findAll(params)
        ])
            .then((resp: any) => {
                return {
                    page: _page,
                    total: resp[0].length,
                    result: resp[1]
                } as Interfaces.IResultSearch<ISource>
            })
    }
}
