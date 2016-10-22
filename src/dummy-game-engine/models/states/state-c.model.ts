import { State, StateContext } from '../interfaces';
import { StateA } from './state-a.model';
import { StateB } from './state-b.model';

export class StateC extends State {
    constructor(stateContext: StateContext) {
        super('StateC', stateContext);
    }

    handleInput(input: string) {
        if (input === 'back to state b') {
            this.stateContext.setState(new StateB(this.stateContext));
        }
        else {
            this.stateContext.setState(new StateA(this.stateContext));
        }
    }
}