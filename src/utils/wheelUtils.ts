import type { WheelItem } from '../types';

// Sample wheel items for the price wheel
export const priceWheelItems: WheelItem[] = [
    { id: '1', text: 'Give 1 sip', icon: '🥤', color: '#BA0C2F' },
    { id: '2', text: 'Give 2 sips', icon: '🥤', color: '#FFFFFF' },
    { id: '3', text: 'Give 3 sips', icon: '🥤', color: '#00205B' },
    { id: '4', text: 'Give 5 sips', icon: '🍻', color: '#BA0C2F' },
    { id: '5', text: 'Choose someone to drink', icon: '👉', color: '#FFFFFF' },
    { id: '6', text: 'Everyone drinks', icon: '🎉', color: '#00205B' },
    { id: '7', text: 'Give out 10 sips', icon: '🍾', color: '#BA0C2F' },
    { id: '8', text: 'Cheers!', icon: '🥂', color: '#FFFFFF' }
];

// Sample wheel items for the punishment wheel
export const punishmentWheelItems: WheelItem[] = [
    { id: '1', text: 'Take 1 sip', icon: '🥤', color: '#BA0C2F' },
    { id: '2', text: 'Take 2 sips', icon: '🥤', color: '#FFFFFF' },
    { id: '3', text: 'Take 3 sips', icon: '🥤', color: '#00205B' },
    { id: '4', text: 'Take 5 sips', icon: '🍻', color: '#BA0C2F' },
    { id: '5', text: 'Finish your drink', icon: '🍺', color: '#FFFFFF' },
    { id: '6', text: 'Take a shot', icon: '🥃', color: '#00205B' },
    { id: '7', text: 'Spin the rules wheel', icon: '📜', color: '#BA0C2F' },
    { id: '8', text: 'Skip a round', icon: '⏭️', color: '#FFFFFF' },
];

// Sample wheel items for the rules wheel
export const rulesWheelItems: WheelItem[] = [
    { id: '1', text: 'No pointing', icon: '👉', color: '#BA0C2F' },
    { id: '2', text: 'Drink with non-dominant hand', icon: '🤚', color: '#FFFFFF' },
    { id: '3', text: 'No names', icon: '📛', color: '#00205B' },
    { id: '4', text: 'No saying "drink"', icon: '🙊', color: '#BA0C2F' },
    { id: '5', text: 'No bathroom breaks', icon: '🚽', color: '#FFFFFF' },
    { id: '6', text: 'Must toast before drinking', icon: '🥂', color: '#00205B' },
    { id: '7', text: 'Speak in accent', icon: '🗣️', color: '#BA0C2F' },
    { id: '8', text: 'No phones', icon: '📱', color: '#FFFFFF' }
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
