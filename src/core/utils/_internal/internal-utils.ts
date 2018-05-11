export function naiveDeDupe<T>(item: T, index: number, a: T[]): boolean {
    return a.indexOf(item) === index;
}
