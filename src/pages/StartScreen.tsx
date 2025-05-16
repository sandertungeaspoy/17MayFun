import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import MenuItem from '../components/common/MenuItem';
import { RoutePath } from '../types';

const StartScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="start-screen">
            <Header title="17. Mai Lek & Moro" />

            <h2 className="start-screen-subtitle">Velg en aktivitet</h2>

            <div className="menu-grid">
                <MenuItem
                    icon="🎁"
                    title="Premiehjul"
                    onClick={() => navigate(RoutePath.PRICE_WHEEL)}
                />
                <MenuItem
                    icon="😈"
                    title="Straffehjul"
                    onClick={() => navigate(RoutePath.PUNISHMENT_WHEEL)}
                />
                <MenuItem
                    icon="📜"
                    title="Regelhjul"
                    onClick={() => navigate(RoutePath.RULES_WHEEL)}
                />
                <MenuItem
                    icon="🎵"
                    title="Musikkbingo"
                    onClick={() => navigate(RoutePath.MUSIC_BINGO)}
                />
                <MenuItem
                    icon="❓"
                    title="Quiz"
                    onClick={() => navigate(RoutePath.QUIZ)}
                />
                <MenuItem
                    icon="🎲"
                    title="Brettspill"
                    onClick={() => navigate(RoutePath.BOARD_GAME)}
                />
            </div>

            <div className="flag-decoration"></div>
        </div>
    );
};

export default StartScreen;
