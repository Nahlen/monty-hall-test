import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { generateRound } from "./helpers";
import { MontyHallGameEngine } from "./engine";

const app = express();
const port = 8080;

interface ResponseError extends Error {
    status?: number;
}

const gameEngine = new MontyHallGameEngine();
/* const errorHandlerMiddleware = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log("HEEEEERE!!!!!");
    if (err instanceof SyntaxError && err.status === 500 && 'body' in err) {
        console.error(err);
        return res.status(500).send({ status: 500, message: err.message });
    }
    next();
}; */

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.error(err);
    res.status(err.status || 500).json();
});
// app.use(errorHandlerMiddleware)

app.get("/", (req: Request, res: Response) => {
    res.send("Hejsan hoppsan prutt " + Math.random());
});


app.get("/round", (req: Request, res: Response) => {
    res.json(generateRound());
});

app.get("/game-history", (req: Request, res: Response) => {
    const result = gameEngine.getGameHistory();
    res.json(result);
});

app.get("/game-engine/round", (req: Request, res: Response) => {
    const result = gameEngine.getCurrentGame();
    res.json(result);
});

app.post("/game-engine/action", (req: Request, res: Response, next: NextFunction) => {
    try {
        const action = req.query.action?.toString() || "";
        const payload = req.query.payload || {};
        const result = gameEngine.makeAction(action, payload);
        res.json(result);
    } catch (err: any) {
        res.status(500).send({
            status: 500,
            message: err.message
        });
    }
});




app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});