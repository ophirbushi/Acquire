import { getCoordinatesCardEffect, isReplaceable } from '../core';
import { generateStore, Acquire, PhaseName } from './store';
import { InputProvider } from './input-provider';
import { Phase, initPhase, determineStarterPhase, chooseCardPhase, replaceCardPhase, putCardOnBoardPhase } from './phases';
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
                this.setPhase('determineStarter');
                break;
            case 'determineStarter':
                this.setPhase('chooseCard');
                break;
            case 'chooseCard':
                this.onChooseCardDone();
                break;
            case 'putCardOnBoard':
                break;
            default:
                throw new Error(`[GameEngine] unknown phaseName: ${phaseName}`);
        }
    }

    private registerPhases() {
        const pairs: PhasePair[] = [
            ['init', initPhase],
            ['determineStarter', determineStarterPhase],
            ['chooseCard', chooseCardPhase],
            ['replaceCard', replaceCardPhase],
            ['putCardOnBoard', putCardOnBoardPhase]
        ];
        pairs.forEach(pair => this.phases[pair[0]] = pair[1]);
    }

    private onChooseCardDone() {
        const { board, chosenCoordinatesCard, config } = this.snapshot;

        const replaceable = isReplaceable(board, chosenCoordinatesCard.coordinates, config.unmergeableHotelSize);
        if (replaceable) {
            this.setPhase('replaceCard');
        } else {
            this.setPhase('putCardOnBoard');
        }
    }
}