import { Observable } from 'rxjs';
import { GameState, TurnOutcome } from '../models';
import { TurnPhaseContext } from './turn-phase-context.interface';

export abstract class TurnPhase {
    constructor(protected turnPhaseContext: TurnPhaseContext, protected gameState: GameState, protected turnOutcome: TurnOutcome) { }

    abstract handleInput(input: any): void;
}
