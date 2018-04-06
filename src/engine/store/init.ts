import { Acquire } from './interfaces';

export const acquireInitialState: Acquire = {
    config: null,
    board: null,
    currentPlayerIndex: 0,
    phaseName: 'init',
    players: null,
    turnNumber: null,
    coordinatesCards: null,
    discardedCoordinatesCards: null,
    chosenCoordinatesCard: null,
    stocks: null
};
