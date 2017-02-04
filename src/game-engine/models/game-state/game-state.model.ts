import { Player, Bank, Board } from 'core';
import { TurnPhase } from '../../turn-phase';
import { TurnOutcome } from '../turn-outcome';

export class GameState {
    constructor(
        public bank: Bank,
        public players: Player[],
        public currentPlayer: Player,
        public board: Board,
        public turnOutcome: TurnOutcome,
        public turnPhase: TurnPhase,
        public turnNumber: number = 1
    ) { }
}
