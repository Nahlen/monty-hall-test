import { AbstractGameEngine, IGameEngineResponse } from "./game";

enum DoorContent {
    Win = "Win",
    Bust = "Bust"
}

interface IDoor {
    result: DoorContent,
    open: boolean,
}

interface IGameRound {
    state: string;
    doors: Record<number, IDoor | null>;
}

// TODO: Validate state
// getNewGameRound => current not completed = error
// selectDoor => current selected, should maybe be done with other method?
// Open door logic => returned by api, and on finalize game

export class GameEngine {
    private currentGameRound: IGameRound;

    constructor() {
        this.currentGameRound = {
            state: "INACTIVE",
            doors: {
                1: null,
                2: null,
                3: null,
            }
        };
    }

    private startNewGameRound(): void {
        const winningDoorNumber = Math.floor(Math.random() * 3 + 1);
        const doors = {};

        // This is a bit ugly, but typescript complains a lot about dictionaries/records
        // when trying to modify it in for loops or such.
        this.currentGameRound.doors[1] = {
            result: winningDoorNumber === 1 ? DoorContent.Win : DoorContent.Bust,
            open: false,
        };
        this.currentGameRound.doors[2] = {
            result: winningDoorNumber === 2 ? DoorContent.Win : DoorContent.Bust,
            open: false,
        };
        this.currentGameRound.doors[3] = {
            result: winningDoorNumber === 3 ? DoorContent.Win : DoorContent.Bust,
            open: false,
        };
    }

    public startNewGame(): IGameRound {
        if (this.currentGameRound.state !== "INACTIVE" && this.currentGameRound.state !== "COMPLETED") {
            console.log("LOG TO GAME HISTORY CANCELLED");
        }

        this.startNewGameRound();

        return this.currentGameRound;
    }


    /* private currentDate: Date | null;
    private currentGameRound: [key: number]: IDoor;

    constructor() {
        this.currentDate = null;
        this.currentGameRound = null;
    }

    public getCurrentGame(): [IDoor, IDoor, IDoor] {
        if (!this.currentGameRound) {
            this.currentDate = new Date();
            this.currentGameRound = [{
                    result: DoorContent.Bust,
                    open: false,
                    id: 1,
                }, {
                    result: DoorContent.Bust,
                    open: false,
                    id: 2,
                }, {
                    result: DoorContent.Win,
                    open: false,
                    id: 3,
            }];
        }

        return this.currentGameRound;
    }

    public openDoor(id: number) {

    } */


}