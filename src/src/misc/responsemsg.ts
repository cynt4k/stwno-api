import { HttpCodes } from "./index";
import { IResponse } from "../types";
import { Response, NextFunction } from "express";

export let response = (res: Response, code: HttpCodes, msg?: string, data?: any) => {
    let responseMessage: IResponse = <IResponse>{};

    if (code >= 400) {
        responseMessage.status = "error";
        responseMessage.code = code;
    } else {
        responseMessage.status = "success";
        responseMessage.code = code;
    }

    (data === undefined) ? responseMessage.data = "" : responseMessage.data = data;
    (msg === undefined) ? responseMessage.message = "" : responseMessage.message = msg;

    res.setHeader("Content-Type", "application/json");
    res.status(code).send(JSON.stringify(responseMessage));
};

export default response;
