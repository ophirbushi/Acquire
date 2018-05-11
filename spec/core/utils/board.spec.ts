import {
    getActiveHotelNames, getCoordinatesCardEffect, getCoordinatesCardLegalStatus, getNeighboringCoordinatesList,
    getNeighboringTileChains, isMergeLegal, getTileChain, addTileChain, mergeTileChains, cloneBoard
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
            pushChain(Hotel.NEUTRAL, [0, 0], [1, 0]);
            pushChain('a', [3, 0]);
            pushChain('b', [0, 2], [1, 2], [2, 2]);
            result = getActiveHotelNames(board);
            expect(result).toEqual(['a', 'b']);
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
                pushChain(Hotel.NEUTRAL, [0, 0]);
                pushChain('Palmas', [0, 4], [1, 4]);
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
                pushChain('Palmas', [0, 4], [1, 4], [2, 4]);
                pushChain('Casablanca', [1, 2], [2, 2]);
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

                pushChain('Plaza', [3, 3], [4, 3]);

                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 3 });
                expect(result).toBe('legal');
            });

            it('should return "replaceable" if more than one merged hotel has reached unmergeableHotelSize', () => {
                pushChain('Plaza', [3, 3], [4, 3], [5, 3]);

                result = getCoordinatesCardLegalStatus(board, coordinates, 'merge',
                    { hotelsCount: 7, unmergeableHotelSize: 3 });
                expect(result).toBe('replaceable');
            });
        });
    });

    describe('getNeighboringCoordinatesList', () => {

        it('should not include the input coordinate', () => {
            expectOutputOf({ x: 0, y: 0 }).not.to.include({ x: 0, y: 0 });
        });

        it('should include the coordinate above', () => {
            expectOutputOf({ x: 0, y: 1 }).to.include({ x: 0, y: 0 });
        });

        it('should not include the coordinate above if it is outside the board', () => {
            expectOutputOf({ x: 0, y: 0 }).not.to.include({ x: 0, y: -1 });
        });

        it('should include the coordinate to the right', () => {
            expectOutputOf({ x: 0, y: 0 }).to.include({ x: 1, y: 0 });
        });

        it('should not include the coordinate to the right if it is outside the board', () => {
            expectOutputOf({ x: board.width - 1, y: 0 }).not.to.include({ x: board.width, y: 0 });
        });

        it('should include the coordinate below', () => {
            expectOutputOf({ x: 0, y: 1 }).to.include({ x: 0, y: 2 });
        });

        it('should not include the coordinate below if it is outside the board', () => {
            expectOutputOf({ x: 0, y: board.height - 1 }).not.to.include({ x: 0, y: board.height });
        });

        it('should include the coordinate to the left', () => {
            expectOutputOf({ x: 1, y: 0 }).to.include({ x: 0, y: 0 });
        });

        it('should not include the coordinate to the left if it is outside the board', () => {
            expectOutputOf({ x: 0, y: 0 }).not.to.include({ x: -1, y: 0 });
        });

        function expectOutputOf(input: Coordinates) {
            return {
                to: { include },
                not: { to: { include: notInclude } }
            };

            function include(output: Coordinates, shouldInclude: boolean = true) {
                expect(getNeighboringCoordinatesList(board, input).some(hasCoordinate(output))).toBe(shouldInclude);
            }

            function notInclude(output: Coordinates) {
                include(output, false);
            }

            function hasCoordinate(coordinate: Coordinates): (c: Coordinates) => boolean {
                return (c: Coordinates) => c.x === coordinate.x && c.y === coordinate.y;
            }
        }
    });

    describe('getNeighboringTileChains', () => {

        it('should return an empty array if no neighbors', () => {
            expect(getNeighboringTileChains(board, { x: 1, y: 1 })).toEqual([]);
        });

        it('should return only the neighboring chains of a coordinate', () => {
            pushChain('a', [0, 1]);
            pushChain('b', [1, 0]);
            pushChain('c', [2, 1]);
            pushChain('d', [1, 2]);
            pushChain('e', [2, 2]);

            const result = getNeighboringTileChains(board, { x: 1, y: 1 });

            ['a', 'b', 'c', 'd'].forEach(name => expect(result.some(chain => chain.hotelName === name)).toBe(true));
            expect(result.some(chain => chain.hotelName === 'e')).toBe(false);
        });

        it('should add a chain only once to the result even if it borders the input in more than 1 tile', () => {
            pushChain('a', [0, 0], [0, 1], [1, 0]);
            pushChain('b', [1, 2]);

            const result = getNeighboringTileChains(board, { x: 1, y: 1 });

            ['a', 'b'].forEach(name => expect(result.some(chain => chain.hotelName === name)).toBe(true));
            expect(result.length).toBe(2);
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
            pushChain(Hotel.NEUTRAL, [0, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('setUp');

            pushChain('Palmas', [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('setUp');
        });

        it('should return "enlarge" if tile neighbors only one non NEUTRAL hotel', () => {
            pushChain('Palmas', [0, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('enlarge');

            pushChain(Hotel.NEUTRAL, [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('enlarge');

            pushChain('Casablanca', [1, 1]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('enlarge');
        });

        it('should return "merge" if tile neighbors more than one non NEUTRAL hotel', () => {
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('merge');

            pushChain('Palmas', [0, 0]);
            expect(result).not.toBe('merge');

            pushChain(Hotel.NEUTRAL, [2, 0]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).not.toBe('merge');

            pushChain('Casablanca', [1, 1]);
            result = getCoordinatesCardEffect(board, { x: 1, y: 0 });
            expect(result).toBe('merge');
        });
    });

    describe('isMergeLegal', () => {
        let unmergeableSize: number;

        beforeEach(() => {
            unmergeableSize = undefined;
            pushChain(Hotel.NEUTRAL, [0, 0], [1, 0], [2, 0]);
            pushChain('a', [0, 2], [1, 2]);
            pushChain('b', [0, 4], [1, 4], [2, 4]);
        });

        it('should return true if number of non-neutral hotels is less than 2', () => {
            unmergeableSize = 2;
            expect(isMergeLegal(board, { x: 0, y: 1 }, unmergeableSize)).toBe(true);
        });

        it('should return true if number of unmergeable non-neutral hotels is less than 2', () => {
            unmergeableSize = 3;
            expect(isMergeLegal(board, { x: 0, y: 3 }, unmergeableSize)).toBe(true);
        });

        it('should return false if number of unmergeable non-neutral hotels is more than 1', () => {
            unmergeableSize = 2; 
            expect(isMergeLegal(board, { x: 0, y: 3 }, unmergeableSize)).toBe(false);
        });
    });

    function resetBoard() {
        board = { width: 7, height: 7, tileChains: [] };
    }

    function pushChain(hotelName: string, ...coords: [number, number][]): void {
        board.tileChains.push({ hotelName, coordinatesList: coords.map(([x, y]) => ({ x, y })) });
    }
});

