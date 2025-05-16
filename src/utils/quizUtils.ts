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
