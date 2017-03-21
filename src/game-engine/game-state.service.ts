import { GameState } from './models';

export class GameStateService {
    get gameStateSnapshot(): Readonly<GameState> {
        return JSON.parse(JSON.stringify(this.gameState));
    }

    constructor(private gameState?: GameState) {
        if (gameState == null) {
            this.initGameState();
        }
    }

    private initGameState(): void {
        this.gameState = new GameState();
    }

    updateGameState(action: (gameState: GameState) => void): void {
        action(this.gameState);
    }
}