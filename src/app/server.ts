import dotenv from "dotenv";
import { InitDb } from "./db";

switch(process.env.NODE_ENV) {
    case "test": dotenv.config({ path: ".env-test" }); break;
    case "dev": dotenv.config({ path: ".env-dev" }); break;
    case "production": dotenv.config({ path: ".env-prod" }); break;
    default: console.error("No environment specified - exit"); process.exit(1);
}

process.env.TZ = "Europe/Berlin";

import app from "./app";

(async() => {
    try {
        const result = await InitDb.init(process.env.MENSA_URL as string);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    try {
        const status = await app.listen(app.get("port"));
        console.log("Server status:\n\t- PORT: " + app.get("port") +"\n\t- Mode: " + app.get("env"));
    } catch (err) {
        console.log("Check your express server:  " + err);
        process.exit(1);
    }
})();