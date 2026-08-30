import { useState } from 'react';
import { Compass, Sparkles, Award, ArrowRight, Play } from 'lucide-react';
import { sound } from '../data/soundEffects';

const INTRO_STEPS = [
  {
    badge: 'EXPLORE',
    title: 'Historic Heritage Citadels',
    description: "Travel through Rajasthan's historic heritage sites.",
    icon: Compass,
    iconColor: 'var(--gold-primary)',
    bgHighlight: 'radial-gradient(ellipse at 50% 30%, rgba(212, 163, 89, 0.18) 0%, rgba(18, 22, 34, 0.95) 75%)'
  },
  {
    badge: 'PLAY',
    title: 'Interactive Cultural Challenges',
    description: 'Solve interactive challenges inspired by history and heritage.',
    icon: Sparkles,
    iconColor: 'var(--sky-accent)',
    bgHighlight: 'radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.18) 0%, rgba(18, 22, 34, 0.95) 75%)'
  },
  {
    badge: 'DISCOVER',
    title: 'Relics, Knowledge & Achievements',
    description: 'Collect knowledge, relics and achievements as you progress.',
    icon: Award,
    iconColor: 'var(--emerald-accent)',
    bgHighlight: 'radial-gradient(ellipse at 50% 30%, rgba(16, 185, 129, 0.18) 0%, rgba(18, 22, 34, 0.95) 75%)'
  }
];

export default function FirstTimeIntroModal({ isOpen, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const currentCard = INTRO_STEPS[currentStep];
  const StepIcon = currentCard.icon;
  const isLastStep = currentStep === INTRO_STEPS.length - 1;

  const handleNext = () => {
    sound.playClick();
    if (isLastStep) {
      sound.playFanfare();
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    sound.playClick();
    onSkip();
  };

  return (
    <div className="modal-overlay first-time-intro-overlay" role="dialog" aria-modal="true">
      <div 
        className="modal-content first-time-intro-card animate-scale-up"
        style={{ background: currentCard.bgHighlight }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Skip Button */}
        <div className="onboarding-top-bar">
          <div className="onboarding-step-indicator">
            {INTRO_STEPS.map((_, idx) => (
              <span 
                key={idx} 
                className={`step-dot ${idx === currentStep ? 'active' : idx < currentStep ? 'completed' : ''}`}
              />
            ))}
            <span className="step-text">{currentStep + 1} / {INTRO_STEPS.length}</span>
          </div>

          <button 
            className="btn-skip-intro"
            onClick={handleSkip}
            title="Skip onboarding"
            id="skip-intro-btn"
          >
            SKIP INTRO
          </button>
        </div>

        {/* Acharya Vikram Scholar Introduction Header */}
        <div className="onboarding-guide-strip">
          <div className="onboarding-guide-avatar">
            <img 
              src="/assets/characters/acharya-vikram-portrait.jpg" 
              alt="Acharya Vikram" 
              className="guide-avatar-img-circle"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="onboarding-guide-speech">
            <strong>Acharya Vikram:</strong>
            <p className="onboarding-speech-quote">
              &ldquo;Welcome, Explorer. Your journey begins with Rajasthan.&rdquo;
            </p>
          </div>
        </div>

        {/* Central Featured Concept Card */}
        <div className="onboarding-card-body">
          <div className="onboarding-card-hero-icon" style={{ borderColor: currentCard.iconColor }}>
            <StepIcon size={42} color={currentCard.iconColor} />
          </div>

          <span className="onboarding-card-badge" style={{ color: currentCard.iconColor, borderColor: currentCard.iconColor }}>
            {currentCard.badge}
          </span>

          <h3 className="onboarding-card-title">{currentCard.title}</h3>

          <p className="onboarding-card-desc">
            &ldquo;{currentCard.description}&rdquo;
          </p>
        </div>

        {/* Modal Footer with Actions */}
        <div className="onboarding-card-footer">
          <button 
            className="btn-heritage-primary btn-large-cta pulse-gold"
            onClick={handleNext}
            id="intro-next-btn"
          >
            {isLastStep ? (
              <>
                <Play size={18} fill="currentColor" />
                <span>BEGIN JOURNEY</span>
              </>
            ) : (
              <>
                <span>NEXT</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
