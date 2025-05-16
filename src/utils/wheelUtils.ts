import type { WheelItem } from '../types';

// Sample wheel items for the price wheel
export const priceWheelItems: WheelItem[] = [
    { id: '1', text: 'Gi 1 slurk', icon: '🥤', color: '#BA0C2F' },
    { id: '2', text: 'Gi 2 slurker', icon: '🥤', color: '#FFFFFF' },
    { id: '3', text: 'Gi 3 slurker', icon: '🥤', color: '#00205B' },
    { id: '4', text: 'Gratis shot', icon: '🍾', color: '#BA0C2F' },
    { id: '5', text: 'Velg noen som må drikke', icon: '👉', color: '#FFFFFF' },
    { id: '6', text: 'Alle drikker', icon: '🎉', color: '#00205B' },
    { id: '7', text: 'Gratis shot', icon: '🍾', color: '#BA0C2F' },
    { id: '8', text: 'Skål!', icon: '🥂', color: '#FFFFFF' }
];

// Sample wheel items for the punishment wheel
export const punishmentWheelItems: WheelItem[] = [
    { id: '1', text: 'Ta 1 slurk', icon: '🥤', color: '#BA0C2F' },
    { id: '2', text: 'Ta 2 slurker', icon: '🥤', color: '#FFFFFF' },
    { id: '3', text: 'Ta 3 slurker', icon: '🥤', color: '#00205B' },
    { id: '4', text: 'Spinn regelhjulet', icon: '📜', color: '#BA0C2F' },
    { id: '5', text: 'Tøm drikken din', icon: '🍺', color: '#FFFFFF' },
    { id: '6', text: 'Ta en shot', icon: '🥃', color: '#00205B' },
    { id: '7', text: 'Spinn regelhjulet', icon: '📜', color: '#BA0C2F' },
    { id: '8', text: 'Hopp over en runde', icon: '⏭️', color: '#FFFFFF' },
];

// Sample wheel items for the rules wheel
export const rulesWheelItems: WheelItem[] = [
    { id: '1', text: 'Ingen peking', icon: '👉', color: '#BA0C2F' },
    { id: '2', text: 'Drikk med ikke-dominant hånd', icon: '🤚', color: '#FFFFFF' },
    { id: '3', text: 'Ingen navn', icon: '📛', color: '#00205B' },
    { id: '4', text: 'Ikke si "drikke"', icon: '🙊', color: '#BA0C2F' },
    { id: '5', text: 'Ingen toalettpauser', icon: '🚽', color: '#FFFFFF' },
    { id: '6', text: 'Må skåle før du drikker', icon: '🥂', color: '#00205B' },
    { id: '7', text: 'Snakk med aksent', icon: '🗣️', color: '#BA0C2F' },
    { id: '8', text: 'Ingen telefoner', icon: '📱', color: '#FFFFFF' }
];

// Function to get a random item from a wheel
export const getRandomWheelItem = (items: WheelItem[]): WheelItem => {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
};

// Function to calculate the rotation angle for a specific item
export const calculateRotationForItem = (items: WheelItem[], targetId: string): number => {
    const segmentAngle = 360 / items.length;
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (targetIndex === -1) return 0;

    // Calculate base angle to land on the target segment
    // Add random offset within the segment for natural feel
    // Add extra rotations for spinning effect (e.g., 5 full rotations)
    const baseAngle = targetIndex * segmentAngle;
    const randomOffset = Math.random() * (segmentAngle * 0.7); // Random position within segment
    const extraRotations = 5 * 360; // 5 full rotations

    // The final angle needs to be negative for clockwise rotation in CSS
    return -(baseAngle + randomOffset + extraRotations);
};
