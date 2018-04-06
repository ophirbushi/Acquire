import { Player, Board, CoordinatesCard, Stocks, Hotel } from '../../core';

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
    stocks: Stocks;
}

export interface AcquireConfig {
    playersCount: number;
    initialCashPerPlayer: number;
    boardWidth: number;
    boardHeight: number;
    stocksPerHotel: number;
    hotels: Hotel[];
}

export type PhaseName = 'init' | 'determineStarter' | 'chooseCard';

export interface GiveCoordinatesCardsToPlayerPayload {
    count: number;
    playerIndex: number;
}

export interface ChooseCoordinatesCardPayload {
    playerIndex: number;
    cardIndex: number;
}