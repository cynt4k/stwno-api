import _ from 'lodash';
import { IMensaConfig, IMeal, IDbMensa, IConstLocation, ICrawlerMenu, IMealIngredients, ITranslation, IMensa } from '@home/interfaces';
const LOCATIONS = require('../../../../config/consts/locations.json');
import { MensaError, ErrorCode } from '@home/error';
import { Crawler, Logger } from '@home/core/utils';
import { DatabaseService } from '../database';


export namespace MensaService {
    let config: IMensaConfig;
    let crawler: Crawler;
    let lastUpdate: Date;

    export const init = async (c: IMensaConfig): Promise<void> => {
        config = c;
        crawler = new Crawler(config.baseUrl, config.attributeOrder);
        await getData();
        return Promise.resolve();
    };

    export const getMensas = async(): Promise<IMensa[]> => {
        try {
            await checkRefresh();
            const mensas = await DatabaseService.getLocations();
            return Promise.resolve(mensas);
        } catch (e) {
            return Promise.reject(e);
        }
    };

    export const getMealsForLocation = async(locationId: string): Promise<IMeal[] | void> => {
        try {
            await checkRefresh();
            const meals = await DatabaseService.getMealsForLocation(locationId);
            return Promise.resolve(meals);
        } catch (e) {
            if (e instanceof MensaError) {
                if (e.getCode() === ErrorCode.LOCATION_NOT_FOUND) {
                    return Promise.resolve();
                }
            } else {
                return Promise.reject(e);
            }
        }
    };

    export const getMealsForLocationAndDay = async(locationId: string, day: string): Promise<IMeal[]> => {
        try {
            await checkRefresh();
            const meals = await DatabaseService.getMealsForLocationAndDay(locationId, parseDay(day));
            return Promise.resolve(meals);
        } catch (e) {
            return Promise.reject(e);
        }
    };

    const checkRefresh = async (): Promise<void> => {
        if (lastUpdate.getTime() + config.refreshTime < Date.now()) {
            await getData();
        }
        return Promise.resolve();
    };

    const parseDay = (day: string): Date => {
        const curr = new Date();
        curr.setHours(0, 0, 0, 0);
        const sunday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
        let increment = 0;
        switch (day) {
            case 'mo': increment = 1; break;
            case 'tu': increment = 2; break;
            case 'we': increment = 3; break;
            case 'th': increment = 4; break;
            case 'fr': increment = 5; break;
            case 'sa': increment = 6; break;
            case 'su': increment = 0; break;
            default: throw new MensaError(`invalid day - ${day}`, ErrorCode.INVALID_DAY);
        }
        sunday.setDate(sunday.getDate() + increment);
        return sunday;
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
            try {
                await DatabaseService.setLocation({
                    id: elem,
                    name: LOCATIONS[elem].translations as ITranslation,
                    meals: []
                });
            } catch (e) {
                if (e instanceof MensaError) {
                    if (e.getCode() !== ErrorCode.LOCATION_FOUND) {
                        return Promise.reject(e);
                    }
                } else {
                    return Promise.reject(e);
                }
            }

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
        lastUpdate = new Date();
        return Promise.resolve();
    };

    const getDataForLocation = async (locationId: string): Promise<ICrawlerMenu[]> => {
        const data: IDbMensa[] = [];

        checkLocationId(locationId);

        const location = <IConstLocation> LOCATIONS[locationId];

        try {
            const menu = await crawler.getMenu(location.shortTag, getCurrentWeek());
            return Promise.resolve(menu);
        } catch (e) {
            if (e instanceof MensaError) {
                Logger.warn(e.message);
                return Promise.resolve([]);
            } else {
                return Promise.reject(e);
            }
        }
    };

    const getCurrentWeek = (): number => {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
}
