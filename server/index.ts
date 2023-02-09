import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { MontyHallGameEngine } from "./engine";
import { simulateGames } from "./engine/helpers";

const app = express();
const port = 8080;

const gameEngine = new MontyHallGameEngine();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// next function must be defined in this middleware here, even though it is not used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, next: NextFunction) => {
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
    const simulations = parseInt(req.query?.simulations?.toString() || "0");
    const methods = req.query?.methods?.toString().split(",") || [];

    const missingParams = [];
    if (simulations === 0) {
        missingParams.push("simulations");
    }
    if (methods.length === 0) {
        missingParams.push("methods");
    }
    if (missingParams.length > 0) {
        throw new Error(`Missing params: ${missingParams}`);
    }

    const result = simulateGames(methods, simulations);

    res.json(result);
});


app.post("/action", (req: Request, res: Response) => {
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