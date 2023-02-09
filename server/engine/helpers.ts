import { MontyHallGameEngine } from "./index";

export const simulateGames = (methods: string[], simulations: number) => {
    const result = [];

    for (let j = 0; j < methods.length; j++) {
        const simulationEngine = new MontyHallGameEngine();

        for(let i = 1; i <= simulations; i++) {
            simulationEngine.makeAction("START");
            simulationEngine.makeAction("SELECT_DOOR", Math.floor(Math.random() * 3 + 1));
            simulationEngine.makeAction(methods[j]);
        }

        result.push({
            method: methods[j],
            result: simulationEngine.getGameHistory().history.map(res => res.data.result)
        });
    }

    return result;
};