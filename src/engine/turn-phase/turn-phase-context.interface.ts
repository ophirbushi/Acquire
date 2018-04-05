import { TurnPhaseId } from './turn-phase-id';

export interface TurnPhaseContext {
    setPhase(turnPhase: TurnPhaseId): void;
}
