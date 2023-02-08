enum IGameEngineState {
    INACTIVE,
    ACTIVE,
    CANCELLED,
    COMPLETED,
}

enum IGameEngineResult {
    BUST,
    WIN,
}

export interface IGameEngineResponse {
    state: IGameEngineState,
    result: IGameEngineResult | null,
    actions: string[]
}

export abstract class AbstractGameEngine {
    public abstract startNewGame(): IGameEngineResponse;
    public abstract makeAction(): IGameEngineResponse;
    public abstract getCurrentGame(): IGameEngineResponse;
}