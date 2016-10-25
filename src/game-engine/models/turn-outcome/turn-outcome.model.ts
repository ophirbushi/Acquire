import { Hotel, CoordinatesCard, Player } from 'core';

export class TurnOutcome {
    playedCoordinatesCard: CoordinatesCard;
    /** the player to take immediate action, not necessarily the current player (only relevant in merge - stock decisions) */
    subCurrentPlayer: Player;
    mergerHotel: Hotel;
    mergedHotels: Hotel[];
    /** whether or not the current player has decided to end the game after his turn */
    isGameEnd: boolean;
}
