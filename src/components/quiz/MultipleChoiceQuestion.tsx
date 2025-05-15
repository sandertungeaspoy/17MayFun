import React from 'react';
import type { QuizQuestion } from '../../types';

interface MultipleChoiceQuestionProps {
    question: QuizQuestion;
    onAnswer: (answer: string) => void;
    userAnswer?: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
    question,
    onAnswer,
    userAnswer
}) => {
    if (!question.options) {
        return <div>Feil: Ingen alternativer tilgjengelig for dette spørsmålet.</div>;
    }

    return (
        <div className="question multiple-choice-question">
            <h3 className="question-text">{question.question}</h3>

            <div className="options-container">
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${userAnswer === option ? 'selected' : ''}`}
                        onClick={() => onAnswer(option)}
                    >
                        <input
                            type="radio"
                            id={`option-${question.id}-${index}`}
                            name={`question-${question.id}`}
                            value={option}
                            checked={userAnswer === option}
                            onChange={() => onAnswer(option)}
                        />
                        <label htmlFor={`option-${question.id}-${index}`}>
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;
