import { Bank, Board, Player } from 'core';
import { TurnPhaseId } from '../turn-phase';
import { TurnOutcome } from './turn-outcome.model';

export class GameState {
    constructor(
        public players: Player[],
        public bank: Bank,
        public currentPlayerIndex: number,
        public board: Board,
        public turnOutcome: TurnOutcome,
        public turnPhaseId: TurnPhaseId,
        public turnNumber: number = 1
    ) { }
}
