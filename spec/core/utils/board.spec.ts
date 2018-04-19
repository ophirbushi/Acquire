import {
    getActiveHotelNames, getCoordinatesCardEffect, getCoordinatesCardLegalStatus,
    getNeighboringCoordinatesList, getNeighboringTileChains, isMergeLegal, getTileChain
} from '../../../src/core/utils';
import { Hotel, CoordinatesCardEffect, Board, Coordinates, CoordinatesCardLegalStatus } from '../../../src/core/models';

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

        it('should return "merge" if tile neighbors more than one non NEUTRAL hotel', () => {
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('merge');

            addTileChain('Palmas', [0, 0]);
            expect(result).not.toBe('merge');

            addTileChain(Hotel.NEUTRAL, [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('merge');

            addTileChain('Casablanca', [1, 1]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('merge');
        });
    });

    describe('getCoordinatesCardLegalStatus', () => {
        let result: CoordinatesCardLegalStatus;

        beforeEach(() => {
            result = undefined;
        });

        it('should return "legal" for any non "merge" or "setUp" effects', () => {
            result = getCoordinatesCardLegalStatus(null, null, 'none', null);
            expect(result).toBe('legal');

            result = undefined;

            result = getCoordinatesCardLegalStatus(null, null, 'enlarge', null);
            expect(result).toBe('legal');
        });

        describe('setUp case', () => {
            const coordinates: Coordinates = { x: 0, y: 1 };

            beforeEach(() => {
                addTileChain(Hotel.NEUTRAL, [0, 0]);
                addTileChain('Palmas', [0, 4], [1, 4]);
            });

            it('should return "legal" if amount of active hotels is lower than total hotels count', () => {
                result = getCoordinatesCardLegalStatus(board, coordinates, 'setUp',
                    { hotelsCount: 7, unmergeableHotelSize: 11 });
                expect(result).toBe('legal');
            });

            it('should return "currentlyIllegal" if amount of active hotels is equal to total hotels count', () => {
                result = getCoordinatesCardLegalStatus(board, coordinates, 'setUp',
                    { hotelsCount: 1, unmergeableHotelSize: 11 });
                expect(result).toBe('currentlyIllegal');
            });
        });

        describe('merge case', () => {
            const coordinates: Coordinates = { x: 2, y: 3 };

            beforeEach(() => {
                addTileChain('Palmas', [0, 4], [1, 4], [2, 4]);
                addTileChain('Casablanca', [1, 2], [2, 2]);
            });

            it('should return "legal" if all merged hotels are below unmergeableHotelSize', () => {
                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 11 });
                expect(result).toBe('legal');
            });

            it('should return "legal" if only one merged hotel has reached unmergeableHotelSize', () => {
                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 3 });
                expect(result).toBe('legal');

                addTileChain('Plaza', [3, 3], [4, 3]);

                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 3 });
                expect(result).toBe('legal');
            });

            it('should return "replaceable" if more than one merged hotel has reached unmergeableHotelSize', () => {
                addTileChain('Plaza', [3, 3], [4, 3], [5, 3]);

                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 3 });
                expect(result).toBe('replaceable');
            });
        });
    });

    function resetBoard() {
        board = { width: 7, height: 7, tileChains: [] };
    }

    function addTileChain(hotelName: string, ...coords: [number, number][]): void {
        board.tileChains.push({ hotelName, coordinatesList: coords.map(([x, y]) => ({ x, y })) });
    }
});

