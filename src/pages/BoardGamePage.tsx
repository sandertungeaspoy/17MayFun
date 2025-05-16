import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import GameBoard from '../components/boardgame/GameBoard';
import PlayerControls from '../components/boardgame/PlayerControls';
import {
    initializeGameState,
    movePlayer,
    getNextPlayerIndex,
    saveGameState,
    loadGameState,
    getRandomTriviaQuestion
} from '../utils/boardGameUtils';
import { RoutePath } from '../types';
import type { Player, BoardGameState } from '../types';

const BoardGamePage: React.FC = () => {
    const navigate = useNavigate();
    // Initialize state with a loading placeholder
    const [gameState, setGameState] = useState<BoardGameState | null>(null);
    const [spaceActionMessage, setSpaceActionMessage] = useState<string | null>(null);

    // Load saved game state on component mount or initialize a new one if none exists
    useEffect(() => {
        const savedState = loadGameState();
        if (savedState) {
            // Use the saved state
            setGameState(savedState);
        } else {
            // Only initialize a new game if no saved state exists
            setGameState(initializeGameState());
        }
    }, []);

    // Save game state whenever it changes (but only if gameState is not null)
    useEffect(() => {
        if (gameState) {
            saveGameState(gameState);
        }
    }, [gameState]);

    // Handle adding a player
    const handleAddPlayer = (player: Player) => {
        if (!gameState || gameState.gameStarted) return;

        setGameState({
            ...gameState,
            players: [...gameState.players, player]
        });
    };

    // Handle removing a player
    const handleRemovePlayer = (playerId: string) => {
        if (!gameState || gameState.gameStarted) return;

        setGameState({
            ...gameState,
            players: gameState.players.filter(player => player.id !== playerId)
        });
    };

    // Handle starting the game
    const handleStartGame = () => {
        if (!gameState || gameState.players.length < 2) return;

        setGameState({
            ...gameState,
            gameStarted: true
        });
    };

    // Handle rolling the dice and moving the player
    const handleRollDice = (steps: number) => {
        if (!gameState) return;

        const { players, currentPlayerIndex, spaces } = gameState;
        const currentPlayer = players[currentPlayerIndex];

        if (!currentPlayer) return;

        // Move the player
        const { updatedPlayer, passedStart, landedOnStart } = movePlayer(currentPlayer, steps, spaces.length);

        // Update the player in the players array
        const updatedPlayers = players.map(player =>
            player.id === currentPlayer.id ? updatedPlayer : player
        );

        // Get the space the player landed on
        const landedSpace = spaces[updatedPlayer.position];

        // Handle special rules for start/finish
        if (passedStart) {
            setSpaceActionMessage('You passed Start! Go to the Price Wheel!');
            setTimeout(() => {
                navigate(RoutePath.PRICE_WHEEL);
            }, 2000);
            return;
        }

        if (landedOnStart) {
            setSpaceActionMessage('You landed on Start! Go to the Rules Wheel!');
            setTimeout(() => {
                navigate(RoutePath.RULES_WHEEL);
            }, 2000);
            return;
        }

        // Set a message based on the space type
        let message = '';
        if (landedSpace) {
            switch (landedSpace.type) {
                case 'trivia':
                    // Generate a new random trivia question
                    const triviaQuestion = getRandomTriviaQuestion();
                    // Update the space with the new question
                    const updatedSpaces = [...spaces];
                    updatedSpaces[updatedPlayer.position] = {
                        ...landedSpace,
                        triviaQuestion
                    };

                    message = 'Answer the trivia question!';

                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);

                    // Update game state with the new spaces
                    setGameState({
                        ...gameState,
                        spaces: updatedSpaces
                    });
                    break;
                case 'chance':
                    message = `Chance: ${landedSpace.chanceOutcome}`;
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'music-bingo':
                    message = 'Music Bingo space!';
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'instant-prize':
                    message = 'You won an instant prize!';
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'random-wheel':
                    message = 'Spin a random wheel!';
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'cheers':
                    message = 'Cheers! Everyone drinks!';
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'drink-sips':
                    message = `Drink ${landedSpace.sipsCount} sips!`;
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                case 'give-sips':
                    message = `Give ${landedSpace.sipsCount} sips to another player!`;
                    // Auto-activate the space
                    setTimeout(() => {
                        const spaceElement = document.querySelector(`.game-space[data-id="${landedSpace.id}"]`);
                        if (spaceElement) {
                            spaceElement.dispatchEvent(new Event('click'));
                        }
                    }, 500);
                    break;
                default:
                    message = `Landed on ${landedSpace.label}`;
            }
        }

        setSpaceActionMessage(message);

        // Move to the next player after a delay
        setTimeout(() => {
            setGameState({
                ...gameState,
                players: updatedPlayers,
                currentPlayerIndex: getNextPlayerIndex(currentPlayerIndex, players.length)
            });

            setSpaceActionMessage(null);
        }, 3000);
    };

    // Reset the game
    const handleResetGame = () => {
        if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            const newGameState = initializeGameState();
            setGameState(newGameState);
            saveGameState(newGameState);
        }
    };

    // If gameState is still loading, show a loading indicator
    if (!gameState) {
        return (
            <div className="page-content board-game-page">
                <Header
                    title="Board Game"
                    showBackButton={true}
                    onBack={() => navigate(RoutePath.HOME)}
                />
                <div className="loading">Loading game...</div>
            </div>
        );
    }

    return (
        <div className="page-content board-game-page">
            <Header
                title="Board Game"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <div className="board-game-container">
                <div className="board-section">
                    <GameBoard
                        spaces={gameState.spaces}
                        players={gameState.players}
                        currentPlayerIndex={gameState.currentPlayerIndex}
                    />

                    {spaceActionMessage && (
                        <div className="space-action-message">
                            {spaceActionMessage}
                        </div>
                    )}
                </div>

                <div className="controls-section">
                    <PlayerControls
                        players={gameState.players}
                        currentPlayerIndex={gameState.currentPlayerIndex}
                        onAddPlayer={handleAddPlayer}
                        onRemovePlayer={handleRemovePlayer}
                        onRollDice={handleRollDice}
                        gameStarted={gameState.gameStarted}
                        onStartGame={handleStartGame}
                    />

                    {gameState.gameStarted && (
                        <button className="reset-game-button" onClick={handleResetGame}>
                            Reset Game
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardGamePage;
