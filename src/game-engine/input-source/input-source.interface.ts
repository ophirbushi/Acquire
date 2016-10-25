import { Observable } from 'rxjs';
import { TurnPhase } from '../turn-phase';

export interface InputSource {
    getInput<T>(TurnPhase: TurnPhase<T>): Observable<T>;
}
