export interface InputProvider {
    getInput<T = any>(): Promise<T>;
}
