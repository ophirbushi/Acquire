import { Bank, Board, Player } from 'core';
import { TurnPhase } from '../turn-phase';
import { TurnOutcome } from './turn-outcome.model';

export class GameState {
    constructor(
        public players: Player[],
        public bank: Bank,
        public currentPlayerIndex: number,
        public board: Board,
        public turnOutcome: TurnOutcome,
        public turnPhase: TurnPhase,
        public turnNumber: number = 1
    ) { }
}
