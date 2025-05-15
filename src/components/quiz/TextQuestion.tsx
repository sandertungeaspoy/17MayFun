import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../types';

interface TextQuestionProps {
    question: QuizQuestion;
    onAnswer: (answer: string) => void;
    userAnswer?: string;
}

const TextQuestion: React.FC<TextQuestionProps> = ({
    question,
    onAnswer,
    userAnswer
}) => {
    const [inputValue, setInputValue] = useState(userAnswer || '');

    // Update local state when userAnswer prop changes
    useEffect(() => {
        if (userAnswer !== undefined) {
            setInputValue(userAnswer);
        }
    }, [userAnswer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const handleBlur = () => {
        onAnswer(inputValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnswer(inputValue);
    };

    return (
        <div className="question text-question">
            <h3 className="question-text">{question.question}</h3>

            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Skriv ditt svar her..."
                        className="text-answer-input"
                    />
                </div>
                <button type="submit" className="submit-answer">Svar</button>
            </form>
        </div>
    );
};

export default TextQuestion;
