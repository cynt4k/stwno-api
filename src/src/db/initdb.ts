import rp from "request-promise";
import {IDay, IFood, IMeal, IMensa} from "../types/db";
import {db} from "./db";

interface IRefs {
    name: string;
    ref: string;
}

export namespace InitDb {

    let baseUrl;

    export let init = async (url: string): Promise<any> => new Promise(async (resolve, reject) => {
        baseUrl = url;
        try {
            const data = await rp(url + "reg1.json");
            const parsed = await parseData(JSON.parse(data));
            resolve();
        } catch (e) {
            reject(e);
        }
    });

    let parseData = async (data): Promise<any> => new Promise(async (resolve, reject) =>  {
        let refs: IRefs[] = [];

        refs.push({
            name: data.name,
            ref: data.id,
        });

        for(let mensa of data.vicinity) {
            if (mensa.name) {
                refs.push({
                    "name": mensa.name,
                    "ref": mensa.ref,
                });
            }
        }

        for (let mensaRaw of refs) {
            try {
                const res = await rp(baseUrl + mensaRaw.ref + ".json");
                let mensa: IMensa = parseMensa(JSON.parse(res))
                let days: IDay[] = parseDay(JSON.parse(res).days, mensa);
                mensa.day = days;
                db.addMensa(mensa);
            } catch (err) {
             reject(err);
            }
        }
        resolve();
    });

    let parseMensa = (data): IMensa => {
      return <IMensa>{
          id: data.id,
          name: data.name,
          address: data.address,
          location: data.location,
      }
    };

    let parseDay = (daysRaw, mensa: IMensa): IDay[] => {
        let days: IDay[] = [];
        for (let dayRaw of daysRaw) {
            let foods: IFood[] = parseFoods(dayRaw.categories);


            let day: IDay = {
                date: new Date(Date.parse(dayRaw["iso-date"])),
                food: foods,
            }
            days.push(day);
        }
        return days;
    };

    let parseFoods = (foodsRaw): IFood[] => {
        let foods: IFood[] = [];
        for (let foodRaw of foodsRaw) {
            if (!foodRaw.name) {
                continue;
            }
            let meals: IMeal[] = [];
            let food: IFood = {
                name: foodRaw.name,
                meal: meals,
            };
            for (let mealRaw of foodRaw.meals) {
                let meal: IMeal = {
                    id: mealRaw.id,
                    name: mealRaw.name,
                    price: mealRaw.prices["Studierende"],
                };
                meals.push(meal);
            }
            foods.push(food);
        }
        return foods;
    };
}

export default InitDb;
