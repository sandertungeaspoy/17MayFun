import React from 'react';
import type { QuizQuestion } from '../../types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextQuestion from './TextQuestion';
import ImageQuestion from './ImageQuestion';

interface QuizQuestionProps {
    question: QuizQuestion;
    onAnswer: (answer: string) => void;
    userAnswer?: string;
}

const QuizQuestionComponent: React.FC<QuizQuestionProps> = ({
    question,
    onAnswer,
    userAnswer
}) => {
    switch (question.type) {
        case 'multiple-choice':
            return (
                <MultipleChoiceQuestion
                    question={question}
                    onAnswer={onAnswer}
                    userAnswer={userAnswer}
                />
            );
        case 'text':
            return (
                <TextQuestion
                    question={question}
                    onAnswer={onAnswer}
                    userAnswer={userAnswer}
                />
            );
        case 'image':
            return (
                <ImageQuestion
                    question={question}
                    onAnswer={onAnswer}
                    userAnswer={userAnswer}
                />
            );
        default:
            return <div>Ukjent spørsmålstype</div>;
    }
};

export default QuizQuestionComponent;
