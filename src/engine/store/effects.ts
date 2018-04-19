import { Effects } from 'roxanne';

import { Acquire } from './interfaces';
import { AcquireActions } from './actions';
import { shuffle } from './utils';

import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

// import * as fs from 'fs';
import { diff } from 'deep-object-diff';

// const ws = fs.createWriteStream('./log.json');
// ws.write('[');
// setTimeout(() => {
//     ws.write('""]');
// }, 1000); 
export const acquireEffects = new Effects<Acquire, AcquireActions>(
    function () {
        this.ofType('init')
            .subscribe(() => {
                shuffle(this.store.value.coordinatesCards);
            });

        // let lastState = this.store.value;

        // this.store.actions$
        //     .pipe(withLatestFrom(this.store))
        //     .subscribe(([action, state]) => {
        //         const extended = { ...action, diff: diff(lastState, state) };
        //         ws.write(JSON.stringify(extended) + ',');
        //         lastState = state;
        //     });
        // this.store.actions$.subscribe(state => ws.write(JSON.stringify(state) + ','));
    }
);
