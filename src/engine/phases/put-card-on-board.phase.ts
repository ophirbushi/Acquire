import { getCoordinatesCardEffect } from '../../core/utils';
import { Phase } from './phase';

export const putCardOnBoardPhase: Phase = function (stateService, inputProvider, done) {
    stateService.putCoordinatesCardOnBoard();
    done();
};
