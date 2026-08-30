import { Volume2, VolumeX, BookOpen, Sparkles, ArrowLeft, Trophy, LogOut, Zap } from 'lucide-react';
import { sound } from '../data/soundEffects';

export default function HeaderHUD({ 
  currentScreen, 
  onNavigateBack, 
  playerStats, 
  audioEnabled, 
  onToggleAudio, 
  onOpenCodex,
  isDemoMode = false,
  onExitDemo,
  locationTitle = '' 
}) {
  const getRankTitle = (xp) => {
    if (xp >= 1200) return 'Grand Lorekeeper of Bharat';
    if (xp >= 800) return 'Royal Chronicler';
    if (xp >= 400) return 'Heritage Seeker';
    if (xp > 0) return 'Apprentice Explorer';
    return 'Novice Explorer';
  };

  const currentRank = getRankTitle(playerStats.xp);

  return (
    <header className="game-hud">
      <div className="hud-left">
        {currentScreen !== 'TITLE' && (
          <button 
            className="hud-btn hud-back-btn" 
            onClick={() => {
              sound.playClick();
              onNavigateBack();
            }}
            title="Go Back"
            aria-label="Go Back"
          >
            <ArrowLeft size={18} />
            <span className="btn-label-desktop">Back</span>
          </button>
        )}

        <div className="hud-title-badge">
          {isDemoMode && (
            <span className="sih-indicator sih-demo-active-badge pulse-gold">
              <Zap size={13} className="text-gold" />
              <span>SIH DEMO</span>
            </span>
          )}

          {locationTitle ? (
            <span className="hud-location-text">{locationTitle}</span>
          ) : (
            <span className="hud-location-text">Heritage Quest: Rajasthan</span>
          )}
        </div>

        {isDemoMode && onExitDemo && (
          <button 
            className="btn-hud-exit-demo"
            onClick={() => {
              sound.playClick();
              onExitDemo();
            }}
            title="Exit Demo Mode & Return to Main Screen"
          >
            <LogOut size={14} />
            <span>EXIT DEMO</span>
          </button>
        )}
      </div>

      <div className="hud-right">
        {/* Lore XP & Rank Pill */}
        <div className="hud-stat-pill" title={`Lore XP: ${playerStats.xp} • Rank: ${currentRank}`}>
          <div className="stat-icon-gold"><Sparkles size={16} /></div>
          <div className="stat-text-wrap">
            <span className="stat-val">{playerStats.xp} XP</span>
            <span className="stat-sub">{currentRank}</span>
          </div>
        </div>

        {/* Relics Counter Pill */}
        <div className="hud-stat-pill" title="Collected Relics">
          <div className="stat-icon-terracotta"><Trophy size={16} /></div>
          <div className="stat-text-wrap">
            <span className="stat-val">{playerStats.unlockedRelics.length} / 4</span>
            <span className="stat-sub">Relics</span>
          </div>
        </div>

        {/* Codex / Lore Vault Button */}
        <button 
          className="hud-btn hud-codex-btn"
          onClick={() => {
            sound.playChime();
            onOpenCodex();
          }}
          title="Open Heritage Codex & Relic Vault"
          aria-label="Open Heritage Codex"
        >
          <BookOpen size={18} />
          <span className="btn-label-desktop">Codex</span>
          {playerStats.unlockedRelics.length > 0 && (
            <span className="codex-badge-count">{playerStats.unlockedRelics.length}</span>
          )}
        </button>

        {/* Sound Toggle */}
        <button 
          className="hud-btn hud-icon-only"
          onClick={onToggleAudio}
          title={audioEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          aria-label={audioEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </header>
  );
}
