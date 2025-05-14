import type { BoardSize } from '../../types';

interface SizeSelectorProps {
    currentSize: BoardSize;
    onSizeChange: (size: BoardSize) => void;
}

const SizeSelector = ({ currentSize, onSizeChange }: SizeSelectorProps) => {
    const sizes: BoardSize[] = ['3x3', '4x4', '5x5'];

    return (
        <div className="size-selector">
            {sizes.map(size => (
                <button
                    key={size}
                    className={`size-button ${currentSize === size ? 'active' : ''}`}
                    onClick={() => onSizeChange(size)}
                >
                    {size}
                </button>
            ))}
        </div>
    );
};

export default SizeSelector;
