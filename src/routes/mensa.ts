import { MensaController } from "../controllers/mensa";
import express from "express";

export namespace MensaRoute {
    export let setRoutes = (app: express.Router | any) => {
        app.get("/mensa", MensaController.getMensas);
        app.get("/mensa/names", MensaController.getMensaNames);
        app.get("/mensa/:id", MensaController.getMensaById);
        app.get("/mensa/:id/food/", MensaController.getFoodByMensa);
        app.get("/mensa/:id/food/:day", MensaController.getFoodByMensaAndDay);
    }
}