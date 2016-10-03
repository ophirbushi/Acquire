import { Observable } from 'rxjs';
import { GameState } from '../game-state';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhaseMachine } from './turn-phase-machine.model';

export abstract class TurnPhase<InputType> {
    constructor(protected turnPhaseMachine: TurnPhaseMachine, protected gameState: GameState, protected turnOutcome: TurnOutcome) { }

    abstract getInput(): Observable<InputType>;
    abstract handleInput(input: InputType): void;
}
