import _ from 'lodash';
import { IMeal, IDbMensa, IMensa } from '@home/interfaces';
import { MensaError, ErrorCode } from '@home/error';

export namespace DatabaseService {
    const data: IDbMensa[] = [];

    export const init = async (): Promise<void> => {

    };

    const checkLocation = (locationId: string, exist: boolean): void => {
        const found = _.find(data, (elem) => {
            if (elem.id === locationId) return true;
            return false;
        });

        if (!found && exist) {
            throw new MensaError(`Location not found - ${locationId}`, ErrorCode.LOCATION_NOT_FOUND);
        }

        if (found && !exist) {
            throw new MensaError(`Location found - ${locationId}`, ErrorCode.LOCATION_FOUND);
        }
    };

    const getLocation = (locationId: string): IDbMensa => {
        checkLocation(locationId, true);

        return _.filter(data, (elem) => {
            if (elem.id === locationId) return true;
            return false;
        })[0];
    };

    export const setLocation = async (mensa: IDbMensa): Promise<void> => {
        checkLocation(mensa.id, false);

        data.push(mensa);
    };

    export const updateMealsForLocation = async (locationId: string, meals: IMeal[]): Promise<void> => {
        const mensa = getLocation(locationId);

        mensa.meals = meals;
        return Promise.resolve();
    };

    export const getMealsForLocation = async (locationId: string): Promise<IMeal[]> => {
        const mensa = getLocation(locationId);

        return Promise.resolve(mensa.meals);
    };

    export const getMealsForLocationAndDay = async (locationId: string, day: Date): Promise<IMeal[]> => {
        const allMeals = await getMealsForLocation(locationId);

        const meals = _.filter(allMeals, (elem) => {
            if (elem.date.getDay() === day.getDay()) return true;
            return false;
        });

        return Promise.resolve(meals);
    };

    export const getAll = async (): Promise<IDbMensa[]> => {
        return Promise.resolve(data);
    };

    export const getLocations = async (): Promise<IMensa[]> => {
        const mensas: IMensa[] = [];

        _.forEach(data, (elem) => {
            mensas.push({
                id: elem.id,
                name: elem.name
            });
        });

        return Promise.resolve(mensas);
    };
}
