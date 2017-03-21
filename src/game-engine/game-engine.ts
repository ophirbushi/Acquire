import { Player, Board, Bank, BoardService } from 'core';
import { GameState, TurnOutcome } from './models';
import { Toolbox } from './toolbox';
import { InputSource } from './input-source';
import { TurnPhase, TurnPhaseContext, ChooseCoordinateCardPhase } from './turn-phase';
import { GameStateService } from './game-state.service';

export class GameEngine implements TurnPhaseContext {
    private boardService: BoardService;
    private gameStateService: GameStateService;

    constructor(private inputSource: InputSource) { }

    newGame(players: Player[]): void {
        const gameState = new GameState(players, new Bank(), 0, new Board(), new TurnOutcome(), new ChooseCoordinateCardPhase(), )
    }

    load(gameState: GameState): void {
        this.run(gameState);
    }

    initServices(gameState?: GameState): void {
        this.boardService = new BoardService();
        this.gameStateService = new GameStateService(gameState);
    }

    run(gameState: GameState): void {

        const turnPhase = new ChooseCoordinateCardPhase();
        this.setPhase(turnPhase);
    }

    setPhase = (turnPhase: TurnPhase): void => {
        const handleInput = (input: any): void => turnPhase.handleInput(this, input, {});
        const handleError = (error: any): void => { };

        this.inputSource
            .getInput(turnPhase)
            .take(1)
            .subscribe(handleInput, handleError);
    }
}

