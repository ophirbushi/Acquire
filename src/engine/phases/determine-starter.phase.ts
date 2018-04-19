import { Phase } from './phase';
import { closestToA1 } from '../store/utils';

export const determineStarterPhase: Phase = function (stateService, inputProvider, done) {
    const { players, config } = stateService.snapshot;

    players.forEach((p, i) => {
        stateService.giveCoordinatesCardsToPlayer({ playerIndex: i, count: 1 });
    });

    const index = closestToA1(players.map(p => p.coordinatesCards[0].coordinates));

    stateService.setCurrentPlayerIndex(index);

    players.forEach((p, i) => {
        stateService.giveCoordinatesCardsToPlayer({ playerIndex: i, count: config.coordinatesCardsPerPlayer });
    });

    done();
};
