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

// Route paths
export const RoutePath = {
    HOME: '/',
    PRICE_WHEEL: '/price-wheel',
    PUNISHMENT_WHEEL: '/punishment-wheel',
    RULES_WHEEL: '/rules-wheel',
    MUSIC_BINGO: '/music-bingo',
    QUIZ: '/quiz'
} as const;

export type RoutePathType = typeof RoutePath[keyof typeof RoutePath];
