import { TurnPhaseId } from '../turn-phase';

export interface InputSource {
    getInput(TurnPhase: TurnPhaseId): Promise<any>;
}
