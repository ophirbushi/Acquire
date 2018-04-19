import {
    getActiveHotelNames, getCoordinatesCardEffect, getCoordinatesCardLegalStatus,
    getNeighboringCoordinatesList, getNeighboringTileChains, isMergeLegal, getTileChain
} from '../../../src/core/utils';
import { Hotel, CoordinatesCardEffect, Board, Coordinates } from '../../../src/core/models';

describe('board utils', () => {
    let board: Board;

    beforeEach(() => {
        resetBoard();
    });

    describe('getActiveHotelNames', () => {
        let result: string[];

        beforeEach(() => {
            result = undefined;
        });

        it('should return all hotel names on board which are not NEUTRAL', () => {
            addTileChain(Hotel.NEUTRAL, [0, 0], [1, 0]);
            addTileChain('a', [3, 0]);
            addTileChain('b', [0, 2], [1, 2], [2, 2]);
            result = getActiveHotelNames(board);
            expect(result).toEqual(['a', 'b']);
        });
    });

    describe('getCoordinatesCardEffect', () => {
        let result: CoordinatesCardEffect;

        beforeEach(() => {
            result = undefined;
        });

        it('should return "none" if tile is not neighboring any chain', () => {
            result = getCoordinatesCardEffect(board, { x: 0, y: 0 });
            expect(result).toBe('none');
        });

        it('should return "setUp" if tile is surrounded only by NEUTRAL chains', () => {
            addTileChain(Hotel.NEUTRAL, [0, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('setUp');

            addTileChain('Palmas', [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('setUp');
        });

        it('should return "enlarge" if tile neighbors only one non NEUTRAL hotel', () => {
            addTileChain('Palmas', [0, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('enlarge');

            addTileChain(Hotel.NEUTRAL, [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('enlarge');

            addTileChain('Casablanca', [1, 1]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('enlarge');
        });
    });

    function resetBoard() {
        board = { width: 5, height: 5, tileChains: [] };
    }

    function addTileChain(hotelName: string, ...coords: [number, number][]): void {
        board.tileChains.push({ hotelName, coordinatesList: coords.map(([x, y]) => ({ x, y })) });
    }
});

