
export interface IExpressConfig {
    port: number;
    version: string;
}

export interface IMensaConfig {
    baseUrl: string;
}

export interface IConfig {
    express: IExpressConfig;
    mensa: IMensaConfig;
}