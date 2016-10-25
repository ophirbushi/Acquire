import { Subscription } from 'rxjs';
import { Player, Bank, Board } from 'models';
import { TurnPhase, TurnPhaseContext, GameState, TurnOutcome, InputSource } from './models';

export class GameEngine implements TurnPhaseContext {
    gameState: GameState;
    turnOutcome: TurnOutcome;

    private getInputListener: Subscription;

    constructor(private inputSource: InputSource) { }

    run(players: Player[]) {
        this.initGameState(players);
    }

    setPhase(turnPhase: TurnPhase<any>) {
        if (this.getInputListener !== undefined && this.getInputListener !== null && !this.getInputListener.closed) {
            this.getInputListener.unsubscribe();
        }

        this.getInputListener = this.inputSource.getInput(turnPhase)
            .subscribe(
            input => turnPhase.handleInput(input),
            error => {  /** todo: handle error */ }
            );
    }

    private initGameState(players: Player[]) {
        let bank = new Bank();
        let board = new Board();
    }
}
