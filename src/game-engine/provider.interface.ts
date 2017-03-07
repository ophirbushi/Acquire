import { Type } from './type.interface';

export interface Provider {
    provide<T>(token: Type<T>): T;
}