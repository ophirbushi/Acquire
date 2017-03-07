import { Hotel, CoordinatesCard, Player } from 'core';

export class TurnOutcome {
    playedCoordinatesCard: CoordinatesCard;
    /** the player to take immediate action, not necessarily the current player (only relevant in merge - stock decisions) */
    subCurrentPlayerIndex: number;
    mergerHotelId: string;
    mergedHotelIds: string[];
    /** whether or not the current player has decided to end the game after his turn */
    isGameEnd: boolean;
}
