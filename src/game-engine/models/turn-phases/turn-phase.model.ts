import { Observable } from 'rxjs';
import { GameState } from '../game-state';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhaseContext } from './turn-phase-context.interface';

export abstract class TurnPhase<InputType> {
    constructor(protected turnPhaseContext: TurnPhaseContext, protected gameState: GameState, protected turnOutcome: TurnOutcome) { }

    abstract getInput(): Observable<InputType>;
    abstract handleInput(input: InputType): void;
}
