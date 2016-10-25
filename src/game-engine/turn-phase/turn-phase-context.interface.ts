import { TurnPhase } from './turn-phase.abstract';

export interface TurnPhaseContext {
    setPhase(turnPhase: TurnPhase);
}
