import { IDemand, ICategory, IDistrict, ITheme, ISource, IUser, IPin } from '@prodest/mapeandoes-typings'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import { Config, Services, Models } from 'js-data-dao'

/**
 * classe da fonte de informação
 *
 * @export
 * @class Source
 * @extends {Models.BaseModel}
 * @implements {ISource}
 */
export class Demand extends Models.BaseModel implements IDemand {
  title: string
  description: string
  externalUserId: string
  categoryId: string
  category: ICategory
  userId: string
  user: IUser
  districts: IDistrict[]
  themes: ITheme[]
  source: ISource
  sourceId: string
  pins: IPin[]

  constructor(obj: IDemand) {
    super(obj.id)
    this.title = obj.title
    this.description = obj.description
    this.externalUserId = obj.externalUserId
    this.categoryId = obj.categoryId
    this.districts = obj.districts
    this.themes = obj.themes
    this.sourceId = obj.sourceId
    this.pins = obj.pins
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class DemandDAO extends Models.DAO<IDemand> {
  storedb: JSData.DS
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DS, appConfig: Config.AppConfig) {
    const demands = store.defineResource<IDemand>({
      name: 'demands',
      relations: {
        belongsTo: {
          users: {
            localField: 'user',
            localKey: 'userId'
          },
          categories: {
            localField: 'category',
            localKey: 'categoryId'
          },
          sources: {
            localField: 'source',
            localKey: 'sourceId'
          }
        }
      }
    })
    super(demands, ['users', 'categories', 'sources'])
    this.storedb = store
  }

  /**
   * Cria uma nova fonte de informação
   *
   * @param {User} obj
   * @param {*} userP
   * @returns {JSData.JSDataPromise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public create(obj: IDemand, userP: any): JSData.JSDataPromise<IDemand> {
    let demand: Demand = new Demand(obj)
    return this.collection.create(demand)
  }

  /**
   * Atualiza uma fonte de informação
   *
   *
   * @param {string} id
   * @param {ICategory} obj
   * @param {*} user
   * @returns {JSData.JSDataPromise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public update(id: string, user: IUser, obj: IDemand): JSData.JSDataPromise<IDemand> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt', 'user', 'source', 'category'
    ]

    let userFieldsUp = ['title', 'description', 'externalUserId', 'demandId', 'categoryId', 'districts', 'themes', 'sourceId', 'pins']

    let newObj: IDemand = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((category: IDemand) => {
        if (_.isEmpty(category)) { throw 'Demand not found.' }
        return Bluebird.all([category, newObj])
      })
      .then((resp: any) => {
        let demands: IDemand = resp[0]
        let newObj: IDemand = resp[1]
        return Bluebird.all([demands, newObj])
      })
      .then((resp: any) => {
        let demand: IDemand = resp[0]
        let newObj: IDemand = resp[1]
        _.merge(demand, newObj)
        if (!Services.ServiceLib.validateFields(demand, Object.keys(demand), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, demand)
      })
  }

  /**
   * Deleta uma fonte de informação
   *
   * @param {string} id
   * @returns {JSData.JSDataPromise<boolean>}
   *
   * @memberOf SourceDAO
   */
  public delete(id: string, user: IUser): JSData.JSDataPromise<boolean> {
    return this.collection.find(id)
      .then((demand: IDemand) => {
        if (_.isEmpty(demand)) {
          throw 'Fonte não encontrada'
        }
        let newObj: IDemand = demand
        newObj.active = false
        return this.collection.update(id, newObj).then(() => true)
      })
  }

  /**
   * Atualiza dados da fonte de informação
   *
   * @param {string} id
   * @param {ICategory} obj
   * @returns {JSData.JSDataPromise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public sendUpdate(id: string, obj: IDemand): JSData.JSDataPromise<IDemand> {
    return this.collection.update(id, obj)
  }

}
