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

// Quiz types
export interface QuizQuestion {
    id: string;
    type: 'multiple-choice' | 'text' | 'image';
    question: string;
    options?: string[]; // For flervalgsspørsmål
    imageUrl?: string;  // For bildespørsmål
    answer: string;     // Kryptert svar
}

export interface QuizConfig {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    passwordHash?: string;  // Hash of the password for this quiz
}

export interface UserAnswer {
    questionId: string;
    answer: string;
}

export interface QuizAttempt {
    quizId: string;
    timestamp: number;
    answers: UserAnswer[];
}

// Board game types
export type SpaceType =
    | 'start'
    | 'finish'
    | 'trivia'
    | 'chance'
    | 'music-bingo'
    | 'instant-prize'
    | 'random-wheel'
    | 'cheers'
    | 'drink-sips'
    | 'give-sips';

export interface GameSpace {
    id: string;
    type: SpaceType;
    color: string;
    position: {
        x: number;
        y: number;
    };
    // Additional properties based on type
    triviaQuestion?: {
        questionId: string;
        reward: 'prize' | 'punishment' | 'none';
    };
    chanceOutcome?: string; // Text instruction for chance spaces
    sipsCount?: number;     // For drink-sips and give-sips spaces
    icon?: string;          // Icon to display on the space
    label?: string;         // Text label for the space
}

export interface Player {
    id: string;
    name: string;
    position: number; // Index of the current space
    color: string;
}

export interface BoardGameState {
    spaces: GameSpace[];
    players: Player[];
    currentPlayerIndex: number;
    gameStarted: boolean;
}

// Route paths
export const RoutePath = {
    HOME: '/',
    PRICE_WHEEL: '/price-wheel',
    PUNISHMENT_WHEEL: '/punishment-wheel',
    RULES_WHEEL: '/rules-wheel',
    MUSIC_BINGO: '/music-bingo',
    QUIZ: '/quiz',
    BOARD_GAME: '/board-game'
} as const;

export type RoutePathType = typeof RoutePath[keyof typeof RoutePath];
