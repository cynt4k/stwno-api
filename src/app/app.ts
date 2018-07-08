import express, { NextFunction, Response, Request } from "express";
import lusca from "lusca";
import logger from "morgan";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import compression from "compression";

let logLevel: string = "dev";

switch(process.env.NODE_ENV) {
    case "test": logLevel = ""; break;
    case "dev": logLevel = "dev"; break;
    case "production": logLevel = "common"; break;
    default: console.log("No environement specified - exit"); process.exit(1); break;
}

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(compression());
if (process.env.NODE_ENV !== "test") {
    app.use(logger(logLevel));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use((req: Request, res: Response, next: NextFunction) => {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, x-access-token");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", "1");

    // Pass to next layer of middleware
    next();
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("OK");
});

import { MensaRoute } from "./routes";

MensaRoute.setRoutes(app);

export default app;
