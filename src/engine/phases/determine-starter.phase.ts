import { Phase } from './phase';
import { AcquireConfig } from '../store';
import { closestToA1 } from '../store/utils';

export const determineStarterPhase: Phase = async function (stateService, inputProvider, done) {
    const { players } = stateService.snapshot;

    players.forEach((p, i) => {
        stateService.giveCoordinatesCardsToPlayer({ playerIndex: i, count: 1 });
    });

    const index = closestToA1(players.map(p => p.coordinatesCards[0].coordinates));
    
    stateService.setCurrentPlayerIndex(index);

    done();
};
