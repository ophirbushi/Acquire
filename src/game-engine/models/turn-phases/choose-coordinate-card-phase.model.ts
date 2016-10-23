import * as equal from 'deep-equal';
import { Observable } from 'rxjs';
import { CoordinatesCard } from 'models';
import { GameState } from '../game-state';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhase } from './turn-phase.model';
import { TurnPhaseContext } from './turn-phase-context.interface';

export class ChooseCoordinateCardPhase extends TurnPhase<CoordinatesCard> {
    constructor(turnPhaseContext: TurnPhaseContext, gameState: GameState, turnOutcome: TurnOutcome) {
        super(turnPhaseContext, gameState, turnOutcome);
    }

    handleInput(input: CoordinatesCard) {
      //  let coordinatesCardIndex = this.gameState.currentPlayer.coordinatesCards.findIndex(coordinatesCard => equal(coordinatesCard, input));
    }
}
