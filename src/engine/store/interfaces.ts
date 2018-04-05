import { Player, Board, CoordinatesCard, StockCard } from '../../core';

export interface Acquire {
    config: AcquireConfig;
    players: Player[];
    currentPlayerIndex: number;
    board: Board;
    phaseName: PhaseName;
    turnNumber: number;
    coordinatesCards: CoordinatesCard[];
    discardedCoordinatesCards: CoordinatesCard[];
    stockCards: StockCard[];
    discardedStockCards: StockCard[];
}

export interface AcquireConfig {
    playersCount: number;
    initialCashPerPlayer: number;
    boardWidth: number;
    boardHeight: number;
}

export type PhaseName = 'init';

export interface GiveCoordinatesCardsToPlayerPayload {
    count: number;
    playerIndex: number;
}
