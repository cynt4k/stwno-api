import rp from "request-promise";
import {IDay, IFood, IMeal, IMensa} from "../types/db";
import {db} from "./db";
import schedule from "node-schedule";

interface IRefs {
    name: string;
    ref: string;
}

export namespace InitDb {

    let baseUrl;

    export let init = async (url: string): Promise<any> => new Promise(async (resolve, reject) => {
        rp.defaults({ encoding: "latin1" });
        baseUrl = url;
        console.log("Fetching data ...");
        try {
            const res = await fetchData(false);
            schedule.scheduleJob("* */1 * * *", async () => {
                try {
                    const res = await refresh();
                    // console.log("Successfully refreshed data at: " + date.getHours() + ":" + date.getMinutes());
                } catch (e) {
                    const date: Date = new Date;
                    console.error("Could not refresh data at: " + date.getHours() + ":" + date.getMinutes());
                    console.error(e.message);
                }
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });

    let refresh = async (): Promise<any> => new Promise(async (resolve, reject) => {
        try {
            const res = await fetchData(true);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

    let fetchData = async(refresh:boolean): Promise<any> => new Promise(async (resolve, reject) => {
        rp.defaults({ encoding: "latin1" });
        try {
            let data = await rp(baseUrl + "reg1.json");
            data = data.replace(/[\u00AD\u002D\u2011]+/g,'');
            const parsed = await parseData(JSON.parse(data), refresh);
            resolve();
        } catch (e) {
            reject(e);
        }
    });

    let parseData = async (data, refresh: boolean): Promise<any> => new Promise(async (resolve, reject) =>  {
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
                let res = await rp(baseUrl + mensaRaw.ref + ".json");
                res = res.replace(/[\u00AD\u002D\u2011]+/g,'');
                let mensa: IMensa = parseMensa(JSON.parse(res))
                let days: IDay[] = parseDay(JSON.parse(res).days, mensa);
                mensa.day = days;
                if (refresh) {
                    db.updateMensa(mensa);
                } else {
                    db.addMensa(mensa);
                }
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


            let rawDate = dayRaw["date"].split(/,(.+)/)[1].split(".");
            let date: Date = new Date(rawDate[2], rawDate[1] - 1, rawDate[0]);
            date.setHours(12);

            let day: IDay = {
                date: date,
                food: foods,
            };
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
