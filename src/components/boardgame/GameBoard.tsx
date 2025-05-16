import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import GameSpace from './GameSpace';
import PlayerPiece from './PlayerPiece';
import type { GameSpace as GameSpaceType, Player, SpaceType } from '../../types';
import {
    getTriviaQuestionById,
    getRandomWheelType,
    getNewRandomTriviaQuestion,
    getRandomChanceOutcome
} from '../../utils/boardGameUtils';

interface GameBoardProps {
    spaces: GameSpaceType[];
    players: Player[];
    currentPlayerIndex: number;
}

const GameBoard = forwardRef<
    { showSpaceInfo: (space: GameSpaceType) => void },
    GameBoardProps
>(({ spaces, players, currentPlayerIndex }, ref) => {
    const [selectedSpace, setSelectedSpace] = useState<GameSpaceType | null>(null);
    const [showSpaceInfo, setShowSpaceInfo] = useState(false);
    const boardRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Center the board view when it first renders
    useEffect(() => {
        if (boardRef.current) {
            const container = boardRef.current.parentElement;
            if (container) {
                // Center the scroll position
                container.scrollLeft = (boardRef.current.scrollWidth - container.clientWidth) / 2;
                container.scrollTop = (boardRef.current.scrollHeight - container.clientHeight) / 2;
            }
        }
    }, [spaces]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        showSpaceInfo: (space: GameSpaceType) => {
            console.log('showSpaceInfo called with space:', space);
            // Directly set the selected space and show the modal
            setSelectedSpace(space);
            setShowSpaceInfo(true);
        }
    }));

    // Handle clicking on a space
    const handleSpaceClick = (space: GameSpaceType) => {
        // If it's a trivia space and doesn't have a question, generate one
        if (space.type === 'trivia' && !space.triviaQuestion) {
            const newQuestion = getNewRandomTriviaQuestion();
            if (newQuestion) {
                space = {
                    ...space,
                    triviaQuestion: newQuestion
                };
            }
        }

        // Set the selected space and show the modal
        setSelectedSpace(space);
        setShowSpaceInfo(true);

        // Log for debugging
        console.log('Space clicked:', space);
        console.log('Showing modal:', space.type);
    };

    // Close the space info modal
    const closeSpaceInfo = useCallback(() => {
        setShowSpaceInfo(false);
    }, []);

    // Handle clicks outside the modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSpaceInfo &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)) {
                closeSpaceInfo();
            }
        };

        // Add event listener when modal is shown
        if (showSpaceInfo) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSpaceInfo, closeSpaceInfo]);

    // Get players on a specific space
    const getPlayersOnSpace = (spaceId: string) => {
        return players.filter(player => spaces[player.position]?.id === spaceId);
    };

    // Render space info based on type
    const renderSpaceInfo = () => {
        if (!selectedSpace) return null;

        let content;
        switch (selectedSpace.type) {
            case 'start':
                if (selectedSpace.specialAction === 'price-wheel') {
                    content = (
                        <div className="space-info-content start">
                            <h4>Passed Start!</h4>
                            <p>You get to spin the Price Wheel!</p>
                        </div>
                    );
                } else if (selectedSpace.specialAction === 'rules-wheel') {
                    content = (
                        <div className="space-info-content start">
                            <h4>Landed on Start!</h4>
                            <p>You get to spin the Rules Wheel!</p>
                        </div>
                    );
                } else {
                    content = (
                        <div className="space-info-content start">
                            <h4>Start/Finish</h4>
                            <p>This is the starting point of the game.</p>
                        </div>
                    );
                }
                break;

            case 'trivia':
                // Check if there's a trivia question assigned
                if (selectedSpace.triviaQuestion) {
                    const question = getTriviaQuestionById(selectedSpace.triviaQuestion.questionId);

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
                } else {
                    // No question available (all have been used)
                    content = (
                        <div className="space-info-content trivia">
                            <h4>Trivia</h4>
                            <p>Player takes 1 sip and give 1 sip.</p>
                        </div>
                    );
                }
                break;

            case 'chance':
                // Generate a new random chance outcome each time
                const chanceOutcome = getRandomChanceOutcome();
                content = (
                    <div className="space-info-content chance">
                        <h4>Chance</h4>
                        <p className="chance-outcome">{chanceOutcome}</p>
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
                <div className="space-info-container" ref={modalRef}>
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
            <div className="game-board" ref={boardRef}>
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
});

export default GameBoard;
