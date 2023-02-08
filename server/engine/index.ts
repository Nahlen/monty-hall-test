import { GameHistory } from "./history";

enum DoorContent {
    Win = "Win",
    Bust = "Bust"
}

enum State {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

enum Result {
    NOT_ACCESSIBLE = "NOT_ACCESSIBLE",
    WIN = "WIN",
    LOSS = "LOSS",
}

// type Action = "START" | "SELECT" | "SELECT_DOOR" | "SELECT_OTHER_DOOR" | "CANCEL" | "STAY";  

interface IDoor {
    result: DoorContent,
    open: boolean,
    selected: boolean,
}

interface IGameRound {
    gameId: number;
    state: State;
    result: Result;
    doors: Record<number, IDoor>;
    actions: string[];
}

type IGameType = string;

interface IGameEngineResponse {
    gameType: IGameType;
    gameRound: IGameRound;
}

// TODO: Validate state
// getNewGameRound => current not completed = error
// selectDoor => current selected, should maybe be done with other method?
// Open door logic => returned by api, and on finalize game

export class MontyHallGameEngine {
    private currentGameRound: IGameRound;
    private gameType: string;
    private gameHistory: GameHistory;

    constructor() {
        this.gameType = "monty-hall";
        this.gameHistory = new GameHistory(this.gameType);
        this.createNewGameRound();
    }

    private createNewGameRound(): void {
        const winningDoorNumber = Math.floor(Math.random() * 3 + 1);
        const gameId = this.currentGameRound?.gameId || 0;

        this.currentGameRound = {
            gameId: gameId + 1,
            state: State.INACTIVE,
            actions: ["START"],
            result: Result.NOT_ACCESSIBLE,
            doors: {
                1: {
                    open: false,
                    selected: false,
                    result: DoorContent.Bust,
                },
                2: {
                    open: false,
                    selected: false,
                    result: DoorContent.Bust,
                },
                3: {
                    open: false,
                    selected: false,
                    result: DoorContent.Bust,
                },
            }
        };

        this.currentGameRound.doors[winningDoorNumber].result = DoorContent.Win;
    }

    private logToGameHistory(): void {
        this.gameHistory.log({
            date: new Date(),
            data: this.currentGameRound,
        });
    }

    public getGameHistory(): any {
        return this.gameHistory.getHistory();
    }

    private validateAction(action: string): boolean {
        // Good place to add game engine error logging.
        // This logging is not game history logging though.
        if (this.currentGameRound.actions.indexOf(action) === -1) {
            throw new Error(`Game Engine Error: ${action} action not allowed.`);
        }
        return true;
    }

    private cancelGame(): void {
        this.currentGameRound.state = State.CANCELLED;
        this.logToGameHistory();
        this.createNewGameRound();
    }

    private startNewGame(): void {
        if (this.currentGameRound.state === State.COMPLETED) {
            this.createNewGameRound();
        }
        this.currentGameRound.state = State.ACTIVE;
        this.currentGameRound.actions = ["SELECT_DOOR", "CANCEL"]
    }

    private selectDoor(selectDoorNumber: number) {
        if (!this.currentGameRound.doors[selectDoorNumber]) {
            throw new Error(`Game Engine Error: Door with number ${selectDoorNumber} not available`);
        }
        const otherDoorNumbers: number[] = [1, 2, 3].filter(doorNumber => doorNumber !== selectDoorNumber);
        let doorNumberToOpen: number = otherDoorNumbers[Math.floor(Math.random() * 2)];

        // AUTOMATIC DOOR OPEN LOGIC
        if (this.currentGameRound.doors[doorNumberToOpen].result === DoorContent.Win) {
            // Ooops, can't open that door. It has the win!
            // Select the final remaining door.
            doorNumberToOpen = otherDoorNumbers.filter(doorNumber => doorNumber !== doorNumberToOpen)[0]
        }

        this.currentGameRound.doors[selectDoorNumber].selected = true;
        this.currentGameRound.doors[doorNumberToOpen].open = true;
        this.currentGameRound.actions = ["STAY", "SELECT_OTHER_DOOR", "CANCEL"];
    }

    private completeGame() {
        const doorNumbers: number[] = [1, 2, 3];
        this.currentGameRound.actions = ["START"];
        let result = Result.LOSS;

        doorNumbers.forEach(doorNumber => {
            const door = this.currentGameRound.doors[doorNumber];
            door.open = true;

            if (door.selected === true && door.result === DoorContent.Win) {
                result = Result.WIN;
            }
        });
    
        this.currentGameRound.state = State.COMPLETED;
        this.currentGameRound.result = result;
        this.logToGameHistory();
    }

    private selectOtherDoor() {
        [1, 2, 3].forEach(doorNumber => {
            const door = this.currentGameRound.doors[doorNumber];
            if (!door.open && !door.selected) {
                door.selected = true;
            } else {
                door.selected = false;
            }
        });

        this.completeGame();
    }

    public makeAction(action: string, payload?: any): IGameEngineResponse {
        this.validateAction(action);

        switch (action) {
            case 'START':
                this.startNewGame();
                break;
            case 'CANCEL':
                this.cancelGame();
                break;
            case 'SELECT_DOOR':
                this.selectDoor(parseInt(payload, 10));
                break;
            case 'STAY':
                this.completeGame();
                break;
            case 'SELECT_OTHER_DOOR':
                this.selectOtherDoor();
                break;
            default:
                throw new Error("Game Engine Error: Invalid action.");
        }

        return {
            gameType: this.gameType,
            gameRound: this.currentGameRound,
        };
    }

    public getCurrentGame(): IGameEngineResponse {
        return {
            gameType: this.gameType,
            gameRound: this.currentGameRound,
        };
    }
}