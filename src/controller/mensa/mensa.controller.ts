import { Request, Response, NextFunction } from 'express';
import { MensaService } from '@home/core/services';
import { HttpCodes, I18n } from '@home/misc';
import { MensaError, ErrorCode } from '@home/error';

export namespace MensaController {

    export const getMensas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await MensaService.getMensas();
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
            // const data = await DatabaseService.getMealsForLocation(req.params.id);
            const data = await MensaService.getMealsForLocation(req.params.id);
            if (!data) {
                res.data = {
                    code: HttpCodes.BadRequest,
                    message: I18n.WARN_VAL_INVALID_PARAMS
                };
            } else {
                res.data = {
                    code: HttpCodes.OK,
                    data: data,
                    message: I18n.INFO_SUCCESS
                };
            }
            return next();
        } catch (e) {
            return next(e);
        }
    };

    export const getMealsForMensaAndDay = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await MensaService.getMealsForLocationAndDay(req.params.id, req.params.day);
            res.data = {
                code: HttpCodes.OK,
                data: data,
                message: I18n.INFO_SUCCESS
            };
            return next(0);
        } catch (e) {
            if (e instanceof MensaError) {
                if (e.getCode() === ErrorCode.LOCATION_NOT_FOUND) {
                    res.data = {
                        code: HttpCodes.BadRequest,
                        message: I18n.WARN_MENSA_INVALID_LOCATION
                    };
                    return next();
                } else if (e.getCode() === ErrorCode.INVALID_DAY) {
                    res.data = {
                        code: HttpCodes.BadRequest,
                        message: I18n.WARN_MENSA_INVALID_DAY
                    };
                    return next();
                }
            }
            return next(e);
        }
    };
}
