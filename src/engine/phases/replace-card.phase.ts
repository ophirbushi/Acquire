import { Phase } from './phase';

export const replaceCardPhase: Phase = function (stateService, inputProvider, done) {
    const { currentPlayerIndex } = stateService.snapshot;
    stateService.giveCoordinatesCardsToPlayer({ playerIndex: currentPlayerIndex, count: 1 });
    done();
};
