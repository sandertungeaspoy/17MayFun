import { useState, useEffect } from 'react';
import BingoSquare from './BingoSquare';
import { checkForBingo, generateBingoBoard } from '../../utils/bingoUtils';
import type { BingoSquare as BingoSquareType, BoardSize } from '../../types';

interface BingoBoardProps {
    size: BoardSize;
}

const BingoBoard = ({ size }: BingoBoardProps) => {
    // State to store the current board
    const [board, setBoard] = useState<BingoSquareType[]>([]);

    // Track if the user has a bingo
    const [hasBingo, setHasBingo] = useState(false);

    // Load the board from localStorage when the component mounts or size changes
    useEffect(() => {
        // Get the userId from localStorage
        const userId = localStorage.getItem('bingoUserId') || crypto.randomUUID();

        // Try to get the board from localStorage
        const storedBoard = localStorage.getItem(`bingoBoard-${size}`);

        if (storedBoard) {
            // If the board exists in localStorage, use it
            try {
                const parsedBoard = JSON.parse(storedBoard) as BingoSquareType[];
                setBoard(parsedBoard);
            } catch (error) {
                console.error('Error parsing board from localStorage:', error);
                // If there's an error parsing, generate a new board
                const newBoard = generateBingoBoard(size, userId);
                setBoard(newBoard);
                localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));
            }
        } else {
            // If the board doesn't exist in localStorage, generate a new one
            const newBoard = generateBingoBoard(size, userId);
            setBoard(newBoard);
            localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));
        }
    }, [size]);

    // Toggle the marked state of a square
    const toggleSquare = (id: string) => {
        setBoard(currentBoard => {
            const newBoard = currentBoard.map(square =>
                square.id === id ? { ...square, marked: !square.marked } : square
            );

            // Save the updated board to localStorage
            localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));

            return newBoard;
        });
    };

    // Check for bingo whenever the board changes
    useEffect(() => {
        try {
            if (board.length > 0) {
                const bingo = checkForBingo(board, size);
                setHasBingo(bingo);
            } else {
                setHasBingo(false);
            }
        } catch (error) {
            console.error('Error checking for bingo:', error);
            setHasBingo(false);
        }
    }, [board, size]);

    // If the board is empty, show a loading message
    if (board.length === 0) {
        return <div className="loading-message">Laster bingobrett...</div>;
    }

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
