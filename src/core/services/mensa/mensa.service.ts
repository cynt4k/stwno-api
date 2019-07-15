import { IMensaConfig, IMeal } from '@home/interfaces';


export namespace MensaService {
    let config: IMensaConfig;

    export const init = (c: IMensaConfig): void => {
        config = c;
    };
}
