import { Acquire } from './store';

export interface InputProvider {
    getInput<T = any>(state: Acquire): Promise<T>;
}
