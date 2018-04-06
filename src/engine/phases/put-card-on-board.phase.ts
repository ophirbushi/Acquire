import { Phase } from './phase';

export const putCardOnBoardPhase: Phase = function (stateService, inputProvider, done) {
    const { chosenCoordinatesCard } = stateService.snapshot;
    stateService.putCoordinatesCardOnBoard(chosenCoordinatesCard.coordinates);
    done();
};
