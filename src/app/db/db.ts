import {IDay, IFood, IMensa} from "../types/db";

export namespace db {
    let data: IMensa[] = [];

    export let addMensa = (mensa: IMensa) => {
        data.push(mensa);
    };

    export let updateMensa = (newMensa: IMensa) => {
        for (let mensa of data) {
            if (mensa.id == newMensa.id) {
                mensa = newMensa;
                return;
            }
        }
        data.push(newMensa);
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

    export let getMensaByName = (name: string): IMensa | undefined => {
        for (let mensa of data) {
            if (mensa.name == name) {
                return mensa;
            }
        }
    };

    export let getMensaById = (id: string): Promise<any> => new Promise((resolve, reject) => {
        for (let mensa of data) {
            if (mensa.id == id) {
                let ret: IMensa = {...mensa};
                delete ret.day;
                return resolve(ret);
            }
        }
        resolve();
    });

    export let findDaysByMensaId = (id: string): Promise<IDay[] | undefined> => new Promise((resolve, reject) => {
        for (let mensa of data) {
            if (mensa.id == id) {
                return resolve(mensa.day);
            }
        }
        resolve();
    });
}