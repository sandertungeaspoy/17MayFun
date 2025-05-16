import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Wheel from '../components/wheels/Wheel';
import { punishmentWheelItems } from '../utils/wheelUtils';
import { RoutePath } from '../types';

const PunishmentWheelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="page-content">
            <Header
                title="Straffehjul"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <Wheel items={punishmentWheelItems} title="Spinn for straff!" />
        </div>
    );
};

export default PunishmentWheelPage;
