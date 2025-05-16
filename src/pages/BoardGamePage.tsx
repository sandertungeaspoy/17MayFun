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
    loadGameState
} from '../utils/boardGameUtils';
import { RoutePath } from '../types';
import type { Player, BoardGameState } from '../types';

const BoardGamePage: React.FC = () => {
    const navigate = useNavigate();
    const [gameState, setGameState] = useState<BoardGameState>(initializeGameState());
    const [spaceActionMessage, setSpaceActionMessage] = useState<string | null>(null);

    // Load saved game state on component mount
    useEffect(() => {
        const savedState = loadGameState();
        if (savedState) {
            setGameState(savedState);
        }
    }, []);

    // Save game state whenever it changes
    useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    // Handle adding a player
    const handleAddPlayer = (player: Player) => {
        if (gameState.gameStarted) return;

        setGameState(prevState => ({
            ...prevState,
            players: [...prevState.players, player]
        }));
    };

    // Handle removing a player
    const handleRemovePlayer = (playerId: string) => {
        if (gameState.gameStarted) return;

        setGameState(prevState => ({
            ...prevState,
            players: prevState.players.filter(player => player.id !== playerId)
        }));
    };

    // Handle starting the game
    const handleStartGame = () => {
        if (gameState.players.length < 2) return;

        setGameState(prevState => ({
            ...prevState,
            gameStarted: true
        }));
    };

    // Handle rolling the dice and moving the player
    const handleRollDice = (steps: number) => {
        const { players, currentPlayerIndex, spaces } = gameState;
        const currentPlayer = players[currentPlayerIndex];

        if (!currentPlayer) return;

        // Move the player
        const updatedPlayer = movePlayer(currentPlayer, steps, spaces.length);

        // Update the player in the players array
        const updatedPlayers = players.map(player =>
            player.id === currentPlayer.id ? updatedPlayer : player
        );

        // Get the space the player landed on
        const landedSpace = spaces[updatedPlayer.position];

        // Set a message based on the space type
        let message = '';
        if (landedSpace) {
            switch (landedSpace.type) {
                case 'trivia':
                    message = 'Answer the trivia question!';
                    break;
                case 'chance':
                    message = `Chance: ${landedSpace.chanceOutcome}`;
                    break;
                case 'music-bingo':
                    message = 'Music Bingo space!';
                    break;
                case 'instant-prize':
                    message = 'You won an instant prize!';
                    break;
                case 'random-wheel':
                    message = 'Spin a random wheel!';
                    break;
                case 'cheers':
                    message = 'Cheers! Everyone drinks!';
                    break;
                case 'drink-sips':
                    message = `Drink ${landedSpace.sipsCount} sips!`;
                    break;
                case 'give-sips':
                    message = `Give ${landedSpace.sipsCount} sips to another player!`;
                    break;
                case 'start':
                case 'finish':
                    message = 'Start/Finish space!';
                    break;
                default:
                    message = `Landed on ${landedSpace.label}`;
            }
        }

        setSpaceActionMessage(message);

        // Move to the next player after a delay
        setTimeout(() => {
            setGameState(prevState => ({
                ...prevState,
                players: updatedPlayers,
                currentPlayerIndex: getNextPlayerIndex(currentPlayerIndex, players.length)
            }));

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
