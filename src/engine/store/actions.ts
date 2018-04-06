import { Coordinates } from 'core';
import { PhaseName, AcquireConfig, GiveCoordinatesCardsToPlayerPayload, ChooseCoordinatesCardPayload } from './interfaces';

export interface AcquireActions {
    setPhaseName: PhaseName;
    loadConfig: AcquireConfig;
    init: null;
    giveCoordinatesCardsToPlayer: GiveCoordinatesCardsToPlayerPayload;
    chooseCoordinatesCard: ChooseCoordinatesCardPayload;
    putCoordinatesCardOnBoard: Coordinates;
    endTurn: null;
    setCurrentPlayerIndex: number;
}
