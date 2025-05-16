import React, { useState } from 'react';
import GameSpace from './GameSpace';
import PlayerPiece from './PlayerPiece';
import type { GameSpace as GameSpaceType, Player, SpaceType } from '../../types';
import { getTriviaQuestionById, getRandomWheelType } from '../../utils/boardGameUtils';

interface GameBoardProps {
    spaces: GameSpaceType[];
    players: Player[];
    currentPlayerIndex: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ spaces, players, currentPlayerIndex }) => {
    const [selectedSpace, setSelectedSpace] = useState<GameSpaceType | null>(null);
    const [showSpaceInfo, setShowSpaceInfo] = useState(false);

    // Handle clicking on a space
    const handleSpaceClick = (space: GameSpaceType) => {
        setSelectedSpace(space);
        setShowSpaceInfo(true);
    };

    // Close the space info modal
    const closeSpaceInfo = () => {
        setShowSpaceInfo(false);
    };

    // Get players on a specific space
    const getPlayersOnSpace = (spaceId: string) => {
        return players.filter(player => spaces[player.position]?.id === spaceId);
    };

    // Render space info based on type
    const renderSpaceInfo = () => {
        if (!selectedSpace) return null;

        let content;
        switch (selectedSpace.type) {
            case 'trivia':
                const question = selectedSpace.triviaQuestion
                    ? getTriviaQuestionById(selectedSpace.triviaQuestion.questionId)
                    : null;

                content = (
                    <div className="space-info-content trivia">
                        <h4>Trivia Question</h4>
                        {question ? (
                            <>
                                <p className="question">{question.question}</p>
                                {question.type === 'multiple-choice' && question.options && (
                                    <div className="options">
                                        {question.options.map((option, index) => (
                                            <div key={index} className="option">
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedSpace.triviaQuestion?.reward !== 'none' && (
                                    <p className="reward">
                                        {selectedSpace.triviaQuestion?.reward === 'prize'
                                            ? 'Correct answer wins a prize!'
                                            : 'Incorrect answer gets a punishment!'}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p>Question not found</p>
                        )}
                    </div>
                );
                break;

            case 'chance':
                content = (
                    <div className="space-info-content chance">
                        <h4>Chance</h4>
                        <p className="chance-outcome">{selectedSpace.chanceOutcome}</p>
                    </div>
                );
                break;

            case 'music-bingo':
                content = (
                    <div className="space-info-content music-bingo">
                        <h4>Music Bingo</h4>
                        <p>This is a Music Bingo space!</p>
                    </div>
                );
                break;

            case 'instant-prize':
                content = (
                    <div className="space-info-content instant-prize">
                        <h4>Instant Prize!</h4>
                        <p>You won an instant prize!</p>
                    </div>
                );
                break;

            case 'random-wheel':
                const wheelType = getRandomWheelType();
                content = (
                    <div className="space-info-content random-wheel">
                        <h4>Spin a Wheel!</h4>
                        <p>Go to the {wheelType === 'price' ? 'Price' : wheelType === 'punishment' ? 'Punishment' : 'Rules'} Wheel!</p>
                    </div>
                );
                break;

            case 'cheers':
                content = (
                    <div className="space-info-content cheers">
                        <h4>Cheers!</h4>
                        <p>Everyone drinks! 🥂</p>
                    </div>
                );
                break;

            case 'drink-sips':
                content = (
                    <div className="space-info-content drink-sips">
                        <h4>Drink Sips</h4>
                        <p>Drink {selectedSpace.sipsCount} sips! 🥤</p>
                    </div>
                );
                break;

            case 'give-sips':
                content = (
                    <div className="space-info-content give-sips">
                        <h4>Give Sips</h4>
                        <p>Give {selectedSpace.sipsCount} sips to another player! 👉</p>
                    </div>
                );
                break;

            default:
                content = (
                    <div className="space-info-content">
                        <h4>{selectedSpace.label}</h4>
                        <p>Space type: {selectedSpace.type}</p>
                    </div>
                );
        }

        return (
            <div className={`space-info-modal ${showSpaceInfo ? 'show' : ''}`}>
                <div className="space-info-container">
                    <div className="space-info-header">
                        <div className="space-icon">{selectedSpace.icon}</div>
                        <h3>{selectedSpace.label}</h3>
                        <button className="close-button" onClick={closeSpaceInfo}>✕</button>
                    </div>
                    {content}
                </div>
            </div>
        );
    };

    return (
        <div className="game-board-container">
            <div className="game-board">
                {spaces.map(space => (
                    <GameSpace
                        key={space.id}
                        space={space}
                        onClick={() => handleSpaceClick(space)}
                        hasPlayers={getPlayersOnSpace(space.id).length > 0}
                    />
                ))}

                {/* Render player pieces */}
                {players.map(player => (
                    <PlayerPiece
                        key={player.id}
                        player={player}
                        spaces={spaces}
                        isCurrentPlayer={players[currentPlayerIndex]?.id === player.id}
                    />
                ))}
            </div>

            {renderSpaceInfo()}
        </div>
    );
};

export default GameBoard;
