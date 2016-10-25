import { Observable } from 'rxjs';
import { TurnPhase } from '../turn-phase';

export interface InputSource {
    getInput(TurnPhase: TurnPhase): Observable<any>;
}
