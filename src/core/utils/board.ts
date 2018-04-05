import { Board, Coordinates, TileChain, CoordinatesCardEffect } from '../models';

export function getNeighboringCoordinatesList(board: Board, coordinates: Coordinates): Coordinates[] {
    const coordinatesList: Coordinates[] = [];

    const above = new Coordinates(coordinates.x, coordinates.y - 1),
        right = new Coordinates(coordinates.x + 1, coordinates.y),
        below = new Coordinates(coordinates.x, coordinates.y + 1),
        left = new Coordinates(coordinates.x - 1, coordinates.y);

    if (above.y >= 0) {
        coordinatesList.push(above);
    }
    if (right.x < board.width) {
        coordinatesList.push(right);
    }
    if (below.y < board.height) {
        coordinatesList.push(below);
    }
    if (left.x >= 0) {
        coordinatesList.push(left);
    }

    return coordinatesList;
}

export function getTileChain(board: Board, coordinates: Coordinates): TileChain | undefined {
    return board.tileChains.find(tileChain => tileChain.coordinatesList.indexOf(coordinates) > -1);
}

export function getNeighboringTileChains(board: Board, coordinates: Coordinates): TileChain[] {
    const neighboringTileChains: TileChain[] = [];

    const neighboringCoordinatesList = getNeighboringCoordinatesList(board, coordinates);

    neighboringCoordinatesList.forEach((neighboringCoordinates) => {
        const tileChain = getTileChain(board, neighboringCoordinates);

        if (tileChain !== undefined && !neighboringTileChains.some(alreadyInListTileChain => tileChain.id === alreadyInListTileChain.id)) {
            neighboringTileChains.push(tileChain);
        }
    });

    return neighboringTileChains;
}

export function getCoordinatesCardEffect(board: Board, coordinates: Coordinates): CoordinatesCardEffect {
    const neighboringTileChains = getNeighboringTileChains(board, coordinates);

    // no neighboring chains
    if (neighboringTileChains.length === 0) {
        return CoordinatesCardEffect.None;
    }
    // all neighboring chains do not have hotelId
    else if (neighboringTileChains.every(neighboringTileChain => neighboringTileChain.hotelId === undefined)) {
        return CoordinatesCardEffect.SetUp;
    }
    // not all neighboring chains have the same hotelId
    else if (neighboringTileChains.some(neighboringTileChain => neighboringTileChains[0].hotelId !== neighboringTileChain.hotelId)) {
        return CoordinatesCardEffect.Merge;
    }
    // only 1 neighboring chain with hotelId
    else if (neighboringTileChains.length === 1 && neighboringTileChains[0].hotelId !== undefined) {
        return CoordinatesCardEffect.Enlarge;
    }

    // should not have reached here
    throw new Error('error at getCoordinatesCardEffect method');
}
