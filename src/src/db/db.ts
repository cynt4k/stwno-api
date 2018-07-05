import {IDay, IFood, IMensa} from "../types/db";

export namespace db {
    let data: IMensa[] = [];

    export let addMensa = (mensa: IMensa) => {
        data.push(mensa);
    };

    export let getMensas = (): IMensa[] => {
        return data;
    };

    export let getMensaNames = (): string[] => {
        let names: string[] = [];
        for (let mensa of data) {
            names.push(mensa.name);
        }
        return names;
    };

    export let findDaysByMensa = (name: string): IDay[] | undefined => {
        for (let mensa of data) {
            if (mensa.name == name) {
                return mensa.day;
            }
        }
    }
}