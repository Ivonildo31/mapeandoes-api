import { UserRouter } from './user-router'
import { SourceRouter } from './source-router'
import { DistrictRouter } from './district-router'
import { ThemeRouter } from './theme-router'
import { DemandRouter } from './demand-router'
import { CategoryRouter } from './category-router'
import { Passport } from 'passport'
import * as express from 'express'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'
export namespace main {
  export const callRoutes = (app: express.Application, store: JSData.DataStore, passport: Passport, appConfig: Config.AppConfig): express.Application => {
    app.use('/api/v1/users', new UserRouter(store, appConfig).getRouter())
    app.use('/api/v1/sources', new SourceRouter(store, appConfig).getRouter())
    app.use('/api/v1/districts', new DistrictRouter(store, appConfig).getRouter())
    app.use('/api/v1/themes', new ThemeRouter(store, appConfig).getRouter())
    app.use('/api/v1/demands', new DemandRouter(store, appConfig).getRouter())
    app.use('/api/v1/categories', new CategoryRouter(store, appConfig).getRouter())
    // app.use('/api/v1/signup', new Routes.SignupRouter(store, appConfig).getRouter())
    // app.use('/api/v1/forgot', new Routes.ForgotRouter(store, appConfig).getRouter())
    // app.use('/api/v1/login', new Routes.LoginRouter(store,appConfig).getRouter())
    app.use('/api/v1/ping', (req, res, nex) => res.json('pong'))
    /**
     * rota para obter dados do usuário logado
     */
    // app.use('/api/v1/me', (req, res, next) => {
    //     let user = req.user
    //     delete user['password']
    //     return res.json(user)
    // })
    return app
  }
}
