import { Acquire } from './interfaces';

export const acquireInitialState: Acquire = {
    config: null,
    board: null,
    currentPlayerIndex: 0,
    phaseName: 'init',
    players: null,
    turnNumber: 0,
    coordinatesCards: null,
    chosenCoordinatesCard: null,
    chosenCoordinatesCardEffect: null,
    chosenCoordinatesCardLegalStatus: null,
    stocks: null
};
