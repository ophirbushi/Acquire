import { State, StateContext } from '../interfaces';
import { StateA } from './state-a.model';
import { StateC } from './state-c.model';

export class StateB extends State {
    constructor(stateContext: StateContext) {
        super('StateB', stateContext);
    }

    handleInput(input: string) {
        if (input === 'back to state a') {
            this.stateContext.setState(new StateA(this.stateContext));
        }
        else {
            this.stateContext.setState(new StateC(this.stateContext));
        }
    }
}