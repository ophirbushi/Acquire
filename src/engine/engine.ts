import { generateStore, Acquire, PhaseName } from './store';
import { InputProvider } from './input-provider';
import { Phase, initPhase } from './phases';

type PhasePair = [PhaseName, Phase];

export class AcquireEngine {
    private readonly store = generateStore();
    private readonly phases: { [name: string]: Phase } = {};
    private get state(): Acquire { return this.store.value; }

    constructor(private readonly inputProvider: InputProvider) {
        this.registerPhases();
    }

    go() {
        this.setPhase(this.state.phaseName);
    }

    private setPhase(name: PhaseName) {
        this.store.dispatch('setPhaseName', name);
        const phase = this.phases[name];
        phase(this.store, this.inputProvider, this.onPhaseDone.bind(this));
    }

    private endTurn() {
        this.store.dispatch('endTurn', null);
    }

    private onPhaseDone() {
        const { phaseName } = this.state;

        switch (phaseName) {
            case 'init':
                break;
            default:
                throw new Error(`[GameEngine] unknown phaseName: ${phaseName}`);
        }
    }

    private registerPhases() {
        const pairs: PhasePair[] = [
            ['init', initPhase]
        ];
        pairs.forEach(pair => this.phases[pair[0]] = pair[1]);
    }
}