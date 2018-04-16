import { Player, Board, CoordinatesCard, Stocks, Hotel, CoordinatesCardEffect, CoordinatesCardLegalStatus } from '../../core';

export interface Acquire {
    config: AcquireConfig;
    players: Player[];
    currentPlayerIndex: number;
    board: Board;
    phaseName: PhaseName;
    turnNumber: number;
    coordinatesCards: CoordinatesCard[];
    discardedCoordinatesCards: CoordinatesCard[];
    chosenCoordinatesCard: CoordinatesCard;
    chosenCoordinatesCardEffect: CoordinatesCardEffect;
    chosenCoordinatesCardLegalStatus: CoordinatesCardLegalStatus;
    stocks: Stocks;
}

export interface AcquireConfig {
    playersCount: number;
    initialCashPerPlayer: number;
    boardWidth: number;
    boardHeight: number;
    stocksPerHotel: number;
    unmergeableHotelSize: number;
    hotels: Hotel[];
}

export type PhaseName = 'init' | 'determineStarter' | 'chooseCard' | 'replaceCard' | 'putCardOnBoard' |
    'setUp' | 'merge';

export interface GiveCoordinatesCardsToPlayerPayload {
    count: number;
    playerIndex: number;
}

export interface ChooseCoordinatesCardPayload {
    playerIndex: number;
    cardIndex: number;
}
