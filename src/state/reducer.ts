import { Reducer } from 'roxanne';

import { Acquire } from './interfaces';
import { AcquireActions } from './actions';

export const acquireReducer = new Reducer<Acquire, AcquireActions>(
    function (state, action, payload) {
        return state;
    }
);
