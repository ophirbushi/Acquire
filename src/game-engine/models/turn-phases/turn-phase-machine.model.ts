import { Subscription } from 'rxjs';
import { TurnPhase } from './turn-phase.model';

export class TurnPhaseMachine {
    private getInputListener: Subscription;

    setPhase(turnPhase: TurnPhase<any>) {
        if (this.getInputListener !== undefined && this.getInputListener !== null && !this.getInputListener.closed) {
            this.getInputListener.unsubscribe();
        }

        this.getInputListener = turnPhase.getInput()
            .subscribe(
            input => turnPhase.handleInput(input),
            error => {  /** todo: handle error */ }
            );
    }
}
