import type { BingoSquare as BingoSquareType } from '../../types';

interface BingoSquareProps {
    square: BingoSquareType;
    onToggle: (id: string) => void;
}

const BingoSquare = ({ square, onToggle }: BingoSquareProps) => {
    const handleClick = () => {
        onToggle(square.id);
    };

    return (
        <div
            className={`bingo-square ${square.marked ? 'marked' : ''}`}
            onClick={handleClick}
        >
            {square.songTitle}
        </div>
    );
};

export default BingoSquare;
