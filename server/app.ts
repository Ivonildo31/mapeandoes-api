
/**
 * busca as variaveis de ambiente no arquivo .env
 */
import * as dotenv from 'dotenv'
dotenv.config()
import * as JSData from 'js-data'
import { Config, Application } from 'js-data-dao'

/**
 * importacao das rotas
 */
import * as routes from './routes'

class MainApp extends Application {
    constructor() {
        let cfg: Config.AppConfig = new Config.AppConfig()
        super(cfg, routes.main.callRoutes)

        const store: JSData.DS = new JSData.DS()
        store.registerAdapter(this.appConfig.dbConfig.getDatabase(),
                              this.appConfig.dbConfig.getAdapter(),
                              this.appConfig.dbConfig.getAdapterOptions()
                             )
        this.store = store
    }
}

/**
 * para enviar a aplicacao a nivel do server será sempre levado o objeto app criado ao instanciar a aplicacao
 */
export let application = (new MainApp()).app
