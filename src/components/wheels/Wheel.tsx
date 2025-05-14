import { useState, useRef, useEffect } from 'react';
import type { WheelItem } from '../../types';
import { getRandomWheelItem, calculateRotationForItem } from '../../utils/wheelUtils';

interface WheelProps {
    items: WheelItem[];
    title: string;
}

const Wheel = ({ items, title }: WheelProps) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<WheelItem | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        setResult(null);

        // Get a random item
        const selectedItem = getRandomWheelItem(items);

        // Calculate rotation to land on the selected item
        const rotation = calculateRotationForItem(items, selectedItem.id);

        // Apply rotation to wheel
        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${rotation}deg)`;
        }

        // Set result after animation completes
        setTimeout(() => {
            setResult(selectedItem);
            setSpinning(false);
        }, 5000); // Match the CSS transition duration
    };

    // Reset wheel position when not spinning
    useEffect(() => {
        if (!spinning && wheelRef.current) {
            wheelRef.current.style.transition = 'none';
            wheelRef.current.style.transform = 'rotate(0deg)';

            // Force a reflow to apply the style changes
            void wheelRef.current.offsetHeight;

            // Re-enable transitions
            wheelRef.current.style.transition = 'transform 5s cubic-bezier(0.1, 0.01, 0.2, 1)';
        }
    }, [spinning]);

    // Create wheel segments
    const segmentAngle = 360 / items.length;

    return (
        <div className="wheel-container">
            <h2>{title}</h2>

            <div className="wheel">
                <div className="wheel-marker"></div>

                <div className="wheel-inner" ref={wheelRef}>
                    {items.map((item, index) => {
                        // Calculate the rotation for this segment
                        const rotation = index * segmentAngle;

                        return (
                            <div
                                key={item.id}
                                className="wheel-segment"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    backgroundColor: item.color
                                }}
                            >
                                {/* Position the content */}
                                <div
                                    className="wheel-segment-content"
                                    style={{
                                        // Adjust the rotation to make text readable
                                        // transform: `rotate(${45}deg)`,
                                    }}
                                >
                                    {/* <div className="wheel-segment-icon">{item.icon}</div> */}
                                    <div className="wheel-segment-text">{item.text} {item.icon}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="wheel-center"></div>
            </div>

            <button
                className="spin-button"
                onClick={spinWheel}
                disabled={spinning}
            >
                {spinning ? 'Spinning...' : 'Spin the wheel!'}
            </button>

            {result && (
                <div className="result-display">
                    <div className="result-icon">{result.icon}</div>
                    <div className="result-text">{result.text}</div>
                </div>
            )}
        </div>
    );
};

export default Wheel;
