import React from 'react';
import type { GameSpace as GameSpaceType } from '../../types';

interface GameSpaceProps {
    space: GameSpaceType;
    onClick?: () => void;
    hasPlayers?: boolean;
}

const GameSpace: React.FC<GameSpaceProps> = ({ space, onClick, hasPlayers }) => {
    // Determine the background style based on the space color
    const getBackgroundStyle = () => {
        if (space.color === 'checkered') {
            return {
                background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px'
            };
        }
        return { backgroundColor: space.color };
    };

    // Get text color based on background color for better contrast
    const getTextColor = () => {
        if (space.color === '#FFFFFF') {
            return '#000000'; // Black text on white background
        } else if (space.color === 'checkered') {
            return '#FF5252'; // Red text on checkered background for better visibility
        }
        return '#FFFFFF'; // White text on colored backgrounds
    };

    // Get additional content based on space type
    const getAdditionalContent = () => {
        switch (space.type) {
            case 'drink-sips':
            case 'give-sips':
                return <div className="space-sips-count">{space.sipsCount}</div>;
            default:
                return null;
        }
    };

    return (
        <div
            className={`game-space ${space.type} ${hasPlayers ? 'has-players' : ''}`}
            style={{
                ...getBackgroundStyle(),
                color: getTextColor(),
                transform: `translate(${space.position.x * 100}px, ${space.position.y * 100}px)`
            }}
            onClick={onClick}
            data-id={space.id}
        >
            <div className="space-icon">{space.icon}</div>
            <div className="space-label">{space.label}</div>
            {getAdditionalContent()}
        </div>
    );
};

export default GameSpace;
