import { IDistrict , IUser } from '@prodest/mapeandoes-typings'
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
export class District extends Models.BaseModel implements IDistrict {
    name: string
    location: {
        lat: number,
        lon: number
    }
    constructor(obj: IDistrict) {
        super(obj.id)
        this.name = obj.name
        this.location.lat = obj.location.lat
        this.location.lon = obj.location.lon
    }
}

/**
 * classe de persistencia da fonte de informação
 * 
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class DistrictDAO extends Models.DAO<IDistrict> {
    storedb: JSData.DS
    serviceLib: Services.ServiceLib
    sendMail: Services.SendMail
    constructor(store: JSData.DS, appConfig: Config.AppConfig) {
        const districts = store.defineResource<IDistrict>({
            name: 'categories'
        })
        super(districts)
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
    public create(obj: IDistrict, userP: any): JSData.JSDataPromise<IDistrict> {
        let districts: District = new District(obj)
        let objFilterName = { where: { email: { '===': districts.name } } }
        return this.collection.findAll(objFilterName)
            .then((districts: Array<IDistrict>) => {
                if (!_.isEmpty(districts)) {
                    throw 'Exists other with same name'
                } else {
                    return this.collection.create(districts)
                }
            })
            .then(() => obj)
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
    public update(id: string, user: IUser, obj: IDistrict): JSData.JSDataPromise<IDistrict> {
        let exclude = [
            'id', 'active', 'updatedAt', 'createdAt'
        ]
        let userFieldsUp = ['name']

        let newObj: IDistrict = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

        return this.collection.find(id)
            .then((category: IDistrict) => {
                if (_.isEmpty(category)) { throw 'District not found.' }
                return Bluebird.all([category, newObj])
            })
            .then((resp: any) => {
                let districts: IDistrict = resp[0]
                let newObj: IDistrict = resp[1]
                return Bluebird.all([districts, newObj])
            })
            .then((resp: any) => {
                let district: IDistrict = resp[0]
                let newObj: IDistrict = resp[1]
                _.merge(district, newObj)
                if (!Services.ServiceLib.validateFields(district, Object.keys(district), exclude)) {
                    throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
                }
                return this.sendUpdate(id, district)
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
    public delete(id: string, user: any): JSData.JSDataPromise<boolean> {
        return this.collection.find(id)
            .then((district: IDistrict) => {
                if (_.isEmpty(district)) {
                    throw 'Fonte não encontrada'
                }
                let newObj: IDistrict = district
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
    public sendUpdate(id: string, obj: IDistrict): JSData.JSDataPromise<IDistrict> {
        return this.collection.update(id, obj)
    }

}
