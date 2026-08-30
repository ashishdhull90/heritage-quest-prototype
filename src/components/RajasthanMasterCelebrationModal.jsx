import { 
  Sparkles, 
  Award, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Crown,
  ArrowRight,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { sound } from '../data/soundEffects';

export default function RajasthanMasterCelebrationModal({
  isOpen,
  onReturnToHub,
  onOpenCodex,
  isDemoMode = false,
  onRestartDemo,
  onExitDemo,
  playerStats
}) {
  if (!isOpen) return null;

  const totalXP = playerStats?.xp || 1150;

  return (
    <div className="dialog-overlay-scrim animate-fade-in master-celebration-overlay">
      <div className="master-celebration-modal-card animate-scale-up">
        {/* Animated Grand Laurel Crest */}
        <div className="master-crest-wrapper">
          <div className="master-crest-ring pulse-gold">
            <Crown size={42} className="text-gold" />
          </div>
          <div className="master-laurel-badge">
            <Sparkles size={16} />
            <span>{isDemoMode ? 'SIH EVALUATION DEMO CONCLUDED' : 'EXPEDITION CONCLUDED • 100% DISCOVERY'}</span>
            <Sparkles size={16} />
          </div>
        </div>

        {/* Grand Typography */}
        <header className="master-celebration-header">
          <span className="master-kicker-tag">
            {isDemoMode ? 'SIH 2024 &bull; COMPLETE DEMO SUMMARY' : 'ROYAL HERITAGE EXPEDITION FINALE'}
          </span>
          <h1 className="master-grand-title">RAJASTHAN MASTER EXPLORER</h1>
          <p className="master-grand-subtitle">
            &ldquo;From exploration to preservation.&rdquo;
          </p>
        </header>

        {/* 5 Demo Highlights Pillars */}
        <div className="sih-summary-checklist-box">
          <div className="summary-check-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span><strong>4 Heritage Locations:</strong> Amer, Mehrangarh, Jaisalmer &amp; Chittorgarh Forts</span>
          </div>
          <div className="summary-check-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span><strong>4 Interactive Learning Mechanics:</strong> Optics Restoration, Epigraphy Decoding, Trade Route Sequencing &amp; Conservation Decisions</span>
          </div>
          <div className="summary-check-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span><strong>Heritage Codex:</strong> Dynamic encyclopedia tracking 12 in-depth architectural discoveries</span>
          </div>
          <div className="summary-check-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span><strong>Relic Collection:</strong> 4 Master Relics awarded for historic mastery</span>
          </div>
          <div className="summary-check-item">
            <CheckCircle2 size={16} className="text-emerald" />
            <span><strong>Preservation Learning:</strong> Fostering responsible stewardship and cultural pride</span>
          </div>
        </div>

        {/* 4 Locations Mastered Card Grid */}
        <div className="master-locations-grid">
          <div className="master-loc-card completed">
            <div className="loc-card-header">
              <span className="loc-seq-badge">01</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <h4>Amer Fort</h4>
            <span className="loc-subtag">Jaipur &bull; Sheesh Mahal</span>
            <p>Mastered solar optics &amp; water engineering</p>
          </div>

          <div className="master-loc-card completed">
            <div className="loc-card-header">
              <span className="loc-seq-badge">02</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <h4>Mehrangarh Fort</h4>
            <span className="loc-subtag">Jodhpur &bull; Cliff Citadel</span>
            <p>Decoded Rao Jodha’s foundation inscription</p>
          </div>

          <div className="master-loc-card completed">
            <div className="loc-card-header">
              <span className="loc-seq-badge">03</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <h4>Jaisalmer Fort</h4>
            <span className="loc-subtag">Jaisalmer &bull; Sonar Qila</span>
            <p>Reconstructed the Great Thar Golden Route</p>
          </div>

          <div className="master-loc-card completed">
            <div className="loc-card-header">
              <span className="loc-seq-badge">04</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <h4>Chittorgarh Fort</h4>
            <span className="loc-subtag">Mewar &bull; Hilltop Bastion</span>
            <p>Resolved 3 heritage preservation challenges</p>
          </div>
        </div>

        {/* 4 Master Relics Vault Row */}
        <div className="master-relics-vault-section">
          <h3 className="vault-section-title">
            <Award size={18} className="text-gold" />
            <span>4 / 4 LEGENDARY HERITAGE RELICS UNLOCKED</span>
          </h3>

          <div className="vault-relics-ribbon">
            <div className="vault-relic-item">
              <div className="relic-icon-circle gold-glow">☀️</div>
              <div className="relic-item-info">
                <strong>Sun Mirror of Amer</strong>
                <span>Amer Fort</span>
              </div>
            </div>

            <div className="vault-relic-item">
              <div className="relic-icon-circle sandstone-glow">📜</div>
              <div className="relic-item-info">
                <strong>Mehrangarh Inscription</strong>
                <span>Mehrangarh Fort</span>
              </div>
            </div>

            <div className="vault-relic-item">
              <div className="relic-icon-circle amber-glow">🧭</div>
              <div className="relic-item-info">
                <strong>Golden Route Relic</strong>
                <span>Jaisalmer Fort</span>
              </div>
            </div>

            <div className="vault-relic-item">
              <div className="relic-icon-circle flame-glow">🛡️</div>
              <div className="relic-item-info">
                <strong>Guardian of Chittorgarh</strong>
                <span>Chittorgarh Fort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="master-stats-summary-bar">
          <div className="stat-summary-pill">
            <span className="pill-label">TOTAL XP EARNED</span>
            <span className="pill-value gold-text">+{totalXP} XP</span>
          </div>

          <div className="stat-summary-pill">
            <span className="pill-label">EXPLORER RANK</span>
            <span className="pill-value cyan-text">Master Lorekeeper</span>
          </div>

          <div className="stat-summary-pill">
            <span className="pill-label">COMPLETION STATUS</span>
            <span className="pill-value emerald-text">100% Mastered</span>
          </div>
        </div>

        {/* Acharya Vikram Final Farewell Note */}
        <div className="master-farewell-card">
          <div className="farewell-avatar">AV</div>
          <div className="farewell-text">
            <strong>ACHARYA VIKRAM &bull; CHIEF ARCHEOLOGIST</strong>
            <p>
              &ldquo;Your journey through Rajasthan has proven that the stones of our ancestors continue to inspire when studied with honor, curiosity, and preservation in heart. Walk proud, Master Explorer!&rdquo;
            </p>
          </div>
        </div>

        {/* Grand Action Buttons */}
        <footer className="master-celebration-footer">
          {isDemoMode ? (
            <>
              <button 
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  if (onRestartDemo) onRestartDemo();
                }}
              >
                <RotateCcw size={18} />
                <span>RESTART DEMO</span>
              </button>

              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playClick();
                  if (onExitDemo) onExitDemo();
                }}
              >
                <LogOut size={18} />
                <span>EXIT DEMO</span>
              </button>

              <button 
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  if (onOpenCodex) onOpenCodex();
                }}
              >
                <BookOpen size={18} />
                <span>View Codex</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  if (onOpenCodex) onOpenCodex();
                }}
              >
                <BookOpen size={18} />
                <span>Open Heritage Codex</span>
              </button>

              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playClick();
                  if (onReturnToHub) onReturnToHub();
                }}
              >
                <Compass size={18} />
                <span>Explore Rajasthan Hub (Replay Forts)</span>
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
