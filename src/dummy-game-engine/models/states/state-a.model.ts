import { State, StateContext } from '../interfaces';
import { StateB } from './state-b.model';
import { StateC } from './state-c.model';

export class StateA extends State {
    constructor(stateContext: StateContext) {
        super('StateA', stateContext);
    }

    handleInput(input: string) {
        if (input === 'skip to state c') {
            this.stateContext.setState(new StateC(this.stateContext));
        }
        else {
            this.stateContext.setState(new StateB(this.stateContext));
        }
    }
}