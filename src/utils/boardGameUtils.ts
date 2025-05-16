import type { GameSpace, SpaceType, Player, BoardGameState } from '../types';
import { quizzes } from './quizUtils';

// Constants for the board game
const BOARD_SIZE = 16; // Number of spaces on the board
const PLAYER_COLORS = [
    '#FF5252', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Yellow
    '#9C27B0', // Purple
    '#FF9800', // Orange
    '#795548', // Brown
    '#607D8B'  // Gray
];

// Function to get an icon for a space type
export const getIconForType = (type: SpaceType): string => {
    switch (type) {
        case 'start':
            return '🏁';
        case 'finish':
            return '🏁';
        case 'trivia':
            return '❓';
        case 'chance':
            return '🎲';
        case 'music-bingo':
            return '🎵';
        case 'instant-prize':
            return '🎁';
        case 'random-wheel':
            return '🎡';
        case 'cheers':
            return '🥂';
        case 'drink-sips':
            return '🥤';
        case 'give-sips':
            return '👉';
        default:
            return '⭐';
    }
};

// Function to get a label for a space type
export const getLabelForType = (type: SpaceType): string => {
    switch (type) {
        case 'start':
            return 'Start';
        case 'finish':
            return 'Finish';
        case 'trivia':
            return 'Trivia';
        case 'chance':
            return 'Chance';
        case 'music-bingo':
            return 'Music Bingo';
        case 'instant-prize':
            return 'Instant Prize!';
        case 'random-wheel':
            return 'Spin a Wheel!';
        case 'cheers':
            return 'Cheers!';
        case 'drink-sips':
            return 'Drink Sips';
        case 'give-sips':
            return 'Give Sips';
        default:
            return 'Space';
    }
};

// Function to calculate position for a space in a loop layout
export const calculatePosition = (index: number, totalSpaces: number): { x: number, y: number } => {
    // Create a non-circular loop layout
    // This is a simplified calculation that creates a rectangular loop
    // You can customize this to create more interesting shapes

    const boardWidth = 4; // Number of spaces in the width
    const boardHeight = Math.ceil(totalSpaces / 4); // Calculate height based on total spaces

    // Calculate the perimeter positions
    if (index < boardWidth) {
        // Top row (left to right)
        return { x: index, y: 0 };
    } else if (index < boardWidth + boardHeight - 1) {
        // Right column (top to bottom)
        return { x: boardWidth - 1, y: index - boardWidth + 1 };
    } else if (index < 2 * boardWidth + boardHeight - 2) {
        // Bottom row (right to left)
        return { x: 2 * boardWidth + boardHeight - 3 - index, y: boardHeight - 1 };
    } else {
        // Left column (bottom to top)
        return { x: 0, y: totalSpaces - index };
    }
};

// Function to generate the board spaces
export const generateGameSpaces = (): GameSpace[] => {
    const spaces: GameSpace[] = [];
    const totalSpaces = BOARD_SIZE;

    // Define the distribution of space types
    const spaceTypes: SpaceType[] = [
        'start',
        'trivia', 'trivia', 'trivia',
        'chance', 'chance',
        'music-bingo', 'music-bingo',
        'instant-prize',
        'random-wheel',
        'cheers', 'cheers',
        'drink-sips', 'drink-sips',
        'give-sips', 'give-sips'
    ];

    // Colors for the spaces (red, white, blue)
    const colors = ['#BA0C2F', '#FFFFFF', '#00205B'];

    // Create the spaces
    for (let i = 0; i < totalSpaces; i++) {
        const typeIndex = i % spaceTypes.length;
        const type = spaceTypes[typeIndex];

        // Determine color based on type and position
        let color;
        if (type === 'start' || type === 'finish') {
            color = 'checkered'; // Special color for start/finish
        } else {
            // Alternate between red, white, and blue
            const colorIndex = i % colors.length;
            color = colors[colorIndex];
        }

        // Create the space
        const space: GameSpace = {
            id: i.toString(),
            type,
            color,
            position: calculatePosition(i, totalSpaces),
            icon: getIconForType(type),
            label: getLabelForType(type)
        };

        // Add type-specific properties
        if (type === 'trivia') {
            // Randomly select a quiz and question
            const allQuizzes = quizzes;
            const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
            const randomQuestion = randomQuiz.questions[Math.floor(Math.random() * randomQuiz.questions.length)];

            // Randomly assign a reward
            const rewards: Array<'prize' | 'punishment' | 'none'> = ['prize', 'punishment', 'none'];
            const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

            space.triviaQuestion = {
                questionId: randomQuestion.id,
                reward: randomReward
            };
        } else if (type === 'chance') {
            // Random chance outcomes
            const chanceOutcomes = [
                'Go to Price Wheel',
                'Go to Punishment Wheel',
                'Go to Rules Wheel',
                'Take a shot',
                'Give a shot',
                'Pick a prize',
                'Bingo free spot'
            ];
            space.chanceOutcome = chanceOutcomes[Math.floor(Math.random() * chanceOutcomes.length)];
        } else if (type === 'drink-sips' || type === 'give-sips') {
            // Random number of sips (1-3)
            space.sipsCount = Math.floor(Math.random() * 3) + 1;
        }

        spaces.push(space);
    }

    return spaces;
};

// Function to create a new player
export const createPlayer = (name: string, players: Player[]): Player => {
    // Generate a unique ID
    const id = crypto.randomUUID();

    // Assign a color that's not already in use
    const usedColors = players.map(player => player.color);
    const availableColors = PLAYER_COLORS.filter(color => !usedColors.includes(color));

    // If all colors are used, just pick a random one
    const color = availableColors.length > 0
        ? availableColors[0]
        : PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];

    return {
        id,
        name,
        position: 0, // Start at the beginning
        color
    };
};

// Function to move a player
export const movePlayer = (player: Player, steps: number, totalSpaces: number): Player => {
    // Calculate new position, wrapping around if necessary
    const newPosition = (player.position + steps) % totalSpaces;

    return {
        ...player,
        position: newPosition
    };
};

// Function to initialize a new game state
export const initializeGameState = (): BoardGameState => {
    const spaces = generateGameSpaces();

    return {
        spaces,
        players: [],
        currentPlayerIndex: 0,
        gameStarted: false
    };
};

// Function to save the game state to localStorage
export const saveGameState = (state: BoardGameState): void => {
    localStorage.setItem('boardGameState', JSON.stringify(state));
};

// Function to load the game state from localStorage
export const loadGameState = (): BoardGameState | null => {
    const savedState = localStorage.getItem('boardGameState');

    if (savedState) {
        try {
            return JSON.parse(savedState);
        } catch (error) {
            console.error('Error parsing saved game state:', error);
            return null;
        }
    }

    return null;
};

// Function to get a random dice roll (1-6)
export const rollDice = (): number => {
    return Math.floor(Math.random() * 6) + 1;
};

// Function to get the next player index
export const getNextPlayerIndex = (currentIndex: number, totalPlayers: number): number => {
    return (currentIndex + 1) % totalPlayers;
};

// Function to get a trivia question by ID
export const getTriviaQuestionById = (questionId: string) => {
    for (const quiz of quizzes) {
        const question = quiz.questions.find(q => q.id === questionId);
        if (question) {
            return question;
        }
    }
    return null;
};

// Function to get a random wheel type
export const getRandomWheelType = (): 'price' | 'punishment' | 'rules' => {
    const wheelTypes: Array<'price' | 'punishment' | 'rules'> = ['price', 'punishment', 'rules'];
    return wheelTypes[Math.floor(Math.random() * wheelTypes.length)];
};
