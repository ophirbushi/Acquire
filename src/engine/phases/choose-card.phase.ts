import { Phase } from './phase';

export const chooseCardPhase: Phase = async function (stateService, inputProvider, done) {
    const { currentPlayerIndex } = stateService.snapshot;
    const cardIndex = await inputProvider.getInput<number>('coordinatesCard', stateService.snapshot);
    stateService.chooseCoordinatesCard({ playerIndex: currentPlayerIndex, cardIndex });
    done();
};
