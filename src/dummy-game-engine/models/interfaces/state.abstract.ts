import { StateContext } from './state-context.interface';

export abstract class State {
    constructor(public name: string, protected stateContext: StateContext) { }

    abstract handleInput(input: any);
}
