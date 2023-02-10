import { GameHistory, IGameHistoryResponse } from "./history";

export enum DoorContent {
    Win = "Win",
    Bust = "Bust"
}

export enum State {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export enum Result {
    NOT_ACCESSIBLE = "NOT_ACCESSIBLE",
    WIN = "WIN",
    LOSS = "LOSS",
}

export enum Method {
    NOT_ACCESSIBLE = "NOT_ACCESSIBLE",
    STAY = "STAY",
    SELECT_OTHER_DOOR = "SELECT_OTHER_DOOR",
}

interface IDoor {
    result: DoorContent;
    open: boolean;
    selected: boolean;
    number: number;
}

interface IGameRound {
    gameId: number;
    state: State;
    result: Result;
    doors: Record<number, IDoor>;
    actions: string[];
    method: Method;
}

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
            method: Method.NOT_ACCESSIBLE,
            doors: {
                1: {
                    number: 1,
                    open: false,
                    selected: false,
                    result: DoorContent.Bust,
                },
                2: {
                    number: 2,
                    open: false,
                    selected: false,
                    result: DoorContent.Bust,
                },
                3: {
                    number: 3,
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

    private openRandomDoor(): void {
        const doorNumbers: number[] = [1, 2, 3].filter(doorNumber => doorNumber !== this.getSelectedDoor().number);
        let doorNumberToOpen: number = doorNumbers[Math.floor(Math.random() * 2)]; // 0 or 1

        if (this.currentGameRound.doors[doorNumberToOpen].result === DoorContent.Win) {
            // Ooops, can't open that door. It has the win!
            // Select the final remaining door.
            doorNumberToOpen = doorNumbers.filter(doorNumber => doorNumber !== doorNumberToOpen)[0];
        }

        this.currentGameRound.doors[doorNumberToOpen].open = true;
    }

    private openAllDoors(): void {
        Object.values(this.currentGameRound.doors).forEach(door => {
            door.open = true;
        });
    }

    private deselectAllDoors(): void {
        Object.values(this.currentGameRound.doors).forEach(door => {
            door.selected = false;
        });
    }

    private selectDoor(selectDoorNumber: number) {
        if (!this.currentGameRound.doors[selectDoorNumber]) {
            throw new Error(`Game Engine Error: Door with number ${selectDoorNumber} not available`);
        }

        this.deselectAllDoors();
        this.currentGameRound.doors[selectDoorNumber].selected = true;
        this.currentGameRound.actions = ["STAY", "SELECT_OTHER_DOOR", "CANCEL"];
    }

    private getSelectedDoor(): IDoor {
        const selectedDoor = Object.values(this.currentGameRound.doors).find(door => door.selected);
        if (!selectedDoor) {
            throw new Error("Game Engine Error: No selected door");
        }
        return selectedDoor;
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
        this.currentGameRound.actions = ["SELECT_DOOR", "CANCEL"];
    }

    private completeGame() {
        const result = this.getSelectedDoor().result === DoorContent.Win ? Result.WIN : Result.LOSS;
        this.currentGameRound.state = State.COMPLETED;
        this.currentGameRound.actions = ["START"];
        this.currentGameRound.result = result;
        this.openAllDoors();
        this.logToGameHistory();
    }

    private stay(): void {
        this.currentGameRound.method = Method.STAY;
    }

    private selectOtherDoor(): void {
        this.currentGameRound.method = Method.SELECT_OTHER_DOOR;
        const otherDoor = Object.values(this.currentGameRound.doors).find(door => !door.selected && !door.open);
        this.selectDoor(otherDoor?.number || 0);
    }

    private validateAction(action: string): void {
        if (!this.currentGameRound.actions.includes(action)) {
            throw new Error(`Game Engine Error: ${action} action not allowed.`);
        }
    }

    public getCurrentGame(): IGameRound {
        return this.currentGameRound;
    }

    public getGameHistory(): IGameHistoryResponse {
        return this.gameHistory.getHistory();
    }

    public makeAction(action: string, payload?: any): IGameRound {
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
                this.openRandomDoor();
                break;
            case 'STAY':
                this.stay();
                this.completeGame();
                break;
            case 'SELECT_OTHER_DOOR':
                this.selectOtherDoor();
                this.completeGame();
                break;
            default:
                throw new Error("Game Engine Error: Invalid action.");
        }

        return this.currentGameRound;
    }
}