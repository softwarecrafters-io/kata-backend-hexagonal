import express, {Express, Request, Response, Router} from "express";
import {UserRegistrationController} from "./userRegistrationController";
import {Routes} from "./routes";

export function createRouter(userRegistrationController: UserRegistrationController){
    const router = Router();
    router.get(Routes.status, (req:Request, res: Response)=> res.status(200).json({status:'OK'}));
    router.post(Routes.register, userRegistrationController.register);
    return router;
}

export function createServer(router: Router):Express {
    const server = express();
    server.use(express.json());
    server.use(router);
    return server;
}
