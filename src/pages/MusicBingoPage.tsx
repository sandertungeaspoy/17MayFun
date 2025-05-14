import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import BingoBoard from '../components/bingo/BingoBoard';
import SizeSelector from '../components/bingo/SizeSelector';
import useLocalStorage from '../hooks/useLocalStorage';
import { RoutePath } from '../types';
import type { BoardSize } from '../types';

const MusicBingoPage = () => {
    const navigate = useNavigate();
    const [boardSize, setBoardSize] = useLocalStorage<BoardSize>('bingoSize', '3x3');

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
