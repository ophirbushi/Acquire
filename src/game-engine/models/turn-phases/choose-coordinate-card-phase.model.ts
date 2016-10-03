import { Observable } from 'rxjs';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhase } from './turn-phase.model';
import { TurnPhaseMachine } from './turn-phase-machine.model';

export class ChooseCoordinateCardPhase extends TurnPhase {
    constructor(turnPhaseMachine: TurnPhaseMachine, turnOutcome: TurnOutcome) {
        super(turnPhaseMachine, turnOutcome);
    }

    getInput() {
        return Observable.empty();
    }

    handleInput() {

    }
}
