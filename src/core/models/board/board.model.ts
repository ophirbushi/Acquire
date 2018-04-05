import { TileChain } from './tile-chain.model';

export interface Board {
    width: number;
    height: number;
    tileChains: TileChain[];
}
