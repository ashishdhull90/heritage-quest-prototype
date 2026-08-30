import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Compass, 
  RotateCcw,
  Award,
  HelpCircle,
  Check
} from 'lucide-react';
import { sound } from '../data/soundEffects';

export default function QuizChallenge({ 
  location, 
  playerStats, 
  onCompleteQuiz, 
  onReturnToMap, 
  onExploreAgain,
  onOpenCodex
}) {
  const questions = location.quiz || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const isAlreadySolved = playerStats.completedQuizzes?.includes(location.id);
  const currentQ = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  // Handle player selecting an option
  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playSuccess();
      setCorrectCount(prev => prev + 1);
    } else {
      sound.playError();
    }
  };

  // Handle moving to next question or completing quiz
  const handleNext = () => {
    sound.playClick();
    if (isLastQuestion) {
      sound.playVictoryFanfare();
      const finalCorrect = correctCount + (selectedOption === currentQ.correctIndex && !isAnswerSubmitted ? 1 : 0);
      const xpGained = isAlreadySolved ? 0 : finalCorrect * 50;
      setEarnedXP(xpGained);
      setIsFinished(true);

      if (onCompleteQuiz) {
        onCompleteQuiz({ 
          correctCount: finalCorrect, 
          total: questions.length,
          xpEarned: xpGained 
        });
      }
    } else {
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCurrentIdx(prev => prev + 1);
    }
  };

  // Handle Restart Quiz
  const handleRestartQuiz = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  // Score feedback message helper
  const getFeedbackDetails = () => {
    if (correctCount === 3) {
      return {
        badge: 'Grand Lorekeeper!',
        message: 'Flawless knowledge of Amer Fort! You have demonstrated true mastery of Rajput architecture and history.',
        colorClass: 'text-gold'
      };
    } else if (correctCount === 2) {
      return {
        badge: 'Excellent Explorer!',
        message: 'Great work! You have a strong understanding of Amer Fort’s architecture and historical engineering.',
        colorClass: 'text-emerald'
      };
    } else {
      return {
        badge: 'Apprentice Explorer!',
        message: 'Keep exploring! Rajasthan’s historic forts hold a millennium of deep architectural secrets.',
        colorClass: 'text-terracotta'
      };
    }
  };

  // =========================================================================
  // VIEW 1: RESULTS SCREEN ("CHALLENGE COMPLETE!")
  // =========================================================================
  if (isFinished) {
    const feedback = getFeedbackDetails();

    return (
      <div className="quiz-result-screen-container">
        <div className="quiz-result-card">
          <div className="result-header-block">
            <div className="result-badge-pill">
              <Trophy size={16} className="text-gold" />
              <span>Rajasthan Heritage Mastery</span>
            </div>
            <h2 className="result-main-title">CHALLENGE COMPLETE!</h2>
            <p className="result-subtitle">Amer Fort &bull; Heritage Knowledge Assessment</p>
          </div>

          {/* Performance Encouragement Card */}
          <div className="feedback-assessment-card">
            <div className="feedback-badge-row">
              <Sparkles size={20} className={feedback.colorClass} />
              <h3 className={`feedback-title ${feedback.colorClass}`}>{feedback.badge}</h3>
            </div>
            <p className="feedback-message">{feedback.message}</p>
          </div>

          {/* Stats Metrics Grid */}
          <div className="result-stats-grid">
            <div className="result-stat-box">
              <span className="r-stat-label">Quiz Score</span>
              <strong className="r-stat-number text-gold">
                {correctCount} / {questions.length}
              </strong>
              <span className="r-stat-sub">Questions Correct</span>
            </div>

            <div className="result-stat-box">
              <span className="r-stat-label">XP Earned</span>
              <strong className="r-stat-number text-emerald">
                {isAlreadySolved ? '+0 XP' : `+${earnedXP} XP`}
              </strong>
              <span className="r-stat-sub">
                {isAlreadySolved ? 'Previously Claimed' : 'Knowledge Bonus'}
              </span>
            </div>

            <div className="result-stat-box">
              <span className="r-stat-label">Total Lore XP</span>
              <strong className="r-stat-number text-gold">
                {playerStats.xp} XP
              </strong>
              <span className="r-stat-sub">{playerStats.rankTitle}</span>
            </div>

            <div className="result-stat-box">
              <span className="r-stat-label">Relics Collected</span>
              <strong className="r-stat-number text-gold">
                {playerStats.unlockedRelics.length} / 4
              </strong>
              <span className="r-stat-sub">Rajasthan Relics</span>
            </div>
          </div>

          {/* "What You Learned" Educational Summary Card */}
          <div className="what-you-learned-card">
            <div className="wyl-header">
              <BookOpen size={18} className="text-gold" />
              <h4>What You Learned: Amer Fort</h4>
            </div>

            <div className="wyl-points-list">
              <div className="wyl-point-item">
                <div className="wyl-check-icon">
                  <Check size={14} color="#000" />
                </div>
                <div>
                  <strong>Optical Engineering of Sheesh Mahal:</strong>
                  <p>Thousands of convex and concave mirrors set inside stucco multiply candlelight repeatedly, lighting the hall without generating excess heat.</p>
                </div>
              </div>

              <div className="wyl-point-item">
                <div className="wyl-check-icon">
                  <Check size={14} color="#000" />
                </div>
                <div>
                  <strong>Hilltop Citadel &amp; Maota Lake:</strong>
                  <p>Begun in 1592 CE by Raja Man Singh I atop the Aravalli range, overlooking Maota Lake and the star-shaped Kesar Kyari saffron garden.</p>
                </div>
              </div>

              <div className="wyl-point-item">
                <div className="wyl-check-icon">
                  <Check size={14} color="#000" />
                </div>
                <div>
                  <strong>Persian Wheel (Rehat) Water Lift:</strong>
                  <p>A multi-tier mechanical pulley system powered by bullocks hoisted lake water step-by-step 400 feet up into fort reservoirs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions-row">
            <button
              className="btn-heritage-primary btn-large-cta pulse-gold"
              onClick={() => {
                sound.playChime();
                onReturnToMap();
              }}
              id="quiz-return-map-btn"
            >
              <Compass size={18} />
              <span>RETURN TO RAJASTHAN MAP</span>
            </button>

            {onOpenCodex && (
              <button
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  onOpenCodex();
                }}
                id="quiz-view-codex-btn"
              >
                <BookOpen size={18} />
                <span>VIEW IN HERITAGE CODEX</span>
              </button>
            )}

            <button
              className="btn-heritage-secondary"
              onClick={() => {
                sound.playClick();
                if (onExploreAgain) onExploreAgain();
              }}
              id="quiz-explore-again-btn"
            >
              <Award size={18} />
              <span>EXPLORE AGAIN</span>
            </button>

            <button
              className="btn-heritage-secondary btn-sm"
              onClick={handleRestartQuiz}
              title="Retest your knowledge"
            >
              <RotateCcw size={16} />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: INTERACTIVE QUESTION FLOW
  // =========================================================================
  return (
    <div className="quiz-challenge-container">
      {/* Quiz Progress & Header */}
      <div className="quiz-header-card">
        <div className="quiz-header-top">
          <div className="quiz-badge">
            <BookOpen size={15} />
            <span>Amer Fort &bull; Heritage Knowledge Trial</span>
          </div>

          <div className="quiz-score-pill">
            <Sparkles size={14} className="text-gold" />
            <span>Score: {correctCount} / {questions.length}</span>
          </div>
        </div>

        <div className="quiz-title-strip">
          <h2 className="quiz-main-title">KNOWLEDGE CHALLENGE</h2>
          <p className="quiz-subtitle">How well did you discover Amer Fort?</p>
        </div>

        <div className="quiz-progress-row">
          <span className="progress-label">
            Question <strong>{currentIdx + 1}</strong> of <strong>{questions.length}</strong>
          </span>
          <div className="quiz-progress-track">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`quiz-dot ${i < currentIdx ? 'quiz-dot-done' : ''} ${i === currentIdx ? 'quiz-dot-active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="quiz-question-box">
        <div className="question-text-row">
          <div className="q-number-circle">0{currentIdx + 1}</div>
          <h3 className="question-title">{currentQ.question}</h3>
        </div>

        {/* 4 Interactive Answer Options */}
        <div className="quiz-options-list">
          {currentQ.options.map((optionText, optIdx) => {
            const letter = ['A', 'B', 'C', 'D'][optIdx];
            let optionClass = 'quiz-option-btn';

            if (isAnswerSubmitted) {
              if (optIdx === currentQ.correctIndex) {
                optionClass += ' option-correct';
              } else if (optIdx === selectedOption) {
                optionClass += ' option-incorrect';
              } else {
                optionClass += ' option-disabled';
              }
            } else if (selectedOption === optIdx) {
              optionClass += ' option-selected';
            }

            return (
              <button
                key={optIdx}
                className={optionClass}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswerSubmitted}
                aria-label={`Option ${letter}: ${optionText}`}
              >
                <span className="option-letter">{letter}</span>
                <span className="option-text">{optionText}</span>
                {isAnswerSubmitted && optIdx === currentQ.correctIndex && (
                  <CheckCircle2 size={22} className="option-feedback-icon text-emerald" />
                )}
                {isAnswerSubmitted && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                  <XCircle size={22} className="option-feedback-icon text-terracotta" />
                )}
              </button>
            );
          })}
        </div>

        {/* Educational Breakdown / Explanation Revealed Post-Answer */}
        {isAnswerSubmitted && (
          <div className="explanation-card">
            <div className="explanation-header">
              <Sparkles size={16} className="text-gold" />
              <strong>
                {selectedOption === currentQ.correctIndex ? 'Heritage Insight (Correct!)' : 'Heritage Insight'}
              </strong>
            </div>
            <p className="explanation-body">{currentQ.explanation}</p>

            <div className="explanation-footer">
              <button 
                className="btn-heritage-primary btn-next-q pulse-gold"
                onClick={handleNext}
                id="next-quiz-btn"
              >
                <span>{isLastQuestion ? 'VIEW FINAL RESULTS' : 'NEXT QUESTION'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Subtle Guidance Prompt when unanswered */}
        {!isAnswerSubmitted && (
          <div className="quiz-unanswered-hint">
            <HelpCircle size={15} className="text-gold" />
            <span>Select the correct heritage answer to reveal the historical explanation.</span>
          </div>
        )}
      </div>
    </div>
  );
}
