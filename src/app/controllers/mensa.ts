import {response, HttpCodes, Weekday} from "../misc";
import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import {IMensa} from "../types/db";

export namespace MensaController {
    export let getMensas = async (req: Request, res: Response, next: NextFunction) => {
        let mensas: IMensa[] = [];
        mensas = db.getMensas();
        for (let mensa of mensas) {
            delete mensa.day;
        }
        response(res, HttpCodes.OK, "OK", mensas);
    };

    export let getMensaNames = async (req: Request, res: Response, next: NextFunction) => {
        let mensas: string[];
        mensas = db.getMensaNames();
        response(res, HttpCodes.OK, "OK", mensas);
    };

    export let getMensaById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await db.getMensaById(req.params.id);
            if (!data) {
                return response(res, HttpCodes.NotFound, "Mensa not found");
            }
            return response(res, HttpCodes.OK, "OK", data);
        } catch (err) {
            return next(err);
        }
    };

    export let getFoodByMensa = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await db.findDaysByMensaId(req.params.id);
            if (!data) {
                return response(res, HttpCodes.NotFound, "Mensa not found");
            }
            return response(res, HttpCodes.OK, "OK", data);
        } catch (err) {
            return next(err);
        }
    };

    export let getFoodByMensaAndDay = async (req: Request, res: Response, next: NextFunction) => {
        let params = req.params;
        params.day = params.day.toUpperCase();

        let checkWeekday = async (): Promise<Weekday | undefined> => new Promise<Weekday | undefined>((resolve, reject) => {
            for (let value in Weekday) {
                let day = parseInt(value, 10) >= 0;
                if (day) {
                    if (params.day == Weekday[value]) {
                        return resolve(parseInt(value));
                    }
                }
            }
            return resolve();
        });

        try {
            const weekday = await checkWeekday();
            const data = await db.findDaysByMensaId(req.params.id);
            if (!data) {
                return response(res, HttpCodes.NotFound, "Mensa not found");
            }
            if (!weekday) {
                return response(res, HttpCodes.NotFound, "Invalid weekday " + params.day);
            }

            for (let day of data) {
                const date = day["date"].getDay();
                if (weekday == date) {
                    return response(res, HttpCodes.OK, "OK", day.food);
                }

            }

            return response(res, HttpCodes.NotFound, "No mensa food on this day");
        } catch (err) {
            return next(err);
        }
    };

    export let getFoodByMensaToday = async (req: Request, res: Response, next: NextFunction) => {
      let params = req.params;
      let today = new Date();
      try {
          const data = await db.findDaysByMensaId(params.id);
          if (!data) {
              return response(res, HttpCodes.NotFound, "Mensa not found");
          }

          for (let day of data) {
              const date = day["date"];
              if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                  return response(res, HttpCodes.OK, "OK", day.food);
              }
          }
          return response(res, HttpCodes.NotFound, "No mensa food today");
      } catch (err) {
          return next(err);
      }
    };
}