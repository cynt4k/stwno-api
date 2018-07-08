import { response, HttpCodes } from "./index";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export let errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof Error) {
        response(res, HttpCodes.InternalServerError, err.message);
    } else {
        return next(err);
    }
};

export default errorHandler;
