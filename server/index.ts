import express from "express";
import cors from "cors";

import { generateRound } from "./helpers";
import { GameEngine } from "./engine";

const app = express();
const port = 8080;

const gameEngine = new GameEngine();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hejsan hoppsan prutt " + Math.random());
});


app.get("/round", (req, res) => {
    res.json(generateRound());
});

app.get("/monty-hall/round", (req, res) => {
    const result = gameEngine.startNewGame();
    res.json(result);
});



app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});