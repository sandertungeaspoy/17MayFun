import React from 'react';
import type { Player, GameSpace } from '../../types';

interface PlayerPieceProps {
    player: Player;
    spaces: GameSpace[];
    isCurrentPlayer: boolean;
}

const PlayerPiece: React.FC<PlayerPieceProps> = ({ player, spaces, isCurrentPlayer }) => {
    // Get the current space position for the player
    const getCurrentPosition = () => {
        const currentSpace = spaces[player.position];
        if (!currentSpace) {
            return { x: 0, y: 0 }; // Default position if space not found
        }

        return {
            x: currentSpace.position.x * 100 + 50, // Center of the space
            y: currentSpace.position.y * 100 + 50  // Center of the space
        };
    };

    // Calculate offset based on player index to avoid overlapping pieces
    const getPlayerOffset = () => {
        // Extract player index from the last character of the ID
        const playerIndex = parseInt(player.id.slice(-1), 10) || 0;

        // Create a circular arrangement of pieces within the space
        const angle = (playerIndex % 8) * (Math.PI / 4); // 8 positions around a circle
        const radius = 20; // Distance from center

        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    const position = getCurrentPosition();
    const offset = getPlayerOffset();

    return (
        <div
            className={`player-piece ${isCurrentPlayer ? 'current-player' : ''}`}
            style={{
                backgroundColor: player.color,
                transform: `translate(${position.x + offset.x}px, ${position.y + offset.y}px)`,
                zIndex: isCurrentPlayer ? 10 : 5 // Current player appears on top
            }}
            title={player.name}
        >
            <div className="player-initial">{player.name.charAt(0).toUpperCase()}</div>
        </div>
    );
};

export default PlayerPiece;
