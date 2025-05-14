import { useState, useEffect } from 'react';
import BingoSquare from './BingoSquare';
import useLocalStorage from '../../hooks/useLocalStorage';
import { generateBingoBoard, checkForBingo } from '../../utils/bingoUtils';
import type { BingoSquare as BingoSquareType, BoardSize } from '../../types';

interface BingoBoardProps {
    size: BoardSize;
}

const BingoBoard = ({ size }: BingoBoardProps) => {
    // Generate a unique user ID for persistence if not already exists
    const [userId] = useLocalStorage('bingoUserId', crypto.randomUUID());

    // Store the board in localStorage to persist between refreshes
    const [board, setBoard] = useLocalStorage<BingoSquareType[]>(
        `bingoBoard-${size}`,
        generateBingoBoard(size, userId)
    );

    // Track if the user has a bingo
    const [hasBingo, setHasBingo] = useState(false);

    // Toggle the marked state of a square
    const toggleSquare = (id: string) => {
        setBoard(currentBoard => {
            const newBoard = currentBoard.map(square =>
                square.id === id ? { ...square, marked: !square.marked } : square
            );

            return newBoard;
        });
    };

    // Check for bingo whenever the board changes
    useEffect(() => {
        const bingo = checkForBingo(board, size);
        setHasBingo(bingo);
    }, [board, size]);

    return (
        <div className={`bingo-board size-${size}`}>
            {board.map(square => (
                <BingoSquare
                    key={square.id}
                    square={square}
                    onToggle={toggleSquare}
                />
            ))}

            {hasBingo && (
                <div className="bingo-message">BINGO!</div>
            )}
        </div>
    );
};

export default BingoBoard;
