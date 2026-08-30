import { useState } from 'react';
import { Compass, Sparkles, HelpCircle, Shield, Award, MapPin, Play, X, CheckCircle2, Zap } from 'lucide-react';
import { sound } from '../data/soundEffects';
import SihDemoIntroModal from './SihDemoIntroModal';
import FirstTimeIntroModal from './FirstTimeIntroModal';

export default function TitleScreen({ onStartGame, onStartDemo, playerStats }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showDemoIntro, setShowDemoIntro] = useState(false);
  const [showFirstTimeIntro, setShowFirstTimeIntro] = useState(false);

  const handleStart = () => {
    sound.playChime();
    const hasSeenIntro = localStorage.getItem('heritage_quest_intro_seen');
    if (hasSeenIntro === 'true') {
      onStartGame();
    } else {
      setShowFirstTimeIntro(true);
    }
  };

  const handleCompleteIntro = () => {
    try {
      localStorage.setItem('heritage_quest_intro_seen', 'true');
    } catch {
      // ignore
    }
    setShowFirstTimeIntro(false);
    onStartGame();
  };

  const handleSkipIntro = () => {
    try {
      localStorage.setItem('heritage_quest_intro_seen', 'true');
    } catch {
      // ignore
    }
    setShowFirstTimeIntro(false);
    onStartGame();
  };

  return (
    <div className="title-screen-wrap">
      {/* Background Decorative Mandala Rings */}
      <div className="title-mandala-bg" aria-hidden="true">
        <svg viewBox="0 0 600 600" className="mandala-svg">
          <circle cx="300" cy="300" r="280" stroke="rgba(212, 163, 89, 0.15)" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <circle cx="300" cy="300" r="220" stroke="rgba(230, 179, 37, 0.25)" strokeWidth="1.5" fill="none" />
          <circle cx="300" cy="300" r="160" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="2" strokeDasharray="12 4" fill="none" />
          <circle cx="300" cy="300" r="100" stroke="rgba(212, 163, 89, 0.4)" strokeWidth="3" fill="none" />
          {/* Ornate rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="300"
              y1="300"
              x2={300 + 260 * Math.cos((deg * Math.PI) / 180)}
              y2={300 + 260 * Math.sin((deg * Math.PI) / 180)}
              stroke="rgba(230, 179, 37, 0.12)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      <div className="title-content-card">
        {/* Game Logo & Emblem */}
        <div className="title-emblem-wrap">
          <div className="title-emblem-icon">
            <Compass size={44} />
          </div>
          <div className="emblem-glow"></div>
        </div>

        <h1 className="game-main-title">HERITAGE QUEST</h1>
        <div className="game-sub-title">LEGENDS OF BHARAT &bull; RAJASTHAN</div>

        {/* Short Concept Statement */}
        <div className="title-concept-statement">
          <p className="concept-tagline-main">
            Explore India&apos;s heritage.<br />
            Learn its stories.<br />
            Protect its legacy.
          </p>
          <p className="concept-subline">
            An interactive heritage-learning adventure.
          </p>
        </div>

        {/* Quick Highlights Row */}
        <div className="title-features-pills">
          <div className="feat-pill">
            <MapPin size={15} />
            <span>Interactive State Map</span>
          </div>
          <div className="feat-pill">
            <Sparkles size={15} />
            <span>Tactile Mini-Games</span>
          </div>
          <div className="feat-pill">
            <Shield size={15} />
            <span>Knowledge Quizzes</span>
          </div>
          <div className="feat-pill">
            <Award size={15} />
            <span>Relic Collection</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="title-actions">
          <button 
            className="btn-heritage-primary btn-large-cta pulse-gold" 
            onClick={handleStart}
            id="start-expedition-btn"
          >
            <Play size={22} fill="currentColor" />
            <span>START JOURNEY</span>
          </button>

          <button 
            className="btn-heritage-secondary" 
            onClick={() => {
              sound.playClick();
              setShowDemoIntro(true);
            }}
            id="sih-demo-btn"
          >
            <Zap size={18} className="text-gold" />
            <span>🎯 SIH DEMO MODE</span>
          </button>

          <button 
            className="btn-heritage-secondary" 
            onClick={() => {
              sound.playClick();
              setShowHowToPlay(true);
            }}
          >
            <HelpCircle size={18} />
            <span>How to Play &amp; Lore</span>
          </button>
        </div>

        {/* Existing progress quick note if player already played */}
        {playerStats.xp > 0 && (
          <div className="existing-save-banner">
            <CheckCircle2 size={16} color="var(--emerald-accent)" />
            <span>Active Journey: {playerStats.xp} XP &bull; {playerStats.unlockedRelics.length} Relics Found</span>
          </div>
        )}
      </div>

      {/* First-Time Onboarding Sequence Modal */}
      <FirstTimeIntroModal
        isOpen={showFirstTimeIntro}
        onComplete={handleCompleteIntro}
        onSkip={handleSkipIntro}
      />

      {/* SIH Demo Mode Intro Modal */}
      <SihDemoIntroModal
        isOpen={showDemoIntro}
        onClose={() => setShowDemoIntro(false)}
        onStartDemo={() => {
          setShowDemoIntro(false);
          if (onStartDemo) onStartDemo();
        }}
      />

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Compass size={22} className="text-gold" />
                <h3>How to Play Heritage Quest</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowHowToPlay(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="instruction-step">
                <div className="step-badge">1</div>
                <div>
                  <h4>Embark on the Rajasthan Journey</h4>
                  <p>Step into the <strong>Realm of Rajasthan</strong> to explore the legendary hill fortresses and palatial architecture of Rajputana.</p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-badge">2</div>
                <div>
                  <h4>Freely Explore Historic Citadels</h4>
                  <p>Walk around <strong>Amer Fort</strong> in 360 degrees, discover hidden architectural clues, and consult with <strong>Acharya Vikram</strong>.</p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-badge">3</div>
                <div>
                  <h4>Restore Living Heritage</h4>
                  <p>Reconstruct authentic 16th-century architectural relief panels by placing lost lotus keystones, convex mirrors, and carved sandstone jalis.</p>
                </div>
              </div>

              <div className="instruction-step">
                <div className="step-badge">4</div>
                <div>
                  <h4>Ace Knowledge Quizzes &amp; Claim Relics</h4>
                  <p>Complete cultural challenges to earn Lore XP, advance your rank, and unlock sacred artifacts in your <strong>Heritage Codex</strong>.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-heritage-primary" 
                onClick={() => {
                  setShowHowToPlay(false);
                  handleStart();
                }}
              >
                <Play size={18} fill="currentColor" />
                <span>Start Playing Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
