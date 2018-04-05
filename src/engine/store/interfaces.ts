import { Player, Bank, Board } from '../../core';

export interface Acquire {
    players: Player[];
    bank: Bank;
    currentPlayerIndex: number;
    board: Board;
    phaseName: PhaseName;
    turnNumber: number;
}

export type PhaseName = 'init';
