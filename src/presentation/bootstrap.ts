import * as bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { AppError } from "@/libs/exceptions/app-error";
import { errorHandler } from "@/libs/exceptions/error-handler";
import { logger } from "@/libs/logger";
import { APP_URL_PREFIX } from "@/libs/utils";
import { Routes } from "./routes/routes";

export class Bootstrap {
    public app = express();

    constructor(private appRoutes: Routes) {
        this.app = express();
        this.middleware();
        this.setRoutes();
        this.middlewareError();
    }

    private middleware(): void {
        const requestLogger = (
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            response.removeHeader("x-powered-by");
            response.header("Access-Control-Allow-Origin", "*");
            response.header(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, PATCH, DELETE"
            );
            response.header(
                "Access-Control-Allow-Headers",
                "content-type, Authorization"
            );
            console.log(`${request.method} url:: ${request.url}`);
            next();
        };
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, "../../public")));
        this.app.use(express.static(path.join(__dirname, "../../storage")));
        this.app.use(requestLogger);
    }

    private middlewareError(): void {
        const errorLogger = (
            error: AppError,
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            logger.error(error.error);
            next(error); // calling next middleware
        };

        const errorResponder = (
            error: AppError,
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            errorHandler.handleError(error, response);
        };

        const invalidPathHandler = (
            request: Request,
            response: Response,
            next: NextFunction
        ) => {
            response.status(400);
            response.json({
                message: "invalid path",
            });
        };

        this.app.use(errorLogger);
        this.app.use(errorResponder);
        this.app.use(invalidPathHandler);
    }

    private setRoutes(): void {
        const router = express.Router();
        this.app.use(APP_URL_PREFIX, router);
        router.get("/health-check", (req, res, next) => {
            res.json({
                message: "server is up boys",
            });
        });
        this.appRoutes.setRoutes(router);
        this.app.get("*", (req, res) => {
            try {
                fs.readFileSync(
                    path.join(__dirname, "../../public/index.html")
                );
                return res.sendFile(
                    path.join(__dirname, "../../public/index.html")
                );
            } catch (e) {
                return res.status(404).send("NOT FOUND");
            }
        });
    }
}
