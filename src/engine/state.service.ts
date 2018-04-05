import { Observable } from 'rxjs/Observable';
import { Store } from 'roxanne';

import { Acquire, AcquireActions, generateStore, AcquireConfig, PhaseName } from './store';

export class StateService {

    private readonly store: Store<Acquire, AcquireActions> = generateStore();

    get snapshot(): Acquire { return this.store.value; }

    select<K extends keyof Acquire>(key: K): Observable<Acquire[K]> {
        return this.store.select(key);
    }

    setPhaseName(phaseName: PhaseName) {
        this.store.dispatch('setPhaseName', phaseName);
    }

    loadConfig(config: AcquireConfig) {
        this.store.dispatch('loadConfig', config);
    }

    init() {
        this.store.dispatch('init', null);
    }

    endTurn() {
        this.store.dispatch('endTurn', null);
    }
}