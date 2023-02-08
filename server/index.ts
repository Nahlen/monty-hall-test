import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { MontyHallGameEngine } from "./engine";

const app = express();
const port = 8080;

interface ResponseError extends Error {
    status?: number;
}

const gameEngine = new MontyHallGameEngine();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.error(err);
    res.status(err.status || 500).json();
});

app.get("/history", (req: Request, res: Response) => {
    const result = gameEngine.getGameHistory();
    res.json(result);
});

app.get("/round", (req: Request, res: Response) => {
    const result = gameEngine.getCurrentGame();
    res.json(result);
});

app.get("/simulate", (req: Request, res: Response) => {
    const simulationEngine = new MontyHallGameEngine();

    const simulations = parseInt(req.query?.simulations?.toString() || "0");
    const method = req.query?.method?.toString() || "";

    const missingParams = [];
    if (simulations === 0) {
        missingParams.push("simulations");
    }
    if (method === "") {
        missingParams.push("method");
    }
    if (missingParams.length > 0) {
        throw new Error(`Missing params: ${missingParams}`);
    }

    for(let i = 1; i <= simulations; i++) {
        simulationEngine.makeAction("START");
        simulationEngine.makeAction("SELECT_DOOR", Math.floor(Math.random() * 3 + 1));
        simulationEngine.makeAction(method);
    }

    res.json(simulationEngine.getGameHistory());
});


app.post("/action", (req: Request, res: Response, next: NextFunction) => {
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