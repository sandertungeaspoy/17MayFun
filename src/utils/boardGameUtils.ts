import type { GameSpace, SpaceType, Player, BoardGameState } from '../types';
import { quizzes } from './quizUtils';

// Constants for the board game
const BOARD_SIZE = 32; // Number of spaces on the board
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
            return 'Start/Finish';
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
export const calculatePosition = (index: number): { x: number, y: number } => {
    // Create a rectangular board layout that fits within the visible area
    // This ensures all spaces are visible on screen

    // Define the dimensions of the rectangle
    const width = 12; // Number of spaces in the width
    const height = 6; // Fixed height for the rectangle

    // Calculate the total number of spaces that can fit on the perimeter
    const perimeter = 2 * width + 2 * height - 4; // Subtract 4 to avoid double-counting corners

    // Ensure we have enough space for all spaces with proper spacing
    // Each space is 70px wide/high according to CSS
    const spaceSize = 1; // In grid units (will be scaled later)
    const spacing = 0.06; // Space between spaces (4px / 70px ≈ 0.06 grid units)

    // Calculate position based on index
    let x, y;

    // Normalize the index to the perimeter
    const normalizedIndex = index % perimeter;

    // Calculate the position along the perimeter
    if (normalizedIndex < width) {
        // Top row (left to right)
        x = normalizedIndex * (spaceSize + spacing);
        y = 0;
    } else if (normalizedIndex < width + height - 1) {
        // Right column (top to bottom)
        x = (width - 1) * (spaceSize + spacing);
        y = (normalizedIndex - width + 1) * (spaceSize + spacing);
    } else if (normalizedIndex < 2 * width + height - 2) {
        // Bottom row (right to left)
        x = (2 * width + height - 3 - normalizedIndex) * (spaceSize + spacing);
        y = (height - 1) * (spaceSize + spacing);
    } else {
        // Left column (bottom to top)
        x = 0;
        y = (2 * height + 2 * width - 4 - normalizedIndex) * (spaceSize + spacing);
    }

    // Scale and adjust the coordinates to fit within the visible area
    const scale = 1.0; // Adjust this value to fit the board properly
    const offsetX = 1;
    const offsetY = 1;

    return {
        x: x * scale + offsetX,
        y: y * scale + offsetY
    };
};

// Function to generate the board spaces
export const generateGameSpaces = (): GameSpace[] => {
    const spaces: GameSpace[] = [];
    const totalSpaces = BOARD_SIZE;

    // Create a weighted distribution of space types (excluding start)
    const spaceTypeDistribution: SpaceType[] = [];

    // Add other space types with desired frequencies (no start space here)
    spaceTypeDistribution.push(...Array(6).fill('trivia'));
    spaceTypeDistribution.push(...Array(5).fill('chance'));
    spaceTypeDistribution.push(...Array(4).fill('music-bingo'));
    spaceTypeDistribution.push(...Array(3).fill('instant-prize'));
    spaceTypeDistribution.push(...Array(3).fill('random-wheel'));
    spaceTypeDistribution.push(...Array(4).fill('cheers'));
    spaceTypeDistribution.push(...Array(3).fill('drink-sips'));
    spaceTypeDistribution.push(...Array(3).fill('give-sips'));

    // Shuffle the space types to randomize them
    const shuffledTypes = [...spaceTypeDistribution].sort(() => Math.random() - 0.5);

    // Create an array for all spaces, starting with 'start' as the first space
    const allTypes: SpaceType[] = ['start'];

    // Fill the rest of the spaces with the shuffled types
    while (allTypes.length < totalSpaces) {
        // Add shuffled types, but skip any 'start' types to avoid duplicates
        for (const type of shuffledTypes) {
            if (type !== 'start' && allTypes.length < totalSpaces) {
                allTypes.push(type);
            }
        }
    }

    // Colors for the spaces (red, white, blue)
    const colors = ['#BA0C2F', '#FFFFFF', '#00205B'];

    // Create the spaces
    for (let i = 0; i < totalSpaces; i++) {
        const type = allTypes[i];

        // Determine color based on type and position
        let color;
        if (type === 'start') {
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
            position: calculatePosition(i),
            icon: getIconForType(type),
            label: getLabelForType(type)
        };

        // Add type-specific properties
        if (type === 'chance') {
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

// Function to get used question IDs from localStorage
export const getUsedQuestionIds = (): string[] => {
    const usedIds = localStorage.getItem('usedTriviaQuestions');
    return usedIds ? JSON.parse(usedIds) : [];
};

// Function to save a used question ID
export const markQuestionAsUsed = (questionId: string): void => {
    const usedIds = getUsedQuestionIds();
    if (!usedIds.includes(questionId)) {
        usedIds.push(questionId);
        localStorage.setItem('usedTriviaQuestions', JSON.stringify(usedIds));
    }
};

// Function to reset used questions
export const resetUsedQuestions = (): void => {
    localStorage.removeItem('usedTriviaQuestions');
};

// Function to get a new random question that hasn't been used yet
export const getNewRandomTriviaQuestion = () => {
    const usedIds = getUsedQuestionIds();
    const allQuestions = quizzes.flatMap(quiz => quiz.questions);
    const unusedQuestions = allQuestions.filter(q => !usedIds.includes(q.id));

    // If all questions have been used, return null
    if (unusedQuestions.length === 0) {
        return null;
    }

    // Get a random unused question
    const randomQuestion = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    markQuestionAsUsed(randomQuestion.id);

    // Randomly assign a reward
    const rewards: Array<'prize' | 'punishment' | 'none'> = ['prize', 'punishment', 'none'];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    return {
        questionId: randomQuestion.id,
        reward: randomReward
    };
};

// Function to get a random trivia question (legacy function for backward compatibility)
export const getRandomTriviaQuestion = () => {
    return getNewRandomTriviaQuestion();
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
export const movePlayer = (player: Player, steps: number, totalSpaces: number): {
    updatedPlayer: Player;
    passedStart: boolean;
    landedOnStart: boolean;
} => {
    const oldPosition = player.position;
    // Calculate new position, wrapping around if necessary
    const newPosition = (oldPosition + steps) % totalSpaces;

    // Check if player passed or landed on start
    const passedStart = oldPosition + steps >= totalSpaces;
    const landedOnStart = newPosition === 0;

    return {
        updatedPlayer: {
            ...player,
            position: newPosition
        },
        passedStart,
        landedOnStart
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

// Function to get a random chance outcome
export const getRandomChanceOutcome = (): string => {
    const chanceOutcomes = [
        'Go to Price Wheel',
        'Go to Punishment Wheel',
        'Go to Rules Wheel',
        'Take a shot',
        'Give a shot',
        'Pick a prize',
        'Bingo free spot'
    ];
    return chanceOutcomes[Math.floor(Math.random() * chanceOutcomes.length)];
};
