import { Phase } from './phase';

export const setupPhase: Phase = async function (stateService, inputProvider, done) {
    const { currentPlayerIndex } = stateService.snapshot;
    const hotelIndex = await inputProvider.getInput<number>(stateService.snapshot);
    stateService.setupHotel(hotelIndex);
    done();
};
