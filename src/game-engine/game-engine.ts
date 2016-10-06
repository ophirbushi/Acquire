import { Subscription } from 'rxjs';
import { Player, Bank, Board } from 'models';
import { TurnPhase, TurnPhaseContext, GameState, TurnOutcome } from './models';

export class GameEngine implements TurnPhaseContext {
    gameState: GameState;
    turnOutcome: TurnOutcome;

    private getInputListener: Subscription;

    run(players: Player[]) {
        this.initGameState(players);
    }

    setPhase(turnPhase: TurnPhase<any>) {
        if (this.getInputListener !== undefined && this.getInputListener !== null && !this.getInputListener.closed) {
            this.getInputListener.unsubscribe();
        }

        this.getInputListener = turnPhase.getInput()
            .subscribe(
            input => turnPhase.handleInput(input),
            error => {  /** todo: handle error */ }
            );
    }

    private initGameState(players: Player[]) {
        let bank = new Bank();
        let board = new Board();
        this.gameState = new GameState(bank, players, players[ 0 ], board);
    }
}
