import { State } from './state.abstract';

export interface StateContext {
    setState(state: State): void;
}
