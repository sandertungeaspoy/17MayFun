import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/common/Header';
import BingoBoard from '../components/bingo/BingoBoard';
import SizeSelector from '../components/bingo/SizeSelector';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateBingoBoard } from '../utils/bingoUtils';
import { RoutePath } from '../types';
import type { BoardSize } from '../types';

const MusicBingoPage = () => {
    const navigate = useNavigate();
    const [boardSize, setBoardSize] = useLocalStorage<BoardSize>('bingoSize', '3x3');

    // Generate a unique user ID for persistence if not already exists
    useEffect(() => {
        // Ensure we have a userId
        if (!localStorage.getItem('bingoUserId')) {
            localStorage.setItem('bingoUserId', crypto.randomUUID());
        }

        // Pre-generate all board sizes to ensure they're available
        const userId = localStorage.getItem('bingoUserId') || '';
        const sizes: BoardSize[] = ['3x3', '4x4', '5x5'];

        sizes.forEach(size => {
            try {
                // Check if board exists and is valid
                const storedBoard = localStorage.getItem(`bingoBoard-${size}`);

                if (storedBoard) {
                    try {
                        // Validate the stored board
                        const parsedBoard = JSON.parse(storedBoard);
                        const { rows, cols } = size === '3x3' ? { rows: 3, cols: 3 } :
                            size === '4x4' ? { rows: 4, cols: 4 } :
                                { rows: 5, cols: 5 };

                        // Check if board has the correct number of squares
                        if (!Array.isArray(parsedBoard) || parsedBoard.length !== rows * cols) {
                            throw new Error('Invalid board structure');
                        }

                        // Check if all squares have the required properties
                        const isValid = parsedBoard.every(square =>
                            square &&
                            typeof square.id === 'string' &&
                            typeof square.songTitle === 'string' &&
                            typeof square.marked === 'boolean'
                        );

                        if (!isValid) {
                            throw new Error('Invalid square properties');
                        }
                    } catch (error) {
                        console.error(`Invalid board data for size ${size}:`, error);
                        // Generate a new board if the stored one is invalid
                        const newBoard = generateBingoBoard(size, userId);
                        localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));
                    }
                } else {
                    // Generate a new board if none exists
                    const newBoard = generateBingoBoard(size, userId);
                    localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));
                }
            } catch (error) {
                console.error(`Error processing board size ${size}:`, error);
                // Fallback: generate a new board
                const newBoard = generateBingoBoard(size, userId);
                localStorage.setItem(`bingoBoard-${size}`, JSON.stringify(newBoard));
            }
        });
    }, []);

    const handleSizeChange = (size: BoardSize) => {
        setBoardSize(size);
    };

    return (
        <div className="page-content">
            <Header
                title="Musikk Bingo"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <div className="bingo-container">
                <h2>Klikk på sangene du hører!</h2>
                <p>Brettet ditt er lagret, så du kan ikke jukse ved å laste siden på nytt.</p>

                <SizeSelector
                    currentSize={boardSize}
                    onSizeChange={handleSizeChange}
                />

                <BingoBoard size={boardSize} />
            </div>
        </div>
    );
};

export default MusicBingoPage;
