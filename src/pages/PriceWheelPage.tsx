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
                title="Price Wheel"
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            <Wheel items={priceWheelItems} title="Spin for a prize!" />
        </div>
    );
};

export default PriceWheelPage;
