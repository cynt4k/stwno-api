import _ from 'lodash';
import { IMeal, IDbMensa, IMensa } from '@home/interfaces';
import { MensaError, ErrorCode } from '@home/error';

export namespace DatabaseService {
    const data: IDbMensa[] = [];

    export const init = async (): Promise<void> => {

    };

    const checkLocation = (locationId: string): void => {
        const found = _.find(data, (elem) => {
            if (elem.id === locationId) return true;
            return false;
        });

        if (!found) {
            throw new MensaError('Location not found', ErrorCode.LOCATION_NOT_FOUND);
        }
    };

    export const getMealsForLocation = async (locationId: string): Promise<IMeal[]> => {
        checkLocation(locationId);

        const mensa = _.filter(data, (elem) => {
            if (elem.id === locationId) return true;
            return false;
        })[0];

        return Promise.resolve(mensa.meals);
    };

    export const getMealsForLocationAndDay = async (locationId: string, day: Date): Promise<IMeal[]> => {
        const allMeals = await getMealsForLocation(locationId);

        const meals = _.filter(allMeals, (elem) => {
            if (elem.date === day) return true;
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
