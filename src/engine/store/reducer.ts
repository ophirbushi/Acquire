import { Reducer } from 'roxanne';

import { Acquire, GiveCoordinatesCardsToPlayerPayload } from './interfaces';
import { AcquireActions } from './actions';
import { Player } from 'core';
import { generateCoordinatesCards, generateStocks } from './utils';

export const acquireReducer = new Reducer<Acquire, AcquireActions>(
    function (state, action, payload) {
        if (this.is('setPhaseName', action, payload)) {
            return { ...state, phaseName: payload };
        }
        if (this.is('loadConfig', action, payload)) {
            return { ...state, config: payload };
        }
        if (this.is('init', action)) {
            return init(state);
        }
        if (this.is('endTurn', action)) {
            return endTurn(state);
        }
        if (this.is('giveCoordinatesCardsToPlayer', action, payload)) {
            return giveCoordinatesCardsToPlayer(state, payload);
        }
        return state;
    }
);

function endTurn(state: Acquire): Acquire {
    const { currentPlayerIndex, config } = state;
    const newRound = currentPlayerIndex >= config.playersCount - 1;
    return { ...state, currentPlayerIndex: newRound ? 0 : currentPlayerIndex + 1 };
}

function giveCoordinatesCardsToPlayer(state: Acquire, payload: GiveCoordinatesCardsToPlayerPayload): Acquire {
    const { players, coordinatesCards } = state;
    const { count, playerIndex } = payload;

    const player = players[playerIndex];

    const cardsToGiveToPlayer = coordinatesCards.splice(0, count);
    player.coordinatesCards.concat(cardsToGiveToPlayer);

    return state;
}

function init(state: Acquire): Acquire {
    let newState: Acquire = { ...state };

    newState = initCoordinatesCards(newState);
    newState = initStocks(newState);
    newState = initPlayers(newState);

    return newState;
}

function initCoordinatesCards(state: Acquire): Acquire {
    const coordinatesCards = generateCoordinatesCards(state.config);
    return { ...state, coordinatesCards };
}

function initStocks(state: Acquire): Acquire {
    const stocks = generateStocks(state.config);
    return { ...state, stocks };
}

function initPlayers(state: Acquire): Acquire {
    const { playersCount, initialCashPerPlayer } = state.config;

    const players: Player[] = [];

    for (let i = 0; i < playersCount; i++) {
        players.push({ cash: initialCashPerPlayer, coordinatesCards: [], stockCards: [] });
    }

    return { ...state, players };
}
