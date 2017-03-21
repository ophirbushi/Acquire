import { BoardService } from 'core';
import { GameState } from './models';
import { InputSource } from './input-source';
import { TurnPhase, TurnPhaseId, TurnPhaseContext, ChooseCoordinateCardPhase } from './turn-phase';
import { GameStateService } from './game-state.service';
import { Type } from './type.interface';

export class GameEngine implements TurnPhaseContext {
    private readonly turnPhaseDictionary: { [id: string]: Type<TurnPhase> } = {
        [<TurnPhaseId>'choose-coordinate-card']: ChooseCoordinateCardPhase
    };

    constructor(
        private inputSource: InputSource,
        private gameStateService: GameStateService,
        private boardService: BoardService
    ) { }

    run(): void {
        const gameStateSnapShot = this.gameStateService.gameStateSnapshot;
        this.setPhase(gameStateSnapShot.turnPhaseId);
    }

    setPhase = (turnPhaseId: TurnPhaseId): void => {
        const turnPhase = this.getTurnPhase(turnPhaseId);

        const handleInput = (input: any): void => turnPhase.handleInput(this, input, this.boardService, this.gameStateService);
        const handleError = (error: any): void => { };

        this.inputSource
            .getInput(turnPhaseId)
            .take(1)
            .subscribe(handleInput, handleError);
    }

    private getTurnPhase(turnPhaseId: TurnPhaseId): TurnPhase {
        const turnPhaseType: Type<TurnPhase> = this.turnPhaseDictionary[turnPhaseId];
        return new turnPhaseType();
    }
}

