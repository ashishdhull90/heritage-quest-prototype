import { MapPin, Sparkles, Lock, ArrowRight, Shield } from 'lucide-react';
import { ALL_STATES } from '../data/statesData';
import { sound } from '../data/soundEffects';

export default function StateSelectScreen({ onSelectState, playerStats }) {
  const handleStateClick = (state) => {
    if (state.status === 'unlocked') {
      sound.playChime();
      onSelectState(state.id);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="state-select-container">
      <div className="screen-header-center">
        <div className="section-pill-tag">
          <Sparkles size={14} />
          <span>Stage 01: State Selection</span>
        </div>
        <h2 className="screen-main-title">Choose Your Journey</h2>
        <p className="screen-subtitle">
          Select a historic realm of Bharat to begin your cultural expedition. In this prototype, <strong>Rajasthan</strong> is fully unlocked and playable.
        </p>
      </div>

      <div className="states-grid">
        {ALL_STATES.map((state) => {
          const isUnlocked = state.status === 'unlocked';
          const isRajasthan = state.id === 'rajasthan';
          const completedCount = isRajasthan ? playerStats.completedLocations.length : 0;
          const progressPercent = isRajasthan ? Math.round((completedCount / state.landmarkCount) * 100) : 0;

          return (
            <div
              key={state.id}
              className={`state-card ${isUnlocked ? 'state-card-unlocked' : 'state-card-locked'}`}
              onClick={() => handleStateClick(state)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-label={`${state.name} - ${isUnlocked ? 'Playable' : 'Coming Soon'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleStateClick(state);
                }
              }}
            >
              {/* Card Banner / Header */}
              <div 
                className="state-card-banner"
                style={{ background: isUnlocked ? state.themeGradient : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
              >
                <div className="banner-top-row">
                  <span className="state-era-badge">{state.era}</span>
                  {isUnlocked ? (
                    <span className="status-badge-unlocked">
                      <span className="pulse-dot"></span>
                      Playable Now
                    </span>
                  ) : (
                    <span className="status-badge-locked">
                      <Lock size={12} />
                      Next Phase
                    </span>
                  )}
                </div>

                <div className="banner-title-wrap">
                  <h3 className="state-card-title">{state.name}</h3>
                  <div className="state-card-tagline">{state.tagline}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="state-card-body">
                <p className="state-desc">{state.description}</p>

                {/* Monuments Preview Chips */}
                <div className="monuments-chip-list">
                  {state.monumentsPreview.map((monument) => (
                    <span key={monument} className="monument-chip">
                      <MapPin size={12} />
                      {monument}
                    </span>
                  ))}
                </div>

                {/* Progress or Locked Footer */}
                {isUnlocked ? (
                  <div className="state-card-footer">
                    <div className="state-progress-wrap">
                      <div className="progress-label-row">
                        <span>Expedition Progress</span>
                        <strong>{progressPercent}%</strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <button 
                      className="btn-heritage-primary btn-enter-state"
                      id={`select-state-${state.id}`}
                    >
                      <span>Enter {state.name}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="state-card-locked-footer">
                    <Shield size={16} />
                    <span>Expansion Pack &bull; Scalable Architecture</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
