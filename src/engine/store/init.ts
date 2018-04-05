import { Acquire } from './interfaces';

export const acquireInitialState: Acquire = {
    config: null,
    board: null,
    currentPlayerIndex: null,
    phaseName: 'init',
    players: null,
    turnNumber: null,
    coordinatesCards: null,
    discardedCoordinatesCards: null,
    stocks: null
};
