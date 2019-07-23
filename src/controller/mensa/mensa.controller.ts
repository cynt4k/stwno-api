import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '@home/core';
import { HttpCodes, I18n } from '@home/misc';

export namespace MensaController {

    export const getMensas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DatabaseService.getLocations();
            res.data = {
                code: HttpCodes.OK,
                data: data,
                message: I18n.INFO_SUCCESS
            };
            return next();
        } catch (e) {
            return next(e);
        }
    };

    export const getMealsForMensa = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DatabaseService.getMealsForLocation(req.params.id);
            res.data = {
                code: HttpCodes.OK,
                data: data,
                message: I18n.INFO_SUCCESS
            };
            return next();
        } catch (e) {
            return next(e);
        }
    };
}
