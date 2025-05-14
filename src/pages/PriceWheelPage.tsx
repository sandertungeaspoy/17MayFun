import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Wheel from '../components/wheels/Wheel';
import { priceWheelItems } from '../utils/wheelUtils';
import { RoutePath } from '../types';

const PriceWheelPage = () => {
    const navigate = useNavigate();

    return (
        <div className="page-content">
            <Header
                title="Premiehjul"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <Wheel items={priceWheelItems} title="Spinn for premier!" />
        </div>
    );
};

export default PriceWheelPage;
