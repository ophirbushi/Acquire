import { Acquire, AcquireConfig } from './interfaces';

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

export const acquireDefaultConfig: AcquireConfig = {
    boardHeight: 9,
    boardWidth: 12,
    hotels: [
        { name: 'Continental', prestige: 'expensive' },
        { name: 'Europlaza', prestige: 'expensive' },
        { name: 'Park', prestige: 'regular' },
        { name: 'Olympia', prestige: 'regular' },
        { name: 'Las Vegas', prestige: 'regular' },
        { name: 'Riviera', prestige: 'cheap' },
        { name: 'Holiday', prestige: 'cheap' }
    ],
    initialCashPerPlayer: 5000,
    playersCount: 4,
    stocksPerHotel: 24,
    unmergeableHotelSize: 11
};