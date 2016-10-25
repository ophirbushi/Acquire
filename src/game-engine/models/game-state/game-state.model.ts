import { Player, Bank, Board } from 'models';
import { TurnPhase } from '../../turn-phase';
import { TurnOutcome } from '../turn-outcome';

export class GameState {
    constructor(
        public bank: Bank,
        public players: Player[],
        public currentPlayer: Player,
        public board: Board,
        public turnPhase: TurnPhase,
        public turnOutcome: TurnOutcome
    ) { }
}
