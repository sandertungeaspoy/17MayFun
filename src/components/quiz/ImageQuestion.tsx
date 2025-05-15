import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../types';

interface ImageQuestionProps {
    question: QuizQuestion;
    onAnswer: (answer: string) => void;
    userAnswer?: string;
}

const ImageQuestion: React.FC<ImageQuestionProps> = ({
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

    if (!question.imageUrl) {
        return <div>Feil: Ingen bilde tilgjengelig for dette spørsmålet.</div>;
    }

    return (
        <div className="question image-question">
            <h3 className="question-text">{question.question}</h3>

            <div className="image-container">
                <img
                    src={question.imageUrl}
                    alt="Spørsmålsbilde"
                    className="question-image"
                />
            </div>

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

export default ImageQuestion;
