interface IGameHistoryEntry {
    date: Date,
    data: any,
}

type IGameType = string;

interface IGameHistoryResponse {
    gameType: IGameType;
    history: IGameHistoryEntry[];
}

export class GameHistory {
    private history: IGameHistoryEntry[];
    private gameType: IGameType;

    constructor(gameType: IGameType) {
        this.gameType = gameType;
        this.history = [];
    }

    log(entry: IGameHistoryEntry) {
        this.history.push(entry);
    }

    getHistory(): IGameHistoryResponse {
        return {
            gameType: this.gameType,
            history: this.history,
        };
        // .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ???
    }
}