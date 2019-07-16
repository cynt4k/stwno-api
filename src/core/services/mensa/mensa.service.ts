import http from 'http';
import _ from 'lodash';
import { IMensaConfig, IMeal, IDbMensa, IConstLocation } from '@home/interfaces';
const LOCATIONS = require('../../../../config/consts/locations.json');
import { MensaError, ErrorCode } from '@home/error';
import { Crawler } from '@home/core/utils';


export namespace MensaService {
    let config: IMensaConfig;
    let crawler: Crawler;

    export const init = async (c: IMensaConfig): Promise<void> => {
        config = c;
        crawler = new Crawler(config.baseUrl);
        await getData();
        return Promise.resolve();
    };

    const checkLocationId = (locationId: string): void => {
        if (!LOCATIONS[locationId]) {
            throw new MensaError('Location not found', ErrorCode.LOCATION_NOT_FOUND);
        }
        return;
    };

    const getData = async (): Promise<void> => {
        _.keys(LOCATIONS).forEach(async (elem) => {
            await getDataForLocation(elem);
        });
    };

    const getDataForLocation = async (locationId: string): Promise<any[]> => {
        const data: IDbMensa[] = [];

        checkLocationId(locationId);

        const location = <IConstLocation> LOCATIONS[locationId];

        const menu = await crawler.getMenu(location.shortTag, getCurrentWeek());

        return Promise.resolve(menu);
    };

    const getCurrentWeek = (): number => {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
}
