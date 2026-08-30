import { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle, 
  BookOpen, 
  Shield, 
  Sun,
  Scroll,
  Layers,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../data/soundEffects';

const DEFAULT_FRAGMENTS = [
  {
    id: 'frag_gates',
    order: 2,
    title: 'Jayapol Victory Inscription',
    ancientScript: 'सप्त महाद्वार रक्षित जयपोल विजय स्तम्भ',
    periodTag: 'Phase II: Defense & Fortifications',
    transcription: 'Seven monumental gates rise to defend Marwar, crowned by the victorious Jayapol portal.',
    hint: 'Describes the seven defensive gateways and military ramparts constructed to protect the citadel.',
    iconType: 'gates'
  },
  {
    id: 'frag_foundation',
    order: 1,
    title: 'Foundation Inscription (1459 CE)',
    ancientScript: '१४५९ संवत् राव जोधा निर्मित मिहिरगढ़ प्राकार',
    periodTag: 'Phase I: The Founding Stone',
    transcription: '1459 CE — Rao Jodha establishes the Sun Citadel upon the volcanic cliff of Bhakurcheeria.',
    hint: 'Describes the relocation of the Marwar capital from Mandore and laying the founding stone.',
    iconType: 'foundation'
  },
  {
    id: 'frag_water',
    order: 3,
    title: 'Ranisar Stepwell & Solar Dedication',
    ancientScript: 'रानीसर पद्मसर जल संचयन सूर्य वंश ध्वज',
    periodTag: 'Phase III: Life & Sustenance',
    transcription: 'Ranisar and Padamsar stepwells capture every drop of monsoon rain to sustain the Sun Citadel.',
    hint: 'Describes the subterranean water harvesting reservoirs that allowed the fort to survive centuries.',
    iconType: 'water'
  }
];

export default function MehrangarhDecoderGame({ 
  location, 
  playerStats, 
  onCompleteChapter, 
  onReturnToMap,
  onOpenCodex 
}) {
  // Current order of fragments in the decoder slots
  const [placedFragments, setPlacedFragments] = useState(DEFAULT_FRAGMENTS);
  const [selectedFragmentIndex, setSelectedFragmentIndex] = useState(null);
  
  // Decoding Validation State: null | 'CORRECT' | 'INCORRECT'
  const [validationState, setValidationState] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Swap fragments between indices
  const handleSwap = (fromIndex, toIndex) => {
    sound.playClick();
    const updated = [...placedFragments];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    setPlacedFragments(updated);
    setValidationState(null);
    setSelectedFragmentIndex(null);
  };

  const handleSelectSlot = (index) => {
    sound.playClick();
    if (selectedFragmentIndex === null) {
      setSelectedFragmentIndex(index);
    } else if (selectedFragmentIndex === index) {
      setSelectedFragmentIndex(null);
    } else {
      handleSwap(selectedFragmentIndex, index);
    }
  };

  const handleMoveLeft = (index) => {
    if (index > 0) handleSwap(index, index - 1);
  };

  const handleMoveRight = (index) => {
    if (index < placedFragments.length - 1) handleSwap(index, index + 1);
  };

  const handleVerifySequence = () => {
    const isCorrect = 
      placedFragments[0].order === 1 && 
      placedFragments[1].order === 2 && 
      placedFragments[2].order === 3;

    if (isCorrect) {
      sound.playFanfare();
      setValidationState('CORRECT');
    } else {
      sound.playError();
      setValidationState('INCORRECT');
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedFragments(DEFAULT_FRAGMENTS);
    setValidationState(null);
    setSelectedFragmentIndex(null);
    setShowHint(false);
  };

  const handleClaimReward = () => {
    sound.playFanfare();
    if (onCompleteChapter) {
      onCompleteChapter({
        locationId: 'mehrangarh-fort',
        xpAward: 150,
        relicAward: location.relic || {
          id: 'relic_mehrangarh_inscription',
          name: 'Mehrangarh Inscription Relic',
          tier: 'Legendary Relic',
          xpReward: 150,
          lore: 'An engraved red sandstone tablet bearing the founding seal of Rao Jodha and the solar crest of Marwar.',
          iconType: 'relic'
        }
      });
    }
  };

  return (
    <div className="restoration-screen-container decoder-game-screen">
      {/* =================================================================== */}
      {/* 1. TOP STATUS & HUD BAR                                             */}
      {/* =================================================================== */}
      <header className="restoration-hud-header">
        <div className="hud-header-left">
          <button 
            className="hud-back-btn" 
            onClick={() => {
              sound.playClick();
              onReturnToMap();
            }}
            title="Return to Mehrangarh Exploration"
          >
            &larr; Back to Fort
          </button>
          <div className="hud-location-tag">
            <span className="hud-tag-bullet">&bull;</span>
            <span className="hud-tag-title">MEHRANGARH FORT &bull; JODHPUR</span>
          </div>
        </div>

        <div className="hud-header-center">
          <div className="hud-phase-pill">
            <Scroll size={14} className="text-gold" />
            <span>ARCHEOLOGICAL DECODER WORKBENCH</span>
          </div>
        </div>

        <div className="hud-header-right">
          <div className="hud-stat-pill">
            <Sparkles size={14} className="text-gold" />
            <span>{playerStats.xp} XP</span>
          </div>
          {onOpenCodex && (
            <button 
              className="hud-codex-btn"
              onClick={() => {
                sound.playClick();
                onOpenCodex();
              }}
              title="Open Heritage Codex"
            >
              <BookOpen size={14} />
              <span>Codex</span>
            </button>
          )}
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. MAIN DECODER WORKBENCH AREA                                      */}
      {/* =================================================================== */}
      <main className="decoder-workbench-main">
        {/* Intro Guide Card */}
        <section className="decoder-intro-banner">
          <div className="decoder-guide-avatar">AV</div>
          <div className="decoder-intro-text">
            <div className="decoder-guide-title">
              <Sparkles size={14} className="text-gold" />
              <span>Acharya Vikram &bull; Archeological Synthesis</span>
            </div>
            <p className="decoder-guide-quote">
              &ldquo;You have retrieved all 3 sacred inscription fragments from the fortress ramparts. 
              Now, align them in chronological sequence—from the foundational rock to the soaring gates and the living desert stepwells!&rdquo;
            </p>
          </div>
        </section>

        {/* Objective Box */}
        <div className="decoder-objective-strip">
          <div className="objective-left">
            <Layers size={16} className="text-gold" />
            <strong>OBJECTIVE:</strong>
            <span>Arrange the 3 inscription fragments into the correct historical order (Phase I &rarr; Phase II &rarr; Phase III).</span>
          </div>
          <button 
            className="btn-heritage-secondary btn-sm"
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
          >
            <HelpCircle size={14} />
            <span>{showHint ? 'Hide Scholar Hint' : 'Scholar Hint'}</span>
          </button>
        </div>

        {showHint && (
          <div className="decoder-hint-card animate-fade-in">
            <AlertCircle size={16} className="text-gold" />
            <p>
              <strong>Chronological Hint:</strong> Mehrangarh was first founded in <strong>1459 CE</strong> upon the volcanic cliff (Phase I), 
              followed by the construction of its <strong>Seven Gates &amp; Ramparts</strong> (Phase II), 
              and sustained through the <strong>Ranisar &amp; Padamsar stepwells</strong> (Phase III).
            </p>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. INTERACTIVE FRAGMENT SLOTS                                       */}
        {/* =================================================================== */}
        <section className="decoder-slots-container">
          <div className="decoder-slots-grid">
            {placedFragments.map((frag, index) => {
              const isSelected = selectedFragmentIndex === index;
              const slotNumber = index + 1;

              return (
                <div 
                  key={frag.id}
                  className={`decoder-fragment-card ${isSelected ? 'fragment-selected' : ''} ${validationState === 'CORRECT' ? 'fragment-verified' : ''}`}
                  onClick={() => handleSelectSlot(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Fragment in slot ${slotNumber}: ${frag.title}. Click or tap to swap.`}
                >
                  {/* Slot Header */}
                  <div className="fragment-slot-badge">
                    <span className="slot-num-pill">SLOT 0{slotNumber}</span>
                    <span className="slot-period-tag">{frag.periodTag}</span>
                  </div>

                  {/* Carved Ancient Inscription Slab Graphic */}
                  <div className="fragment-stone-slab">
                    <div className="stone-texture-overlay"></div>
                    <div className="stone-ancient-glyphs">
                      {frag.ancientScript}
                    </div>
                    <div className="stone-seal-mark">
                      <Sun size={20} className="text-gold" />
                    </div>
                  </div>

                  {/* Fragment Content */}
                  <div className="fragment-details">
                    <h4 className="fragment-title">{frag.title}</h4>
                    <p className="fragment-transcription">
                      &ldquo;{frag.transcription}&rdquo;
                    </p>
                  </div>

                  {/* Reordering Controls for Touch & Accessibility */}
                  <div className="fragment-reorder-bar" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn-move-arrow"
                      disabled={index === 0 || validationState === 'CORRECT'}
                      onClick={() => handleMoveLeft(index)}
                      title="Move Left"
                      aria-label="Move fragment left"
                    >
                      &larr;
                    </button>
                    <span className="reorder-prompt">
                      {isSelected ? 'Tap another card to swap' : 'Tap to select & swap'}
                    </span>
                    <button 
                      className="btn-move-arrow"
                      disabled={index === placedFragments.length - 1 || validationState === 'CORRECT'}
                      onClick={() => handleMoveRight(index)}
                      title="Move Right"
                      aria-label="Move fragment right"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. VALIDATION CONTROLS & FEEDBACK                                   */}
        {/* =================================================================== */}
        <div className="decoder-actions-bar">
          <div className="decoder-feedback-area">
            {validationState === 'INCORRECT' && (
              <div className="decoder-error-feedback animate-fade-in">
                <AlertCircle size={18} className="text-terracotta" />
                <div>
                  <strong>Something doesn&rsquo;t fit!</strong>
                  <p>Check the chronological sequence of the fortress construction. Tap &lsquo;Scholar Hint&rsquo; if you need guidance.</p>
                </div>
              </div>
            )}

            {validationState === 'CORRECT' && (
              <div className="decoder-success-feedback animate-fade-in">
                <CheckCircle2 size={20} className="text-emerald" />
                <div>
                  <strong>INSCRIPTION DECODED!</strong>
                  <p>You have reconstructed the founding chronicle of Mehrangarh Fort flawlessly.</p>
                </div>
              </div>
            )}
          </div>

          <div className="decoder-buttons-row">
            <button 
              className="btn-heritage-secondary"
              onClick={handleReset}
              disabled={validationState === 'CORRECT'}
            >
              <RotateCcw size={16} />
              <span>Reset Sequence</span>
            </button>

            {validationState !== 'CORRECT' ? (
              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={handleVerifySequence}
                id="verify-inscription-btn"
              >
                <Scroll size={18} />
                <span>DECODE INSCRIPTION</span>
              </button>
            ) : (
              <button 
                className="btn-heritage-primary btn-large-cta pulse-emerald"
                onClick={handleClaimReward}
                id="claim-mehrangarh-reward-btn"
              >
                <Award size={18} />
                <span>CLAIM RELIC &amp; COMPLETE CHAPTER (+150 XP)</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 5. EDUCATIONAL STORY REVEAL ("WHAT YOU DISCOVERED")                 */}
        {/* =================================================================== */}
        {validationState === 'CORRECT' && (
          <section className="educational-story-section animate-fade-in">
            <div className="story-header">
              <div className="story-badge">
                <Sparkles size={16} className="text-gold" />
                <span>WHAT YOU DISCOVERED</span>
              </div>
              <h3 className="story-title">The Legend of Mihirgarh: Fortress of the Sun</h3>
            </div>

            <div className="story-content-grid">
              <div className="story-card">
                <div className="story-icon-wrap">
                  <Sun size={20} className="text-gold" />
                </div>
                <div className="story-text">
                  <h4>1459 CE &bull; The Sacred Founding</h4>
                  <p>
                    Rao Jodha, chief of the Rathore clan, relocated his capital from Mandore to the 122-meter volcanic cliff of Bhakurcheeria. 
                    Named <em>Mihirgarh</em> (Sun Citadel), the fort was designed to be virtually impregnable.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <div className="story-icon-wrap">
                  <Shield size={20} className="text-emerald" />
                </div>
                <div className="story-text">
                  <h4>The Seven Gates of Defense</h4>
                  <p>
                    Successive rulers fortified the approach with seven monumental gateways, including the Jayapol and Fatehpol, built at sharp angles to negate the momentum of charging war elephants.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <div className="story-icon-wrap">
                  <Award size={20} className="text-sky" />
                </div>
                <div className="story-text">
                  <h4>Ranisar Stepwells &bull; Desert Life</h4>
                  <p>
                    Subterranean water engineering by Queen Jasmade Hadi channeled mountain rainwater into Ranisar and Padamsar stepwells, ensuring centuries of water security in the arid Thar desert.
                  </p>
                </div>
              </div>
            </div>

            <div className="vikram-praise-card">
              <div className="vikram-praise-avatar">AV</div>
              <div className="vikram-praise-body">
                <strong>Acharya Vikram:</strong>
                <p>
                  &ldquo;Excellent, Explorer. History is often hidden in details that survive for centuries. 
                  By decoding this inscription, you have revived the living memory of Marwar.&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
