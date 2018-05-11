import { Observable } from 'rxjs/Observable';
import { Store } from 'roxanne';

import { Acquire, AcquireActions, generateStore, AcquireConfig, PhaseName, GiveCoordinatesCardsToPlayerPayload, ChooseCoordinatesCardPayload } from './store';
import { Coordinates } from '../core';

export class StateService {

    // public only for dev purposes. should be private when done.
    public readonly store: Store<Acquire, AcquireActions> = generateStore();

    get snapshot(): Acquire { return this.store.value; }

    select<T>(mapFn: (state: Acquire) => T): Observable<T>;
    select<K extends keyof Acquire>(key: K): Observable<Acquire[K]>;
    select(selector) {
        return this.store.select(selector);
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

    giveCoordinatesCardsToPlayer(payload: GiveCoordinatesCardsToPlayerPayload) {
        this.store.dispatch('giveCoordinatesCardsToPlayer', payload);
    }

    setCurrentPlayerIndex(index: number) {
        this.store.dispatch('setCurrentPlayerIndex', index);
    }

    chooseCoordinatesCard(payload: ChooseCoordinatesCardPayload) {
        this.store.dispatch('chooseCoordinatesCard', payload);
    }

    setupHotel(index: number) {
        this.store.dispatch('setupHotel', index);
    }

    putCoordinatesCardOnBoard() {
        this.store.dispatch('putCoordinatesCardOnBoard', null);
    }
}
