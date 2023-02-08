interface IGameHistoryEntry {
    date: Date,
    data: any,
}

export class GameHistory {
    history: IGameHistoryEntry[];

    constructor() {
        this.history = [];
    }

    addEntry(entry: IGameHistoryEntry) {
        this.history.push(entry);
    }

    getHistory(): IGameHistoryEntry[] {
        return this.history;
        // .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ???
    }
}