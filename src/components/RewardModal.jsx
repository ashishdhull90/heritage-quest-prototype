import { Sparkles, Trophy, BookOpen, Compass } from 'lucide-react';
import { sound } from '../data/soundEffects';

export default function RewardModal({ location, quizResult, onReturnToMap, onOpenCodex }) {
  const relic = location.relic;
  const xpEarned = relic.xpReward + (quizResult?.correctCount || 3) * 50;

  return (
    <div className="modal-overlay reward-modal-backdrop">
      <div className="reward-modal-card" role="dialog" aria-modal="true" aria-label="Relic Unlocked Celebration">
        {/* Celebration Aura Rays */}
        <div className="celebration-rays" aria-hidden="true"></div>

        {/* Header Badge */}
        <div className="celebration-badge">
          <Sparkles size={16} className="text-gold" />
          <span>Heritage Mastery Achieved!</span>
        </div>

        <h2 className="reward-title">Relic Discovered!</h2>
        <div className="reward-subtitle">{location.name} &bull; Trial Complete</div>

        {/* 3D-Styled SVG Relic Trophy Visual */}
        <div className="relic-display-stage">
          <div className="relic-stage-glow"></div>
          <svg viewBox="0 0 200 200" className="relic-svg-art" aria-hidden="true">
            <defs>
              <radialGradient id="relicGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </radialGradient>
              <filter id="relicGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Radiant Sun/Mirror Frame */}
            <circle cx="100" cy="100" r="75" fill="none" stroke="url(#relicGold)" strokeWidth="4" strokeDasharray="8 4" filter="url(#relicGlowFilter)" />
            <circle cx="100" cy="100" r="60" fill="rgba(15, 23, 42, 0.8)" stroke="#fde047" strokeWidth="2" />
            
            {/* Center Mirror Core with Reflection Facets */}
            <circle cx="100" cy="100" r="40" fill="url(#relicGold)" opacity="0.9" />
            <polygon points="100,65 125,85 115,120 85,120 75,85" fill="#ffffff" opacity="0.35" />
            <circle cx="100" cy="100" r="15" fill="#ffffff" opacity="0.6" />

            {/* Ornate 8 Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <polygon points="100,20 106,38 94,38" fill="url(#relicGold)" />
              </g>
            ))}
          </svg>
        </div>

        {/* Relic Title & Lore */}
        <div className="reward-relic-name">{relic.name}</div>
        <span className="reward-tier-pill">{relic.tier}</span>

        <p className="reward-lore-desc">{relic.lore}</p>

        {/* Reward Stats Grid */}
        <div className="reward-stats-grid">
          <div className="reward-stat-box">
            <Sparkles size={20} className="text-gold" />
            <div>
              <span className="r-stat-label">Lore XP Gained</span>
              <strong className="r-stat-val text-gold">+{xpEarned} XP</strong>
            </div>
          </div>

          <div className="reward-stat-box">
            <Trophy size={20} className="text-emerald" />
            <div>
              <span className="r-stat-label">Codex Status</span>
              <strong className="r-stat-val text-emerald">Cataloged</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="reward-actions-row">
          <button 
            className="btn-heritage-primary btn-large-cta pulse-gold"
            onClick={() => {
              sound.playChime();
              onReturnToMap();
            }}
            id="reward-return-map-btn"
          >
            <Compass size={18} />
            <span>Return to State Map</span>
          </button>

          <button 
            className="btn-heritage-secondary"
            onClick={() => {
              sound.playClick();
              onOpenCodex();
            }}
            id="reward-view-codex-btn"
          >
            <BookOpen size={18} />
            <span>View in Heritage Codex</span>
          </button>
        </div>
      </div>
    </div>
  );
}
