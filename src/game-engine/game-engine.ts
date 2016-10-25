import { Subscription } from 'rxjs';
import { Player, Bank, Board, BoardService } from 'core';
import { InputSource } from './input-source';
import { TurnPhase, TurnPhaseContext, ChooseCoordinateCardPhase } from './turn-phase';
import { GameState, TurnOutcome } from './models';

export class GameEngine implements TurnPhaseContext {
    gameState: GameState;

    private boardService: BoardService;
    private getInputListener: Subscription;

    constructor(private inputSource: InputSource) { }

    run(players: Player[]) {
        this.initGameState(players);
        this.initServices();
        this.setPhase(new ChooseCoordinateCardPhase(this.boardService, this))
    }

    setPhase(turnPhase: TurnPhase) {
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
        this.gameState = new GameState(new Bank(), players, players[ 0 ], new Board(), new TurnOutcome());
    }

    private initServices() {
        this.boardService = new BoardService(this.gameState.board);
    }
}
