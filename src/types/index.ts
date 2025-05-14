// Wheel item type
export interface WheelItem {
    id: string;
    text: string;
    icon: string;
    color: string;
}

// Bingo types
export interface BingoSquare {
    id: string;
    songTitle: string;
    marked: boolean;
}

export type BoardSize = '3x3' | '4x4' | '5x5';

// Route paths
export const RoutePath = {
    HOME: '/',
    PRICE_WHEEL: '/price-wheel',
    PUNISHMENT_WHEEL: '/punishment-wheel',
    RULES_WHEEL: '/rules-wheel',
    MUSIC_BINGO: '/music-bingo'
} as const;

export type RoutePathType = typeof RoutePath[keyof typeof RoutePath];
