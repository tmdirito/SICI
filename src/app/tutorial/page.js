"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import styles from './tutorial.module.css';
import Header from '../components/Header';

// --- MOCK DATA ---
const QUIZ_DATA = {
    plants: {
        quality: [
            { id: 'q1', type: 'perfect', correct: true, src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80', desc: 'Clear, well-lit, fully framed' },
            { id: 'q2', type: 'blurry', correct: false, src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&blur=15&q=30', desc: 'Blurry, out of focus' },
            { id: 'q3', type: 'cropped', correct: false, src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=200&fit=crop', desc: 'Cropped, missing parts' },
            { id: 'q4', type: 'angle', correct: false, src: 'https://images.unsplash.com/photo-1510255956795-3bcffae02905?w=400&q=80', desc: 'Too far, odd angle' },
        ],
        background: [
            { id: 'b1', type: 'cluttered', correct: false, src: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&q=80', desc: 'Busy background' },
            { id: 'b2', type: 'perfect', correct: true, src: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80', desc: 'Solid, contrast background' },
            { id: 'b3', type: 'multiple', correct: false, src: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=400&q=80', desc: 'Too many objects' },
            { id: 'b4', type: 'messy', correct: false, src: 'https://images.unsplash.com/photo-1581452906471-2917711d95ee?w=400&q=80', desc: 'Messy environment' },
        ]
    },
    animals: {
        quality: [
            { id: 'q1', type: 'perfect', correct: true, src: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&q=80', desc: 'Clear, well-lit' },
            { id: 'q2', type: 'blurry', correct: false, src: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&blur=15&q=30', desc: 'Blurry, motion blur' },
            { id: 'q3', type: 'cropped', correct: false, src: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=200&fit=crop', desc: 'Bad crop' },
            { id: 'q4', type: 'angle', correct: false, src: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80', desc: 'Unusual angle' },
        ],
        background: [
            { id: 'b1', type: 'multiple', correct: false, src: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&q=80', desc: 'Multiple pets' },
            { id: 'b2', type: 'cluttered', correct: false, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80', desc: 'Cluttered room' },
            { id: 'b3', type: 'perfect', correct: true, src: 'https://images.unsplash.com/photo-1537151608804-ea6f0a40d588?w=400&q=80', desc: 'Simple plain background' },
            { id: 'b4', type: 'messy', correct: false, src: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&q=80', desc: 'Distracting elements' },
        ]
    }
};

export default function StepsTutorial() {
    const [currentStep, setCurrentStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [answers, setAnswers] = useState({ quality: null, background: null });
    const [feedback, setFeedback] = useState({ visible: false, type: '', message: '' });
    const [quizComplete, setQuizComplete] = useState(false);
    const [confetti, setConfetti] = useState(false);

    const totalSteps = 4;

    const handleShowFeedback = (type, message) => {
        setFeedback({ visible: true, type, message });
        setTimeout(() => {
            setFeedback({ visible: false, type: '', message: '' });
        }, 2500);
    };

    const selectCategory = (cat) => {
        setCategory(cat);
        setCurrentStep(2);
    };

    const handleImageSelect = (stage, option) => {
        if (option.correct) {
            setAnswers(prev => ({ ...prev, [stage]: option }));
            handleShowFeedback('success', 'Great choice! That is the perfect photo.');
            setTimeout(() => {
                if (currentStep < totalSteps) {
                    setCurrentStep(currentStep + 1);
                }
            }, 1000);
        } else {
            handleShowFeedback('error', 'Not quite right. Notice the issues with this photo and try again!');
        }
    };

    const handleSubmitQuiz = () => {
        if (answers.quality && answers.background) {
            setQuizComplete(true);
            setConfetti(true);
        }
    };

    const handleRetry = () => {
        setCurrentStep(1);
        setCategory(null);
        setAnswers({ quality: null, background: null });
        setQuizComplete(false);
        setConfetti(false);
    };

    return (
        <>
        <Header /> 
        <div className={styles.quizContainer}>

            {/* Confetti overlay trigger */}
            {confetti && (
                <div className={styles.confettiContainer}>
                    <div className={styles.confettiPiece}></div>
                    <div className={`${styles.confettiPiece} ${styles.c2}`}></div>
                    <div className={`${styles.confettiPiece} ${styles.c3}`}></div>
                    <div className={`${styles.confettiPiece} ${styles.c4}`}></div>
                    <div className={`${styles.confettiPiece} ${styles.c5}`}></div>
                    <div className={`${styles.confettiPiece} ${styles.c6}`}></div>
                </div>
            )}

            {/* Header */}
            <header className={styles.header}>
                
                <h2 className={styles.subtitle}>Perfect Your Image Selection</h2>
                
            </header>

            {/* Progress Bar */}
            <div className={styles.progressWrapper}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                </div>
                <div className={styles.stepIndicator}>Step {currentStep} of {totalSteps}</div>
            </div>

            {/* Feedback Toast */}
            {feedback.visible && (
                <div className={`${styles.feedbackToast} ${feedback.type === 'success' ? styles.success : styles.error}`}>
                    {feedback.message}
                </div>
            )}

            {/* STEP 1: CATEGORY SELECTION */}
            {currentStep === 1 && !quizComplete && (
                <div className={`${styles.stepContent} ${styles.fadeIn}`}>
                    <h3 className={styles.stepHeading}>What do you want to analyze today?</h3>
                    <div className={styles.categoryGrid}>
                        <div className={styles.categoryCard} onClick={() => selectCategory('plants')}>
                            <div className={styles.categoryImageWrap}>
                                <img src="/images/slide5.jpg" alt="Plants" />
                            </div>
                            <h4>Flora</h4>
                        </div>
                        <div className={styles.categoryCard} onClick={() => selectCategory('animals')}>
                            <div className={styles.categoryImageWrap}>
                                <img src="/images/slide2.jpg" alt="Animals" />
                            </div>
                            <h4>Fauna</h4>
                        </div>
                        
                    </div>
                </div>
            )}

            {/* STEP 2: QUALITY CHALLENGE */}
            {currentStep === 2 && !quizComplete && category && (
                <div className={`${styles.stepContent} ${styles.fadeIn}`}>
                    <h3 className={styles.stepHeading}>Which image has the best clarity and angle?</h3>
                    <p className={styles.challengeHint}>Select the crispest, most centered photo.</p>
                    <div className={styles.optionsGrid}>
                        {QUIZ_DATA[category].quality.map((opt) => (
                            <div
                                key={opt.id}
                                className={`${styles.optionCard} ${answers.quality?.id === opt.id ? styles.selectedCorrect : ''}`}
                                onClick={() => handleImageSelect('quality', opt)}
                            >
                                <img src={opt.src} alt={opt.desc} />
                                <div className={styles.hoverOverlay}>Select</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 3: BACKGROUND CHALLENGE */}
            {currentStep === 3 && !quizComplete && category && (
                <div className={`${styles.stepContent} ${styles.fadeIn}`}>
                    <h3 className={styles.stepHeading}>Which image has the best background?</h3>
                    <p className={styles.challengeHint}>Avoid clutter! The AI needs to see the subject clearly.</p>
                    <div className={styles.optionsGrid}>
                        {QUIZ_DATA[category].background.map((opt) => (
                            <div
                                key={opt.id}
                                className={`${styles.optionCard} ${answers.background?.id === opt.id ? styles.selectedCorrect : ''}`}
                                onClick={() => handleImageSelect('background', opt)}
                            >
                                <img src={opt.src} alt={opt.desc} />
                                <div className={styles.hoverOverlay}>Select</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 4: FINAL REVIEW */}
            {currentStep === 4 && !quizComplete && (
                <div className={`${styles.stepContent} ${styles.fadeIn}`}>
                    <h3 className={styles.stepHeading}>Final Review</h3>
                    <p className={styles.challengeHint}>You picked the best options! Let's review them.</p>

                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <h5>Your Quality Choice</h5>
                            <div className={styles.reviewImageWrap}>
                                <img src={answers.quality?.src} alt="Quality choice" />
                                <div className={styles.checkIcon}>✓</div>
                            </div>
                        </div>
                        <div className={styles.reviewItem}>
                            <h5>Your Background Choice</h5>
                            <div className={styles.reviewImageWrap}>
                                <img src={answers.background?.src} alt="Background choice" />
                                <div className={styles.checkIcon}>✓</div>
                            </div>
                        </div>
                    </div>

                    <button className={styles.submitBtn} onClick={handleSubmitQuiz}>
                        Submit Quiz
                    </button>
                </div>
            )}

            {/* FINAL RESULT SCREEN */}
            {quizComplete && (
                <div className={`${styles.resultScreen} ${styles.scaleUp}`}>
                    <h1 className={styles.resultTitle}>You nailed it! 🎉</h1>
                    <p className={styles.resultText}>
                        You completely understand what makes the perfect photo for our AI.
                        Remember these rules when you make your real uploads!
                    </p>
                    <button className={styles.retryBtn} onClick={handleRetry}>
                        Take Quiz Again
                    </button>
                </div>
            )}

        </div>
        </>
    );
}
