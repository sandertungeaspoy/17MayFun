import React, { useState, useEffect, useRef } from 'react';
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
    getRandomTriviaQuestion,
    resetUsedQuestions
} from '../utils/boardGameUtils';
import { RoutePath } from '../types';
import type { Player, BoardGameState, GameSpace as GameSpaceType } from '../types';

const BoardGamePage: React.FC = () => {
    const navigate = useNavigate();
    // Initialize state with a loading placeholder
    const [gameState, setGameState] = useState<BoardGameState | null>(null);
    // Reference to the GameBoard component
    const gameBoardRef = useRef<any>(null);

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
            // Create a virtual space for "passed start"
            const passedStartSpace: GameSpaceType = {
                id: 'passed-start',
                type: 'start',
                color: 'checkered',
                position: { x: 0, y: 0 },
                icon: '🏁',
                label: 'Passed Start',
                specialAction: 'price-wheel'
            };

            // Update player position
            const updatedGameState = {
                ...gameState,
                players: updatedPlayers,
                currentPlayerIndex: getNextPlayerIndex(currentPlayerIndex, players.length)
            };

            setGameState(updatedGameState);

            // Show the info modal for passed start
            setTimeout(() => {
                if (gameBoardRef.current) {
                    gameBoardRef.current.showSpaceInfo(passedStartSpace);
                }
            }, 800);
            return;
        }

        if (landedOnStart) {
            // Create a virtual space for "landed on start"
            const landedOnStartSpace: GameSpaceType = {
                id: 'landed-on-start',
                type: 'start',
                color: 'checkered',
                position: { x: 0, y: 0 },
                icon: '🏁',
                label: 'Landed on Start',
                specialAction: 'rules-wheel'
            };

            // Update player position
            const updatedGameState = {
                ...gameState,
                players: updatedPlayers,
                currentPlayerIndex: getNextPlayerIndex(currentPlayerIndex, players.length)
            };

            setGameState(updatedGameState);

            // Show the info modal for landed on start
            setTimeout(() => {
                if (gameBoardRef.current) {
                    gameBoardRef.current.showSpaceInfo(landedOnStartSpace);
                }
            }, 800);
            return;
        }

        // Handle the space based on its type
        if (landedSpace) {
            let updatedSpaces = [...spaces];

            // For trivia spaces, generate a new question
            if (landedSpace.type === 'trivia') {
                const triviaQuestion = getRandomTriviaQuestion();

                // Update the space with the new question
                updatedSpaces[updatedPlayer.position] = {
                    ...landedSpace,
                    triviaQuestion: triviaQuestion || undefined
                };
            }

            // Update game state with the new player position and spaces
            const updatedGameState = {
                ...gameState,
                players: updatedPlayers,
                spaces: updatedSpaces,
                currentPlayerIndex: getNextPlayerIndex(currentPlayerIndex, players.length)
            };

            setGameState(updatedGameState);

            // Auto-activate the space to show the modal
            // Use a reference to the updated space
            const updatedLandedSpace = updatedSpaces[updatedPlayer.position];

            // Wait a bit for the UI to update before showing the modal
            setTimeout(() => {
                console.log('Attempting to show space info for:', updatedLandedSpace);

                // Try to directly call the showSpaceInfo method on the GameBoard component
                if (gameBoardRef.current) {
                    console.log('GameBoard ref exists, calling showSpaceInfo');
                    gameBoardRef.current.showSpaceInfo(updatedLandedSpace);
                } else {
                    console.error('GameBoard ref is not available');
                }
            }, 800); // Increased delay to ensure the UI has updated
        }
    };

    // Reset the game
    const handleResetGame = () => {
        if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
            // Reset used trivia questions
            resetUsedQuestions();

            // Initialize new game state
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
                        ref={gameBoardRef}
                        spaces={gameState.spaces}
                        players={gameState.players}
                        currentPlayerIndex={gameState.currentPlayerIndex}
                    />

                    {/* Removed space action message */}
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
