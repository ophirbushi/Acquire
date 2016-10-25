import * as equal from 'deep-equal';
import { Observable } from 'rxjs';
import { CoordinatesCard, BoardService } from 'core';
import { GameState, TurnOutcome } from '../models';
import { TurnPhase } from './turn-phase.abstract';
import { TurnPhaseContext } from './turn-phase-context.interface';

export class ChooseCoordinateCardPhase extends TurnPhase {
    constructor(turnPhaseContext: TurnPhaseContext, private boardService: BoardService) {
        super(turnPhaseContext);
    }

    handleInput(coordinatesCard: CoordinatesCard) {
        let coordinatesCardEffect = this.boardService.getCoordinatesCardEffect(coordinatesCard.coordinates);

        //  let coordinatesCardIndex = this.gameState.currentPlayer.coordinatesCards.findIndex(coordinatesCard => equal(coordinatesCard, input));
    }
}
