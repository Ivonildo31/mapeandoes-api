import { UserRouter } from './user-router'
import { Passport } from 'passport'
import * as express from 'express'
import * as JSData from 'js-data'
import {Auth, Routes, Config} from 'js-data-dao'

export namespace main {
    export const callRoutes = (app: express.Application, store: JSData.DS, passport: Passport , appConfig: Config.AppConfig ): express.Application => {
        app.use('/api/v1/users', Auth.authenticate(passport,appConfig), new UserRouter(store,appConfig).getRouter())
        app.use('/api/v1/signup', new Routes.SignupRouter(store, appConfig).getRouter())
        app.use('/api/v1/forgot', new Routes.ForgotRouter(store, appConfig).getRouter())
        app.use('/api/v1/login', new Routes.LoginRouter(store,appConfig).getRouter())
        app.use('/api/v1/ping', (req,res,nex) => res.json('pong'))
        /**
         * rota para obter dados do usuário logado
         */
        app.use('/api/v1/me', Auth.authenticate(passport,appConfig), (req, res, next) => {
            let user = req.user
            delete user['password']
            return res.json(user)
        })
        return app
    }
}
