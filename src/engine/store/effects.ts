import { Effects } from 'roxanne';

import { Acquire } from './interfaces';
import { AcquireActions } from './actions';
import { shuffle } from './utils';

export const acquireEffects = new Effects<Acquire, AcquireActions>(
    function () {
        this.ofType('init')
            .subscribe(() => shuffle(this.store.value.coordinatesCards));
    }
);
