import * as equal from 'deep-equal';
import { Observable } from 'rxjs';
import { CoordinatesCard } from 'core';
import { GameState, TurnOutcome } from '../models';
import { TurnPhase } from './turn-phase.abstract';
import { TurnPhaseContext } from './turn-phase-context.interface';

export class ChooseCoordinateCardPhase extends TurnPhase {
    constructor(turnPhaseContext: TurnPhaseContext, gameState: GameState, turnOutcome: TurnOutcome) {
        super(turnPhaseContext, gameState, turnOutcome);
    }

    handleInput(input: CoordinatesCard) {

        //  let coordinatesCardIndex = this.gameState.currentPlayer.coordinatesCards.findIndex(coordinatesCard => equal(coordinatesCard, input));
    }
}
