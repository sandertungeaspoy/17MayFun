import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Wheel from '../components/wheels/Wheel';
import { rulesWheelItems } from '../utils/wheelUtils';
import { RoutePath } from '../types';

const RulesWheelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="page-content">
            <Header
                title="Regelhjul"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <Wheel items={rulesWheelItems} title="Spinn for nye regler!" />
        </div>
    );
};

export default RulesWheelPage;
