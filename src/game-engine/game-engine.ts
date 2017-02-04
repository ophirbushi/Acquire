import { Player, Bank, Board, BoardService } from 'core';
import { InputSource } from './input-source';
import { TurnPhase, TurnPhaseContext, ChooseCoordinateCardPhase } from './turn-phase';
import { GameState, TurnOutcome } from './models';

export class GameEngine implements TurnPhaseContext {
    gameState: GameState;

    private boardService: BoardService;
    private turnPhase: TurnPhase;

    constructor(private inputSource: InputSource) { }

    newGame(players: Player[]): void {
        let gameState = this.getNewGameState(players);
        this.run(gameState);
    }

    load(gameState: GameState): void {
        this.run(gameState);
    }

    setPhase(turnPhase: TurnPhase): void {
        this.turnPhase = turnPhase;

        const turnPhaseDidNotChange = () => turnPhase === this.turnPhase;
        
        this.inputSource.getInput(turnPhase)
            .takeWhile(turnPhaseDidNotChange)
            .subscribe((input) => turnPhase.handleInput(input), (error) => {  /** todo: handle error */ });
    }

    private run(gameState: GameState): void {
        this.gameState = gameState;
        this.initServices();
        this.setPhase(gameState.turnPhase);
    }

    private initServices(): void {
        this.boardService = new BoardService(this.gameState.board);
    }

    private getNewGameState(players: Player[]): GameState {
        return new GameState(
            new Bank(),
            players,
            players[0],
            new Board(),
            new TurnOutcome(),
            new ChooseCoordinateCardPhase(this, this.boardService)
        );
    }
}
