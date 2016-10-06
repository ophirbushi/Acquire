import { TurnPhase } from './turn-phase.model';

export interface TurnPhaseContext {
    setPhase(turnPhase: TurnPhase<any>);
}
