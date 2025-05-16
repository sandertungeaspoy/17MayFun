import type { QuizConfig, QuizAttempt, UserAnswer } from '../types';

// Simple encryption/decryption functions
// Note: In a production app, you would use a more secure encryption library
export const encryptAnswer = (answer: string, salt: string): string => {
    // Simple XOR encryption for demonstration purposes
    const encrypted = Array.from(answer).map((char, i) => {
        const saltChar = salt[i % salt.length];
        return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
    }).join('');

    // Convert to base64 for storage
    return btoa(encrypted);
};

export const decryptAnswer = (encryptedAnswer: string, salt: string): string => {
    try {
        // Decode from base64
        const encrypted = atob(encryptedAnswer);

        // Reverse the XOR encryption
        return Array.from(encrypted).map((char, i) => {
            const saltChar = salt[i % salt.length];
            return String.fromCharCode(char.charCodeAt(0) ^ saltChar.charCodeAt(0));
        }).join('');
    } catch (error) {
        console.error('Decryption error:', error);
        return 'Dekrypteringsfeil';
    }
};

// Password hashing and verification
// In a real app, you would use a proper hashing library
export const hashPassword = (password: string): string => {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
};

// Expose hashPassword function on window object for debug console
declare global {
    interface Window {
        hashPassword: (password: string) => string;
    }
}

// Add hashPassword to window object if we're in a browser environment
if (typeof window !== 'undefined') {
    window.hashPassword = hashPassword;
}

// Default password hash for backward compatibility
export const QUIZ_PASSWORD_HASH = hashPassword('17mai');

// Salt for encryption - in a real app, this would be more secure
export const ENCRYPTION_SALT = 'NorwegianQuiz2025';

// Verify if the provided password is correct for a specific quiz
export const isPasswordCorrect = (password: string, quiz?: QuizConfig): boolean => {
    if (!quiz) {
        // Fallback to default password for backward compatibility
        return password === '17mai';
    }

    // If quiz has a passwordHash, use it
    if (quiz.passwordHash) {
        return hashPassword(password) === quiz.passwordHash;
    }

    // Otherwise use the default password
    return password === '17mai';
};

// Local storage functions
export const saveQuizAttempt = (attempt: QuizAttempt): void => {
    const attempts = getQuizAttempts();
    attempts.push(attempt);
    localStorage.setItem('quizAttempts', JSON.stringify(attempts));
};

export const getQuizAttempts = (): QuizAttempt[] => {
    const attemptsJson = localStorage.getItem('quizAttempts');
    return attemptsJson ? JSON.parse(attemptsJson) : [];
};

export const getUserAnswersForQuiz = (quizId: string): UserAnswer[] => {
    const attempts = getQuizAttempts();
    const latestAttempt = attempts
        .filter(attempt => attempt.quizId === quizId)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    return latestAttempt?.answers || [];
};

// Quiz categories
export const quizCategories = [
    {
        id: 'general',
        title: 'Allmennkunnskap',
        description: 'Generelle spørsmål om verden rundt oss'
    },
    {
        id: 'norway',
        title: 'Norge',
        description: 'Spørsmål om norsk kultur, historie og geografi'
    },
    {
        id: 'entertainment',
        title: 'Underholdning',
        description: 'Spørsmål om film, musikk og TV'
    },
    {
        id: 'food',
        title: 'Mat og Drikke',
        description: 'Spørsmål om kulinariske emner'
    }
];

