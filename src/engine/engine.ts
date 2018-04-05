import { generateStore, Acquire, PhaseName } from './store';
import { InputProvider } from './input-provider';
import { Phase, initPhase } from './phases';
import { StateService } from './state.service';

type PhasePair = [PhaseName, Phase];

export class AcquireEngine {
    private readonly stateService = new StateService();
    private readonly phases: { [name: string]: Phase } = {};
    private get snapshot(): Acquire { return this.stateService.snapshot; }

    constructor(private readonly inputProvider: InputProvider) {
        this.registerPhases();
    }

    go() {
        this.setPhase(this.snapshot.phaseName);
    }

    private setPhase(phaseName: PhaseName) {
        this.stateService.setPhaseName(phaseName);
        const phase = this.phases[phaseName];
        phase(this.stateService, this.inputProvider, this.onPhaseDone.bind(this));
    }

    private onPhaseDone() {
        const { phaseName } = this.snapshot;

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