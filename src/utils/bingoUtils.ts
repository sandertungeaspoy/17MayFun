import type { BingoSquare, BoardSize } from '../types';

// Sample list of songs for the music bingo
export const bingoSongs = [
    'Ja, vi elsker dette landet', // Norwegian national anthem
    'Norge i rødt, hvitt og blått',
    'Alle fugler små de er',
    'Blåfjell 2: Når noen blir igjen',
    'Postgirobygget - En solskinnsdag',
    'Jahn Teigen - Mil etter mil',
    'a-ha - Take On Me',
    'Kygo - Firestone',
    'Sigrid - Mirror',
    'Karpe - Gunerius',
    'Gabrielle - Ring meg',
    'Astrid S - Hurts So Good',
    'DDE - Vinsjan på kaia',
    'Hellbillies - Liten by',
    'Seigmen - Hjernen er alene',
    'Röyksopp - Eple',
    'Datarock - Fa-Fa-Fa',
    'Katzenjammer - A Bar in Amsterdam',
    'Kaizers Orchestra - Kontroll på kontinentet',
    'Sissel Kyrkjebø - Solvguttene',
    'Madcon - Beggin',
    'Alan Walker - Faded',
    'Ylvis - The Fox',
    'Marcus & Martinus - Elektrisk',
    'Aurora - Runaway'
];

// Function to get the number of squares based on board size
export const getBoardDimensions = (size: BoardSize): { rows: number; cols: number } => {
    switch (size) {
        case '3x3':
            return { rows: 3, cols: 3 };
        case '4x4':
            return { rows: 4, cols: 4 };
        case '5x5':
            return { rows: 5, cols: 5 };
        default:
            return { rows: 3, cols: 3 }; // Default to 3x3
    }
};

// Function to generate a bingo board with unique songs
export const generateBingoBoard = (size: BoardSize, userId: string): BingoSquare[] => {
    const { rows, cols } = getBoardDimensions(size);
    const totalSquares = rows * cols;

    // Use the userId as a seed for the random selection to ensure the same user
    // always gets the same board (for persistence)
    const seedRandom = (seed: string): () => number => {
        // Simple hash function to convert string to number
        const hash = seed.split('').reduce((acc, char) => {
            return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
        }, 0);

        // Simple seeded random function
        let state = Math.abs(hash);
        return () => {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        };
    };

    const random = seedRandom(userId);

    // Shuffle songs using the seeded random function
    const shuffledSongs = [...bingoSongs].sort(() => random() - 0.5);

    // Take only the number of songs we need
    const selectedSongs = shuffledSongs.slice(0, totalSquares);

    // Create the bingo squares
    return selectedSongs.map((songTitle, index) => ({
        id: `${index}`,
        songTitle,
        marked: false
    }));
};

// Function to check if a user has a bingo (row, column, or diagonal)
export const checkForBingo = (board: BingoSquare[], size: BoardSize): boolean => {
    const { rows, cols } = getBoardDimensions(size);

    // Safety check: ensure the board has the expected number of squares
    const expectedSquares = rows * cols;
    if (!board || board.length !== expectedSquares) {
        return false;
    }

    // Validate that all board elements have the required properties
    for (const square of board) {
        if (!square || typeof square.marked !== 'boolean') {
            return false;
        }
    }

    // Check rows
    for (let i = 0; i < rows; i++) {
        const rowStart = i * cols;
        let rowBingo = true;

        for (let j = 0; j < cols; j++) {
            const index = rowStart + j;
            if (index >= board.length || !board[index] || !board[index].marked) {
                rowBingo = false;
                break;
            }
        }

        if (rowBingo) return true;
    }

    // Check columns
    for (let i = 0; i < cols; i++) {
        let colBingo = true;

        for (let j = 0; j < rows; j++) {
            const index = j * cols + i;
            if (index >= board.length || !board[index] || !board[index].marked) {
                colBingo = false;
                break;
            }
        }

        if (colBingo) return true;
    }

    // Check diagonal (top-left to bottom-right)
    if (rows === cols) { // Only check diagonals for square boards
        let diag1Bingo = true;

        for (let i = 0; i < rows; i++) {
            const index = i * cols + i;
            if (index >= board.length || !board[index] || !board[index].marked) {
                diag1Bingo = false;
                break;
            }
        }

        if (diag1Bingo) return true;

        // Check diagonal (top-right to bottom-left)
        let diag2Bingo = true;

        for (let i = 0; i < rows; i++) {
            const index = i * cols + (cols - 1 - i);
            if (index >= board.length || !board[index] || !board[index].marked) {
                diag2Bingo = false;
                break;
            }
        }

        if (diag2Bingo) return true;
    }

    return false;
};