// Sample quiz data
// In a real app, you might load this from a JSON file or API
export const quizzes: QuizConfig[] = [
    {
        id: 'mixed-quiz',
        title: 'Allmennkunnskap Quiz',
        description: 'Test din kunnskap om Norge og verden',
        passwordHash: hashPassword('allmenn'),
        questions: [
            // Norske spørsmål
            {
                id: '1',
                type: 'multiple-choice',
                question: 'Når er Norges nasjonaldag?',
                options: ['1. mai', '17. mai', '6. juni', '24. desember'],
                answer: encryptAnswer('17. mai', ENCRYPTION_SALT)
            },
            {
                id: '2',
                type: 'text',
                question: 'Hva heter Norges hovedstad?',
                answer: encryptAnswer('Oslo', ENCRYPTION_SALT)
            },
            {
                id: '3',
                type: 'multiple-choice',
                question: 'Hvilken farge er ikke i det norske flagget?',
                options: ['Rød', 'Hvit', 'Blå', 'Gul'],
                answer: encryptAnswer('Gul', ENCRYPTION_SALT)
            },

            // Generelle spørsmål
            {
                id: '4',
                type: 'multiple-choice',
                question: 'Hvilket år startet andre verdenskrig?',
                options: ['1914', '1939', '1945', '1950'],
                answer: encryptAnswer('1939', ENCRYPTION_SALT)
            },
            {
                id: '5',
                type: 'text',
                question: 'Hva er hovedingrediensen i guacamole?',
                answer: encryptAnswer('Avokado', ENCRYPTION_SALT)
            },
            {
                id: '6',
                type: 'multiple-choice',
                question: 'Hvilken planet er kjent som den røde planeten?',
                options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
                answer: encryptAnswer('Mars', ENCRYPTION_SALT)
            },
            {
                id: '7',
                type: 'multiple-choice',
                question: 'Hva er hovedstaden i Japan?',
                options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
                answer: encryptAnswer('Tokyo', ENCRYPTION_SALT)
            },
            {
                id: '8',
                type: 'text',
                question: 'Hvor mange bein har et voksent menneske?',
                answer: encryptAnswer('206', ENCRYPTION_SALT)
            },
            {
                id: '9',
                type: 'multiple-choice',
                question: 'Hvilket element har symbolet "O" i periodesystemet?',
                options: ['Osmium', 'Oksygen', 'Oganesson', 'Oksid'],
                answer: encryptAnswer('Oksygen', ENCRYPTION_SALT)
            },
            {
                id: '10',
                type: 'multiple-choice',
                question: 'Hvilken frukt er kjent som "kjærlighetseple" på norsk?',
                options: ['Eple', 'Tomat', 'Fersken', 'Jordbær'],
                answer: encryptAnswer('Tomat', ENCRYPTION_SALT)
            },
            {
                id: "11",
                type: "multiple-choice",
                question: "Hvilken artist ga ut albumet *Future Nostalgia* i 2020?",
                options: ["Billie Eilish", "Dua Lipa", "Ariana Grande", "Olivia Rodrigo"],
                answer: encryptAnswer("Dua Lipa", ENCRYPTION_SALT)
            },
            {
                id: "12",
                type: "text",
                question: "Hva er hovedstaden i New Zealand?",
                answer: encryptAnswer("Wellington", ENCRYPTION_SALT)
            },
            {
                id: "13",
                type: "image",
                question: "Hvilket videospill vises på dette bildet?",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Among_Us_cover_art.jpg",
                answer: encryptAnswer("Among Us", ENCRYPTION_SALT)
            },
            {
                id: "14",
                type: "multiple-choice",
                question: "Hva står forkortelsen 'NFT' for?",
                options: [
                    "Non-Fictional Trend",
                    "New Financial Token",
                    "Non-Fungible Token",
                    "Next Future Technology"
                ],
                answer: encryptAnswer("Non-Fungible Token", ENCRYPTION_SALT)
            },
            {
                id: "15",
                type: "text",
                question: "Hvem regisserte filmen *Oppenheimer* som kom ut i 2023?",
                answer: encryptAnswer("Christopher Nolan", ENCRYPTION_SALT)
            },
            {
                id: "16",
                type: "multiple-choice",
                question: "Hvilken av disse var IKKE en start-Pokémon i de originale Pokémon Red/Blue-spillene?",
                options: ["Bulbasaur", "Charmander", "Squirtle", "Pikachu"],
                answer: encryptAnswer("Pikachu", ENCRYPTION_SALT)
            },
            {
                id: "17",
                type: "text",
                question: "Hva heter den fiktive kaféen i TV-serien *Friends*?",
                answer: encryptAnswer("Central Perk", ENCRYPTION_SALT)
            },
            {
                id: "18",
                type: "multiple-choice",
                question: "Hvilket år ble TikTok lansert globalt (utenfor Kina)?",
                options: ["2016", "2017", "2018", "2019"],
                answer: encryptAnswer("2018", ENCRYPTION_SALT)
            },
            {
                id: "19",
                type: "image",
                question: "Hva heter filmen dette bildet er hentet fra?",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a1/Inception_ver3.jpg",
                answer: encryptAnswer("Inception", ENCRYPTION_SALT)
            },
            {
                id: "20",
                type: "text",
                question: "Hva heter kryptovalutaen med forkortelsen ETH?",
                answer: encryptAnswer("Ethereum", ENCRYPTION_SALT)
            },
            {
                id: "21",
                type: "multiple-choice",
                question: "Hvilken app ble først kjent for å bruke dansetrender til musikk?",
                options: ["Instagram", "Snapchat", "TikTok", "BeReal"],
                answer: encryptAnswer("TikTok", ENCRYPTION_SALT)
            },
            {
                id: "22",
                type: "text",
                question: "Hva heter hovedstaden i Canada?",
                answer: encryptAnswer("Ottawa", ENCRYPTION_SALT)
            },
            {
                id: "23",
                type: "image",
                question: "Hvilket spillserien er denne karakteren fra?",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/95/MarioSMBW.png",
                answer: encryptAnswer("Super Mario", ENCRYPTION_SALT)
            },
            {
                id: "24",
                type: "multiple-choice",
                question: "Hva er navnet på det største havet på jorda?",
                options: ["Atlanterhavet", "Stillehavet", "Det indiske hav", "Nordishavet"],
                answer: encryptAnswer("Stillehavet", ENCRYPTION_SALT)
            },
            {
                id: "25",
                type: "text",
                question: "Hva heter Norges eldste universitet?",
                answer: encryptAnswer("Universitetet i Oslo", ENCRYPTION_SALT)
            },
            {
                id: "26",
                type: "multiple-choice",
                question: "Hvilket av disse er en kryptovaluta?",
                options: ["Litecoin", "PayPal", "Swish", "eToro"],
                answer: encryptAnswer("Litecoin", ENCRYPTION_SALT)
            },
            {
                id: "27",
                type: "text",
                question: "Hva heter Norges nasjonaldag?",
                answer: encryptAnswer("17. mai", ENCRYPTION_SALT)
            },
            {
                id: "28",
                type: "multiple-choice",
                question: "Hvilken norsk TV-serie handler om ungdom på Hartvig Nissen videregående?",
                options: ["Rådebank", "Skam", "Exit", "Hvite gutter"],
                answer: encryptAnswer("Skam", ENCRYPTION_SALT)
            },
            {
                id: "29",
                type: "text",
                question: "Hva er hovedstaden i Island?",
                answer: encryptAnswer("Reykjavik", ENCRYPTION_SALT)
            },
            {
                id: "30",
                type: "image",
                question: "Hvilken film kommer dette bildet fra?",
                imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/0e/Barbie_2023_poster.jpg",
                answer: encryptAnswer("Barbie", ENCRYPTION_SALT)
            },
            {
                id: "31",
                type: "multiple-choice",
                question: "Hvilken planet er nærmest sola?",
                options: ["Venus", "Jorda", "Merkur", "Mars"],
                answer: encryptAnswer("Merkur", ENCRYPTION_SALT)
            },
            {
                id: "32",
                type: "text",
                question: "Hva heter grunnleggeren av Tesla og SpaceX?",
                answer: encryptAnswer("Elon Musk", ENCRYPTION_SALT)
            },
            {
                id: "33",
                type: "multiple-choice",
                question: "Hva er navnet på karakteren som sier «I am Groot»?",
                options: ["Hulk", "Rocket", "Groot", "Thanos"],
                answer: encryptAnswer("Groot", ENCRYPTION_SALT)
            },
            {
                id: "34",
                type: "text",
                question: "Hva kalles språket man snakker i Brasil?",
                answer: encryptAnswer("Portugisisk", ENCRYPTION_SALT)
            },
            {
                id: "35",
                type: "multiple-choice",
                question: "Hva heter bandet som ga ut *Bohemian Rhapsody*?",
                options: ["The Beatles", "Queen", "Pink Floyd", "Led Zeppelin"],
                answer: encryptAnswer("Queen", ENCRYPTION_SALT)
            },
            {
                id: "36",
                type: "text",
                question: "Hva er det kjemiske symbolet for gull?",
                answer: encryptAnswer("Au", ENCRYPTION_SALT)
            },
            {
                id: "37",
                type: "multiple-choice",
                question: "Hva slags matrett er 'ramen'?",
                options: ["Sushi", "Risrett", "Nudelsuppe", "Grillet kjøtt"],
                answer: encryptAnswer("Nudelsuppe", ENCRYPTION_SALT)
            },
            {
                id: "38",
                type: "text",
                question: "Hva heter dokumentaren om den famøse Fyre Festival?",
                answer: encryptAnswer("Fyre: The Greatest Party That Never Happened", ENCRYPTION_SALT)
            },
            {
                id: "39",
                type: "multiple-choice",
                question: "Hvem vant Eurovision Song Contest i 2023?",
                options: ["Sverige", "Finland", "Italia", "Ukraina"],
                answer: encryptAnswer("Sverige", ENCRYPTION_SALT)
            },
            {
                id: "40",
                type: "text",
                question: "Fullfør dette kjente internettuttrykket: 'OK, boomer' – hva kommer etter?",
                answer: encryptAnswer("Nothing, that’s it.", ENCRYPTION_SALT)
            }
        ]
    },
    {
        id: 'norway-quiz',
        title: 'Norgesquiz',
        description: 'Test din kunnskap om Norge',
        passwordHash: hashPassword('norge'),
        questions: [
            {
                id: '1',
                type: 'multiple-choice',
                question: 'Hva heter Norges høyeste fjell?',
                options: ['Glittertind', 'Galdhøpiggen', 'Snøhetta', 'Gaustatoppen'],
                answer: encryptAnswer('Galdhøpiggen', ENCRYPTION_SALT)
            },
            {
                id: '2',
                type: 'text',
                question: 'Hvilken by kalles "Nordens Paris"?',
                answer: encryptAnswer('Trondheim', ENCRYPTION_SALT)
            },
            {
                id: '3',
                type: 'multiple-choice',
                question: 'Hvilket år fikk Norge sin egen grunnlov?',
                options: ['1814', '1905', '1945', '1994'],
                answer: encryptAnswer('1814', ENCRYPTION_SALT)
            },
            {
                id: '4',
                type: 'multiple-choice',
                question: 'Hvilken norsk forfatter skrev "Sult"?',
                options: ['Henrik Ibsen', 'Knut Hamsun', 'Sigrid Undset', 'Jo Nesbø'],
                answer: encryptAnswer('Knut Hamsun', ENCRYPTION_SALT)
            },
            {
                id: '5',
                type: 'text',
                question: 'Hva heter Norges lengste elv?',
                answer: encryptAnswer('Glomma', ENCRYPTION_SALT)
            }
        ]
    }
];

// Function to get a quiz by ID
export const getQuizById = (id: string): QuizConfig | undefined => {
    return quizzes.find(quiz => quiz.id === id);
};

// Function to get all quizzes
export const getAllQuizzes = (): QuizConfig[] => {
    return quizzes;
};
