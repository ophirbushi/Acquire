import { Observable } from 'rxjs';
import { TurnPhaseId } from '../turn-phase';

export interface InputSource {
    getInput(TurnPhase: TurnPhaseId): Observable<any>;
}
