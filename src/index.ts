import 'module-alias/register';
import config from 'config';
import { ExpressService, DatabaseService, MensaService } from '@home/core/services';
import { IExpressConfig, IMensaConfig } from '@home/interfaces';
import { Logger } from '@home/core/utils';

Logger.init();

(async () => {
    const expressConfig: IExpressConfig = config.get<IExpressConfig>('express');
    const mensaConfig: IMensaConfig = config.get<IMensaConfig>('mensa');

    try {
        await DatabaseService.init();
        Logger.info(`Database initialized`);
    } catch (e) {
        Logger.error(e);
        process.exit(1);
    }

    try {
        await MensaService.init(mensaConfig);
        Logger.info(`Mensa Service initialized`);
    } catch (e) {
        Logger.error(e);
        process.exit(1);
    }

    try {
        const info = await ExpressService.init(expressConfig);
        Logger.info(`HTTP Server spawned under - http://${info.server}:${info.port}`);
    } catch (e) {
        Logger.error(e);
        process.exit(1);
    }
})();
