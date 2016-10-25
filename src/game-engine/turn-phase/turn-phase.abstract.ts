import { Observable } from 'rxjs';
import { GameState } from '../models';
import { TurnPhaseContext } from './turn-phase-context.interface';

export abstract class TurnPhase {
    constructor(protected turnPhaseContext: TurnPhaseContext) { }

    abstract handleInput(input: any): void;
}
