import { Acquire } from './store';

export interface InputProvider {
    getInput<T = any>(type: string, state: Acquire): Promise<T>;
}
