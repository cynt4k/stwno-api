import 'module-alias/register';
import config from 'config';
import { ExpressService } from '@home/core/services';
import { IExpressConfig } from '@home/interfaces';
import { Logger } from '@home/core/utils';

Logger.init();

(async () => {
    const expressConfig: IExpressConfig = config.get<IExpressConfig>('express');

    try {
        const info = await ExpressService.init(expressConfig);
        Logger.info(`HTTP Server spawned under - http://${info.server}:${info.port}`);
    } catch (e) {
        Logger.error(e);
        process.exit(1);
    }
})();
