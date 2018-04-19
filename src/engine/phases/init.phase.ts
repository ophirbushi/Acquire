import { Phase } from './phase';
import { AcquireConfig } from '../store';

export const initPhase: Phase = async function (stateService, inputProvider, done) {
    const config = await inputProvider.getInput<AcquireConfig>(stateService.snapshot);
    stateService.loadConfig(config);
    stateService.init();
    done();
};
