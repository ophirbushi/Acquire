import { TurnPhaseContext } from './turn-phase-context.interface';

export interface TurnPhase {
    handleInput(turnPhaseContext: TurnPhaseContext, input: any): void;
}
