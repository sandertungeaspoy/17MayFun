import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import {
    getQuizById,
    getAllQuizzes,
    saveQuizAttempt,
    getUserAnswersForQuiz
} from '../utils/quizUtils';
import type { UserAnswer, QuizConfig } from '../types';
import { RoutePath } from '../types';

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const { quizId } = useParams<{ quizId?: string }>();

    const [quizzes, setQuizzes] = useState<QuizConfig[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizConfig | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load quizzes and user answers
    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const allQuizzes = getAllQuizzes();
                setQuizzes(allQuizzes);

                // If quizId is provided, load that quiz
                if (quizId) {
                    const quiz = getQuizById(quizId);
                    if (quiz) {
                        setSelectedQuiz(quiz);

                        // Load user's previous answers for this quiz
                        const savedAnswers = getUserAnswersForQuiz(quizId);
                        if (savedAnswers.length > 0) {
                            setUserAnswers(savedAnswers);
                        }
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading quiz data:', error);
                setLoading(false);
            }
        };

        loadQuizzes();
    }, [quizId]);

    // Handle quiz selection
    const handleQuizSelect = (quiz: QuizConfig) => {
        setSelectedQuiz(quiz);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setQuizCompleted(false);

        // Update URL to include quiz ID
        navigate(`/quiz/${quiz.id}`);
    };

    // Handle answer submission
    const handleAnswer = (answer: string) => {
        if (!selectedQuiz) return;

        const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

        // Update or add the answer
        setUserAnswers(prev => {
            const existingAnswerIndex = prev.findIndex(a => a.questionId === currentQuestion.id);

            if (existingAnswerIndex >= 0) {
                // Update existing answer
                const updated = [...prev];
                updated[existingAnswerIndex] = {
                    ...updated[existingAnswerIndex],
                    answer
                };
                return updated;
            } else {
                // Add new answer
                return [...prev, {
                    questionId: currentQuestion.id,
                    answer
                }];
            }
        });
    };

    // Navigate to next question
    const handleNextQuestion = () => {
        if (!selectedQuiz) return;

        if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Quiz completed
            completeQuiz();
        }
    };

    // Navigate to previous question
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Complete the quiz and save results
    const completeQuiz = () => {
        if (!selectedQuiz) return;

        // Save quiz attempt to local storage
        saveQuizAttempt({
            quizId: selectedQuiz.id,
            timestamp: Date.now(),
            answers: userAnswers
        });

        setQuizCompleted(true);
    };

    // Restart the quiz
    const handleRestart = () => {
        if (!selectedQuiz) return;

        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setQuizCompleted(false);
    };

    // Get the current user answer for the current question
    const getCurrentUserAnswer = (): string | undefined => {
        if (!selectedQuiz) return undefined;

        const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
        return userAnswers.find(a => a.questionId === currentQuestion.id)?.answer;
    };

    // Render quiz selection
    if (!selectedQuiz && !loading) {
        return (
            <div className="page-content">
                <Header
                    title="Quiz"
                    showBackButton={true}
                    onBack={() => navigate(RoutePath.HOME)}
                />

                <div className="quiz-selection">
                    <h2>Velg en quiz</h2>

                    <div className="quiz-list">
                        {quizzes.map(quiz => (
                            <div
                                key={quiz.id}
                                className="quiz-item"
                                onClick={() => handleQuizSelect(quiz)}
                            >
                                <h3>{quiz.title}</h3>
                                <p>{quiz.description}</p>
                                <span className="question-count">
                                    {quiz.questions.length} spørsmål
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="page-content">
                <Header
                    title="Quiz"
                    showBackButton={true}
                    onBack={() => navigate(RoutePath.HOME)}
                />
                <div className="loading">Laster...</div>
            </div>
        );
    }

    // Show quiz results if completed
    if (quizCompleted && selectedQuiz) {
        return (
            <div className="page-content">
                <Header
                    title={selectedQuiz.title}
                    showBackButton={true}
                    onBack={() => navigate(RoutePath.HOME)}
                />

                <QuizResults
                    quiz={selectedQuiz}
                    userAnswers={userAnswers}
                    onRestart={handleRestart}
                />
            </div>
        );
    }

    // Show current question
    return (
        <div className="page-content">
            <Header
                title={selectedQuiz?.title || 'Quiz'}
                showBackButton={true}
                onBack={() => navigate(RoutePath.HOME)}
            />

            {selectedQuiz && (
                <div className="quiz-container">
                    <div className="quiz-progress">
                        <span>
                            Spørsmål {currentQuestionIndex + 1} av {selectedQuiz.questions.length}
                        </span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="question-container">
                        <QuizQuestion
                            question={selectedQuiz.questions[currentQuestionIndex]}
                            onAnswer={handleAnswer}
                            userAnswer={getCurrentUserAnswer()}
                        />
                    </div>

                    <div className="quiz-navigation">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="nav-button prev-button"
                        >
                            Forrige
                        </button>

                        <button
                            onClick={handleNextQuestion}
                            className="nav-button next-button"
                        >
                            {currentQuestionIndex === selectedQuiz.questions.length - 1
                                ? 'Fullfør'
                                : 'Neste'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
