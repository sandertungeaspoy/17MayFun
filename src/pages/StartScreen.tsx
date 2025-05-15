import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import MenuItem from '../components/common/MenuItem';
import { RoutePath } from '../types';

const StartScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="start-screen">
            <Header title="17. May Fun & Games" />

            <h2 className="start-screen-subtitle">Velg en aktivitet</h2>

            <div className="menu-grid">
                <MenuItem
                    icon="🎁"
                    title="Price Wheel"
                    onClick={() => navigate(RoutePath.PRICE_WHEEL)}
                />
                <MenuItem
                    icon="😈"
                    title="Punishment Wheel"
                    onClick={() => navigate(RoutePath.PUNISHMENT_WHEEL)}
                />
                <MenuItem
                    icon="📜"
                    title="Rules Wheel"
                    onClick={() => navigate(RoutePath.RULES_WHEEL)}
                />
                <MenuItem
                    icon="🎵"
                    title="Music Bingo"
                    onClick={() => navigate(RoutePath.MUSIC_BINGO)}
                />
                <MenuItem
                    icon="❓"
                    title="Quiz"
                    onClick={() => navigate(RoutePath.QUIZ)}
                />
            </div>

            <div className="flag-decoration"></div>
        </div>
    );
};

export default StartScreen;
