import { Observable } from 'rxjs';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhaseMachine } from './turn-phase-machine.model';

export abstract class TurnPhase {
    constructor(protected turnPhaseMachine: TurnPhaseMachine, protected turnOutcome: TurnOutcome) { }
    
    abstract getInput(): Observable<any>;
    abstract handleInput(input: any);
}
