import { Reducer, Effects } from 'roxanne';

import { Acquire, GiveCoordinatesCardsToPlayerPayload, ChooseCoordinatesCardPayload } from './interfaces';
import { AcquireActions } from './actions';
import {
    Player, Coordinates, getCoordinatesCardEffect, getCoordinatesCardLegalStatus, Hotel, getTileChain, getNeighboringCoordinatesList,
    Board, getNeighboringTileChains
} from '../../core';
import { generateCoordinatesCards, generateStocksForPlayer } from './utils';
import { acquireInitialState, acquireDefaultConfig } from './init';

export const acquireReducer = new Reducer<Acquire, AcquireActions>(
    function (state, action, payload) {
        if (this.is('setPhaseName', action, payload)) {
            return { ...state, phaseName: payload };
        }
        if (this.is('loadConfig', action, payload)) {
            return { ...state, config: { ...acquireDefaultConfig, ...payload } };
        }
        if (this.is('init', action)) {
            return init(state);
        }
        if (this.is('setCurrentPlayerIndex', action, payload)) {
            return { ...state, currentPlayerIndex: payload };
        }
        if (this.is('endTurn', action)) {
            return endTurn(state);
        }
        if (this.is('giveCoordinatesCardsToPlayer', action, payload)) {
            return giveCoordinatesCardsToPlayer(state, payload);
        }
        if (this.is('chooseCoordinatesCard', action, payload)) {
            return chooseCoordinatesCard(state, payload);
        }
        if (this.is('putCoordinatesCardOnBoard', action)) {
            return putCoordinatesCardOnBoard(state);
        }
        return state;
    }
);

function endTurn(state: Acquire): Acquire {
    const { currentPlayerIndex, config } = state;
    const { chosenCoordinatesCard, chosenCoordinatesCardEffect, chosenCoordinatesCardLegalStatus } = acquireInitialState;
    const newRound = currentPlayerIndex >= config.playersCount - 1;
    return {
        ...state,
        chosenCoordinatesCard,
        chosenCoordinatesCardEffect,
        chosenCoordinatesCardLegalStatus,
        currentPlayerIndex: newRound ? 0 : currentPlayerIndex + 1,
        turnNumber: state.turnNumber++
    };
}

function giveCoordinatesCardsToPlayer(state: Acquire, payload: GiveCoordinatesCardsToPlayerPayload): Acquire {
    const { count, playerIndex } = payload;

    const players = state.players.slice();
    const coordinatesCards = state.coordinatesCards.slice();

    const player: Player = players[playerIndex];

    const cardsToGiveToPlayer = coordinatesCards.splice(0, count);
    player.coordinatesCards = player.coordinatesCards.concat(cardsToGiveToPlayer);

    return { ...state, players, coordinatesCards };
}

function init(state: Acquire): Acquire {
    let newState: Acquire = { ...state };

    newState = initBoard(newState);
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
    const stocks = generateStocksForPlayer(state.config);
    return { ...state, stocks };
}

function initPlayers(state: Acquire): Acquire {
    const { playersCount, initialCashPerPlayer } = state.config;

    const players: Player[] = [];

    for (let i = 0; i < playersCount; i++) {
        players.push({
            cash: initialCashPerPlayer,
            coordinatesCards: [],
            stocks: generateStocksForPlayer(state.config)
        });
    }

    return { ...state, players };
}

function initBoard(state: Acquire): Acquire {
    const { boardWidth, boardHeight } = state.config;
    return { ...state, board: { width: boardWidth, height: boardHeight, tileChains: [] } };
}

function chooseCoordinatesCard(state: Acquire, payload: ChooseCoordinatesCardPayload): Acquire {
    const { players, board, config } = state;
    const { playerIndex, cardIndex } = payload;

    const currentPlayer = players[playerIndex];
    const chosenCoordinatesCard = currentPlayer.coordinatesCards.splice(cardIndex, 1)[0];
    const chosenCoordinatesCardEffect = getCoordinatesCardEffect(board, chosenCoordinatesCard.coordinates);
    const chosenCoordinatesCardLegalStatus = getCoordinatesCardLegalStatus(
        board,
        chosenCoordinatesCard.coordinates,
        chosenCoordinatesCardEffect,
        {
            unmergeableHotelSize: config.unmergeableHotelSize,
            hotelsCount: config.hotels.length
        }
    );

    return {
        ...state,
        chosenCoordinatesCard,
        chosenCoordinatesCardEffect,
        chosenCoordinatesCardLegalStatus
    };
}

function putCoordinatesCardOnBoard(state: Acquire): Acquire {
    const { chosenCoordinatesCard, chosenCoordinatesCardEffect } = state;
    const { coordinates } = chosenCoordinatesCard;

    const board: Board = { ...state.board, tileChains: state.board.tileChains.slice() };

    if (chosenCoordinatesCardEffect === 'none') {
        board.tileChains.push({ coordinatesList: [coordinates], hotelName: Hotel.NEUTRAL });
    } else if (chosenCoordinatesCardEffect === 'enlarge') {
        const tileChain = getTileChain(board, coordinates);
        tileChain.coordinatesList.push(coordinates);
        getNeighboringTileChains(board, coordinates)
            .forEach((neighbor, index) => {
                tileChain.coordinatesList.push(...neighbor.coordinatesList.splice(0, neighbor.coordinatesList.length));
                board.tileChains.splice(index, 1);
            });
    } else {
        throw new Error('putCoordinatesCardOnBoard should only be called on "none" and "enlarge" effects');
    }

    return { ...state, board };
}
