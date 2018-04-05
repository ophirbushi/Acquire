import { Store } from 'roxanne';

import { Acquire } from './interfaces';
import { AcquireActions } from './actions';
import { acquireInitialState } from './init';
import { acquireReducer } from './reducer';
import { acquireEffects } from './effects';

export function generateStore(): Store<Acquire, AcquireActions> {
    return new Store<Acquire, AcquireActions>(acquireInitialState, acquireReducer, acquireEffects);
} 
