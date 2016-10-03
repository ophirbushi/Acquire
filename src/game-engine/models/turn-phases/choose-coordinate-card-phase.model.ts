import * as equal from 'deep-equal';
import { Observable } from 'rxjs';
import { CoordinatesCard } from 'models';
import { GameState } from '../game-state';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhase } from './turn-phase.model';
import { TurnPhaseMachine } from './turn-phase-machine.model';

export class ChooseCoordinateCardPhase extends TurnPhase<CoordinatesCard> {
    constructor(turnPhaseMachine: TurnPhaseMachine, gameState: GameState, turnOutcome: TurnOutcome) {
        super(turnPhaseMachine, gameState, turnOutcome);
    }

    getInput() {
        return Observable.empty<CoordinatesCard>();
    }

    handleInput(input: CoordinatesCard) {
        let coordinatesCardIndex = this.gameState.currentPlayer.coordinatesCards.findIndex(coordinatesCard => equal(coordinatesCard, input));
    }
}
