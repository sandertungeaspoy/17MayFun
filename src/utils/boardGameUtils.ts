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
    // Create a more interesting path with multiple segments and turns
    // This creates a winding path that forms a closed loop

    const boardSize = Math.ceil(Math.sqrt(totalSpaces)) + 2; // Size of the board grid
    const center = Math.floor(boardSize / 2);

    // Create a spiral-like path
    let x = 0;
    let y = 0;
    let direction = 0; // 0: right, 1: down, 2: left, 3: up
    let steps = 1;
    let stepCount = 0;
    let turnCount = 0;

    for (let i = 0; i < index; i++) {
        // Move in the current direction
        switch (direction) {
            case 0: x++; break; // Right
            case 1: y++; break; // Down
            case 2: x--; break; // Left
            case 3: y--; break; // Up
        }

        stepCount++;

        // Check if we need to turn
        if (stepCount === steps) {
            direction = (direction + 1) % 4;
            stepCount = 0;
            turnCount++;

            // Increase steps every 2 turns
            if (turnCount % 2 === 0) {
                steps++;
            }
        }
    }

    // Scale and center the coordinates
    const scale = 2.5;
    return {
        x: (x * scale) + center,
        y: (y * scale) + center
    };
};

// Function to generate the board spaces
export const generateGameSpaces = (): GameSpace[] => {
    const spaces: GameSpace[] = [];
    const totalSpaces = BOARD_SIZE;

    // Create a weighted distribution of space types
    const spaceTypeDistribution: SpaceType[] = [];

    // Add start space
    spaceTypeDistribution.push('start');

    // Add other space types with desired frequencies
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

    // If we need more space types than in our distribution, repeat the pattern
    const repeatedTypes: SpaceType[] = [];
    while (repeatedTypes.length < totalSpaces) {
        repeatedTypes.push(...shuffledTypes);
    }

    // Make sure the first space is always 'start'
    repeatedTypes[0] = 'start';

    // Colors for the spaces (red, white, blue)
    const colors = ['#BA0C2F', '#FFFFFF', '#00205B'];

    // Create the spaces
    for (let i = 0; i < totalSpaces; i++) {
        const type = repeatedTypes[i];

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

// Function to get a random trivia question
export const getRandomTriviaQuestion = () => {
    const allQuizzes = quizzes;
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    const randomQuestion = randomQuiz.questions[Math.floor(Math.random() * randomQuiz.questions.length)];

    // Randomly assign a reward
    const rewards: Array<'prize' | 'punishment' | 'none'> = ['prize', 'punishment', 'none'];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];

    return {
        questionId: randomQuestion.id,
        reward: randomReward
    };
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
