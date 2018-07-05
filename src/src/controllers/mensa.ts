import { response, HttpCodes } from "../misc";
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

    export let getMensaByName = async (req: Request, res: Response, next: NextFunction) => {

    };

    export let getFoodByMensa = async (req: Request, res: Response, next: NextFunction) => {

    };
}