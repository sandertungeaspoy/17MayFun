import React, { useState } from 'react';
import type { QuizConfig, UserAnswer } from '../../types';
import { decryptAnswer, isPasswordCorrect, ENCRYPTION_SALT } from '../../utils/quizUtils';

interface QuizResultsProps {
    quiz: QuizConfig;
    userAnswers: UserAnswer[];
    onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quiz, userAnswers, onRestart }) => {
    const [password, setPassword] = useState('');
    const [showAnswers, setShowAnswers] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isPasswordCorrect(password, quiz)) {
            setShowAnswers(true);
            setError('');
        } else {
            setError('Feil passord. Prøv igjen.');
        }
    };

    // Get user answer for a specific question
    const getUserAnswer = (questionId: string): string | undefined => {
        const answer = userAnswers.find(a => a.questionId === questionId);
        return answer?.answer;
    };

    return (
        <div className="quiz-results">
            <h2>Quiz Resultater</h2>

            <div className="user-answers">
                <h3>Dine svar</h3>
                <ul className="answers-list">
                    {quiz.questions.map((question) => {
                        const userAnswer = getUserAnswer(question.id);
                        return (
                            <li key={question.id} className="answer-item">
                                <div className="question-text">{question.question}</div>
                                <div className="user-answer">
                                    <strong>Ditt svar:</strong> {userAnswer || 'Ikke besvart'}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {!showAnswers ? (
                <div className="password-form">
                    <h3>Se fasit</h3>
                    <p>Skriv inn passord for å se de riktige svarene:</p>

                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Passord"
                            className="password-input"
                        />
                        <button type="submit" className="password-submit">Vis fasit</button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <div className="correct-answers">
                    <h3>Fasit</h3>
                    <ul className="answers-list">
                        {quiz.questions.map((question) => {
                            const userAnswer = getUserAnswer(question.id);
                            const correctAnswer = decryptAnswer(question.answer, ENCRYPTION_SALT);
                            const isCorrect = userAnswer?.toLowerCase() === correctAnswer.toLowerCase();

                            return (
                                <li key={question.id} className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                    <div className="question-text">{question.question}</div>
                                    <div className="user-answer">
                                        <strong>Ditt svar:</strong> {userAnswer || 'Ikke besvart'}
                                    </div>
                                    <div className="correct-answer">
                                        <strong>Riktig svar:</strong> {correctAnswer}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="quiz-actions">
                <button onClick={onRestart} className="restart-button">
                    Ta quizen på nytt
                </button>
            </div>
        </div>
    );
};

export default QuizResults;
