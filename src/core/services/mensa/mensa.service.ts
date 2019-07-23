import http from 'http';
import _ from 'lodash';
import { IMensaConfig, IMeal, IDbMensa, IConstLocation, ICrawlerMenu, IMealIngredients, ITranslation } from '@home/interfaces';
const LOCATIONS = require('../../../../config/consts/locations.json');
import { MensaError, ErrorCode } from '@home/error';
import { Crawler } from '@home/core/utils';
import { DatabaseService } from '../database';


export namespace MensaService {
    let config: IMensaConfig;
    let crawler: Crawler;

    export const init = async (c: IMensaConfig): Promise<void> => {
        config = c;
        crawler = new Crawler(config.baseUrl, config.attributeOrder);
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
            const menus = await getDataForLocation(elem);
            await DatabaseService.setLocation({
                id: elem,
                name: LOCATIONS[elem].translations as ITranslation,
                meals: []
            });
            const menusForDatabase = _.map(menus, (menu): IMeal => {
                return {
                    date: menu.date,
                    ingredients: _.map(menu.ingredients, (ingredient): IMealIngredients => ({key: ingredient.key, name: ingredient.value})),
                    name: menu.name,
                    price: menu.price,
                    type: menu.lunchType
                };
            });
            await DatabaseService.updateMealsForLocation(elem, menusForDatabase);
        });
        return Promise.resolve();
    };

    const getDataForLocation = async (locationId: string): Promise<ICrawlerMenu[]> => {
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
