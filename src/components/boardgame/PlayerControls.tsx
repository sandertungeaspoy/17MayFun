import React, { useState } from 'react';
import type { Player } from '../../types';
import { createPlayer, rollDice } from '../../utils/boardGameUtils';

interface PlayerControlsProps {
    players: Player[];
    currentPlayerIndex: number;
    onAddPlayer: (player: Player) => void;
    onRemovePlayer: (playerId: string) => void;
    onRollDice: (steps: number) => void;
    gameStarted: boolean;
    onStartGame: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
    players,
    currentPlayerIndex,
    onAddPlayer,
    onRemovePlayer,
    onRollDice,
    gameStarted,
    onStartGame
}) => {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [diceResult, setDiceResult] = useState<number | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    // Handle adding a new player
    const handleAddPlayer = () => {
        if (newPlayerName.trim() === '') return;

        const player = createPlayer(newPlayerName.trim(), players);
        onAddPlayer(player);
        setNewPlayerName('');
    };

    // Handle rolling the dice
    const handleRollDice = () => {
        if (isRolling) return;

        setIsRolling(true);

        // Animate dice roll
        let rollCount = 0;
        const maxRolls = 10;
        const rollInterval = setInterval(() => {
            const roll = rollDice();
            setDiceResult(roll);
            rollCount++;

            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                setIsRolling(false);
                onRollDice(diceResult || roll);
            }
        }, 100);
    };

    // Get the current player
    const currentPlayer = players[currentPlayerIndex];

    return (
        <div className="player-controls">
            <h3>Players</h3>

            {/* Add player form */}
            <div className="add-player-form">
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Player name"
                    maxLength={20}
                />
                <button onClick={handleAddPlayer}>Add Player</button>
            </div>

            {/* Player list */}
            <div className="player-list">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={`player-item ${player === currentPlayer ? 'current-player' : ''}`}
                    >
                        <div className="player-color" style={{ backgroundColor: player.color }}></div>
                        <div className="player-name">{player.name}</div>
                        <button
                            className="remove-player"
                            onClick={() => onRemovePlayer(player.id)}
                            disabled={gameStarted}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Game controls */}
            <div className="game-controls">
                {!gameStarted && players.length >= 2 && (
                    <button className="start-game-button" onClick={onStartGame}>
                        Start Game
                    </button>
                )}

                {gameStarted && (
                    <div className="turn-controls">
                        <div className="current-player-info">
                            <span>Current Player: </span>
                            <strong style={{ color: currentPlayer?.color }}>
                                {currentPlayer?.name}
                            </strong>
                        </div>

                        <button
                            className={`roll-dice-button ${isRolling ? 'rolling' : ''}`}
                            onClick={handleRollDice}
                            disabled={isRolling}
                        >
                            {isRolling ? 'Rolling...' : 'Roll Dice'}
                        </button>

                        {diceResult !== null && (
                            <div className="dice-result">
                                <div className="dice">{diceResult}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayerControls;
