import { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award, 
  ArrowLeft, 
  BookOpen, 
  Layers,
  HelpCircle,
  Shield,
  Coins
} from 'lucide-react';
import { sound } from '../../data/soundEffects';

const ROUTE_STAGES_DATA = [
  {
    id: 'stage_caravan',
    order: 1,
    stageNum: 'STAGE I',
    title: 'Desert Caravan Approach',
    subtitle: 'Thar Desert Sands & Camel Waypoints',
    transcription: 'Merchant caravans laden with silks, spices, and lapis lazuli cross the perilous sands of the Great Thar Desert, navigating by night constellations toward the golden beacon of Trikuta Hill.',
    iconType: 'caravan',
    periodTag: 'Cross-Desert Transit'
  },
  {
    id: 'stage_gateway',
    order: 2,
    stageNum: 'STAGE II',
    title: 'Golden Gateway & Toll Oasis',
    subtitle: 'Sonar Qila Triple-Ringed Ramparts',
    transcription: 'Caravans reach the towering yellow sandstone bastions of Jaisalmer Fort. Passing through Suraj Pol and Ganesh Pol, merchants pay transit taxes, refill water from Gadsisar Lake, and secure safe lodging.',
    iconType: 'gateway',
    periodTag: 'Fortress Checkpoint'
  },
  {
    id: 'stage_exchange',
    order: 3,
    stageNum: 'STAGE III',
    title: 'Trade & Living Heritage',
    subtitle: 'Manak Chowk Bazaars & Havelis',
    transcription: 'Bazaars flourish with the exchange of exotic goods, ideas, and artisan stonecraft. Accumulated trade wealth funds intricately carved sandstone havelis and Jain temple libraries, forging a thriving living citadel.',
    iconType: 'exchange',
    periodTag: 'Cultural Exchange'
  }
];

export default function JaisalmerRouteGame({
  location,
  _playerStats,
  onCompleteChapter,
  onReturnToMap,
  onOpenCodex
}) {
  // Scrambled initial arrangement [Stage 2, Stage 3, Stage 1]
  const [placedStages, setPlacedStages] = useState(() => [
    ROUTE_STAGES_DATA[1],
    ROUTE_STAGES_DATA[2],
    ROUTE_STAGES_DATA[0]
  ]);

  const [selectedStageIndex, setSelectedStageIndex] = useState(null);
  const [validationState, setValidationState] = useState(null); // null | 'CORRECT' | 'INCORRECT'
  const [showHint, setShowHint] = useState(false);

  // Swap stages between two slot indices
  const handleSwap = (fromIndex, toIndex) => {
    sound.playClick();
    const updated = [...placedStages];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[toIndex];
    updated[toIndex] = temp;
    setPlacedStages(updated);
    setValidationState(null);
    setSelectedStageIndex(null);
  };

  const handleSelectSlot = (index) => {
    sound.playClick();
    if (selectedStageIndex === null) {
      setSelectedStageIndex(index);
    } else if (selectedStageIndex === index) {
      setSelectedStageIndex(null);
    } else {
      handleSwap(selectedStageIndex, index);
    }
  };

  const handleMoveLeft = (index) => {
    if (index > 0) handleSwap(index, index - 1);
  };

  const handleMoveRight = (index) => {
    if (index < placedStages.length - 1) handleSwap(index, index + 1);
  };

  const handleVerifyRoute = () => {
    const isCorrect = 
      placedStages[0].order === 1 && 
      placedStages[1].order === 2 && 
      placedStages[2].order === 3;

    if (isCorrect) {
      sound.playFanfare();
      setValidationState('CORRECT');
    } else {
      sound.playError();
      setValidationState('INCORRECT');
    }
  };

  const handleClaimReward = () => {
    sound.playFanfare();
    if (onCompleteChapter) {
      onCompleteChapter({
        xpAward: 200,
        relicAward: location?.relic || {
          id: 'relic_jaisalmer_route',
          name: 'Golden Route Relic',
          tier: 'Legendary Relic',
          xpReward: 200,
          lore: 'A masterfully sculpted golden sandstone merchant seal bearing the caravan compass of the Thar Desert and the royal crest of Rawal Jaisal.',
          iconType: 'compass'
        }
      });
    }
  };

  return (
    <div className="game-screen-container restoration-screen-root">
      {/* 1. Header Navigation Bar */}
      <header className="restoration-top-bar">
        <div className="top-bar-left">
          <button 
            className="btn-back-square"
            onClick={() => {
              sound.playClick();
              if (onReturnToMap) onReturnToMap();
            }}
            title="Return to Exploration"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="location-context">
            <span className="location-type-tag">JAISALMER FORT &bull; SONAR QILA</span>
            <h2 className="location-name-title">RECONSTRUCT THE GOLDEN ROUTE</h2>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="progress-pill">
            <Layers size={15} className="text-gold" />
            <span>Step 2 of 2: Trade Reconstruction</span>
          </div>

          <button 
            className="btn-codex-trigger"
            onClick={() => {
              sound.playClick();
              if (onOpenCodex) onOpenCodex();
            }}
          >
            <BookOpen size={16} />
            <span>Codex</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workbench Content */}
      <div className="decoder-workbench-main">
        {/* Intro Guide Banner */}
        <div className="decoder-intro-banner">
          <div className="decoder-guide-avatar">AV</div>
          <div className="decoder-intro-text">
            <div className="decoder-guide-title">
              <Sparkles size={14} className="text-gold" />
              <span>ACHARYA VIKRAM &bull; HISTORICAL RECONSTRUCTION</span>
            </div>
            <p className="decoder-guide-quote">
              &ldquo;Explorer, the golden walls of Jaisalmer thrived at the center of a vast desert trade network. Arrange these 3 journey stages into their correct logical order to reconstruct the historic route.&rdquo;
            </p>
          </div>
        </div>

        {/* Objective & Instructions Strip */}
        <div className="decoder-objective-strip">
          <div className="objective-left">
            <Compass size={18} className="text-gold" />
            <strong>OBJECTIVE:</strong>
            <span>Order the 3 trade stages from Desert Transit &rarr; Citadel Arrival &rarr; Cultural Exchange</span>
          </div>

          <button 
            className="btn-text-action"
            onClick={() => {
              sound.playClick();
              setShowHint(!showHint);
            }}
          >
            <HelpCircle size={15} />
            <span>{showHint ? 'Hide Scholar Hint' : 'Scholar Hint'}</span>
          </button>
        </div>

        {showHint && (
          <div className="decoder-hint-card">
            <AlertCircle size={18} className="text-gold" />
            <p>
              <strong>Chronological Logic:</strong> First, camel caravans navigate the perilous Thar sands (Stage I). Next, they arrive at Sonar Qila&rsquo;s gates for oasis water and customs (Stage II). Finally, goods and culture are traded in the bustling bazaars, funding merchant havelis (Stage III).
            </p>
          </div>
        )}

        {/* 3 Interactive Route Stages Grid */}
        <div className="decoder-slots-container">
          <div className="decoder-slots-grid">
            {placedStages.map((stage, idx) => {
              const isSelected = selectedStageIndex === idx;
              const isVerifiedCorrect = validationState === 'CORRECT';

              return (
                <div 
                  key={stage.id}
                  className={`decoder-fragment-card ${isSelected ? 'fragment-selected' : ''} ${isVerifiedCorrect ? 'fragment-verified' : ''}`}
                  onClick={() => handleSelectSlot(idx)}
                >
                  {/* Slot Number Header */}
                  <div className="fragment-slot-badge">
                    <span className="slot-num-pill">POSITION 0{idx + 1}</span>
                    <span className="slot-period-tag">{stage.periodTag}</span>
                  </div>

                  {/* Sandstone Tablet Visual Artwork */}
                  <div className="fragment-stone-slab jaisalmer-stone-slab">
                    {stage.iconType === 'caravan' && (
                      <svg viewBox="0 0 100 60" className="route-stage-svg">
                        <defs>
                          <linearGradient id="duneG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fde047" />
                            <stop offset="100%" stopColor="#ca8a04" />
                          </linearGradient>
                        </defs>
                        {/* Sand Dunes */}
                        <path d="M0 45 Q30 25 60 48 T100 35 L100 60 L0 60 Z" fill="url(#duneG)" opacity="0.4" />
                        <path d="M0 50 Q45 35 75 52 T100 42 L100 60 L0 60 Z" fill="url(#duneG)" opacity="0.8" />
                        {/* Stars */}
                        <circle cx="20" cy="15" r="1.5" fill="#fef08a" />
                        <circle cx="50" cy="10" r="2" fill="#ffffff" />
                        <circle cx="80" cy="18" r="1.5" fill="#fef08a" />
                        {/* Camel Caravan Silhouette */}
                        <path d="M35 38 Q38 32 42 32 Q46 32 48 35 Q51 30 55 32 Q58 35 60 40 L60 48 L58 48 L57 42 L52 42 L50 48 L48 48 L46 41 L40 41 L38 48 L36 48 Z" fill="#854d0e" />
                        <path d="M62 40 Q64 36 67 36 Q70 36 72 38 Q74 34 78 36 Q80 38 82 42 L82 48 L80 48 L79 43 L76 43 L74 48 L72 48 L70 42 L66 42 L64 48 L62 48 Z" fill="#78350f" />
                      </svg>
                    )}

                    {stage.iconType === 'gateway' && (
                      <svg viewBox="0 0 100 60" className="route-stage-svg">
                        <defs>
                          <linearGradient id="fortG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fde047" />
                            <stop offset="100%" stopColor="#a16207" />
                          </linearGradient>
                        </defs>
                        {/* Fort Bastions & Triple Gateways */}
                        <rect x="15" y="18" width="22" height="38" fill="url(#fortG)" rx="2" />
                        <rect x="63" y="18" width="22" height="38" fill="url(#fortG)" rx="2" />
                        <rect x="37" y="24" width="26" height="32" fill="#713f12" />
                        {/* Gateway Arch */}
                        <path d="M42 56 L42 38 Q50 30 58 38 L58 56 Z" fill="#1e293b" stroke="#eab308" strokeWidth="1.5" />
                        {/* Battlements */}
                        <rect x="15" y="12" width="5" height="6" fill="#eab308" />
                        <rect x="23" y="12" width="5" height="6" fill="#eab308" />
                        <rect x="31" y="12" width="5" height="6" fill="#eab308" />
                        <rect x="64" y="12" width="5" height="6" fill="#eab308" />
                        <rect x="72" y="12" width="5" height="6" fill="#eab308" />
                        <rect x="80" y="12" width="5" height="6" fill="#eab308" />
                      </svg>
                    )}

                    {stage.iconType === 'exchange' && (
                      <svg viewBox="0 0 100 60" className="route-stage-svg">
                        {/* Haveli Jali lattice & Merchant Scales */}
                        <rect x="20" y="12" width="60" height="42" rx="4" fill="#451a03" stroke="#eab308" strokeWidth="1.5" />
                        {/* Filigree Window Grids */}
                        <circle cx="50" cy="24" r="7" fill="none" stroke="#fef08a" strokeWidth="1.2" />
                        <line x1="28" y1="38" x2="72" y2="38" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" />
                        <line x1="28" y1="44" x2="72" y2="44" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" />
                        <polygon points="50,16 54,24 62,24 56,29 58,36 50,32 42,36 44,29 38,24 46,24" fill="#eab308" />
                      </svg>
                    )}

                    <div className="stone-ancient-glyphs jaisalmer-glyphs">
                      {stage.stageNum}
                    </div>
                  </div>

                  {/* Stage Text & Details */}
                  <div className="fragment-details">
                    <h4 className="fragment-title">{stage.title}</h4>
                    <p className="fragment-transcription">{stage.transcription}</p>
                  </div>

                  {/* Reorder Buttons & Touch Controls */}
                  <div className="fragment-reorder-bar" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn-move-arrow"
                      disabled={idx === 0}
                      onClick={() => handleMoveLeft(idx)}
                      title="Move Left"
                    >
                      &larr;
                    </button>
                    <span className="reorder-prompt">
                      {isSelected ? 'Tap another card to swap' : 'Click/Tap to select & swap'}
                    </span>
                    <button 
                      className="btn-move-arrow"
                      disabled={idx === placedStages.length - 1}
                      onClick={() => handleMoveRight(idx)}
                      title="Move Right"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Action & Validation Area */}
        <div className="decoder-actions-bar">
          <div className="decoder-feedback-area">
            {validationState === 'INCORRECT' && (
              <div className="decoder-error-feedback">
                <AlertCircle size={22} className="text-rose" />
                <div>
                  <strong>Something doesn&rsquo;t fit in the trade sequence.</strong>
                  <p>Remember: Caravans first traverse the dunes &rarr; enter the fortified oasis &rarr; trade &amp; build the living city.</p>
                </div>
              </div>
            )}

            {validationState === 'CORRECT' && (
              <div className="decoder-success-feedback">
                <CheckCircle2 size={22} className="text-emerald" />
                <div>
                  <strong>ROUTE RECONSTRUCTED!</strong>
                  <p>You have successfully pieced together the ancient trade route of Jaisalmer.</p>
                </div>
              </div>
            )}
          </div>

          <div className="decoder-buttons-row">
            {validationState !== 'CORRECT' ? (
              <button 
                className="btn-heritage-primary btn-large-cta"
                onClick={handleVerifyRoute}
              >
                <Compass size={18} />
                <span>RECONSTRUCT ROUTE</span>
              </button>
            ) : (
              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={handleClaimReward}
              >
                <Award size={18} />
                <span>CLAIM RELIC &bull; COMPLETE CHAPTER (+200 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. Educational Story Reveal (Visible on Successful Decoding) */}
        {validationState === 'CORRECT' && (
          <div className="educational-story-section animate-fade-in">
            <div className="story-header">
              <div className="story-badge">
                <Sparkles size={14} />
                <span>WHAT YOU DISCOVERED</span>
              </div>
              <h3 className="story-title">THE STORY BEHIND THE GOLDEN ROUTE</h3>
            </div>

            <div className="story-content-grid">
              <div className="story-card">
                <div className="story-icon-wrap">
                  <Compass size={20} className="text-gold" />
                </div>
                <div className="story-text">
                  <h4>Crossroads of the Thar</h4>
                  <p>
                    Jaisalmer was founded in 1156 CE by Rawal Jaisal atop Trikuta Hill, positioned directly at the crossroads of the southern Silk Route connecting Delhi to Persia and Arabia.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <div className="story-icon-wrap">
                  <Coins size={20} className="text-gold" />
                </div>
                <div className="story-text">
                  <h4>Merchant Wealth &amp; Filigree Havelis</h4>
                  <p>
                    Tolls collected from camel caravans funded spectacular mansions like Patwon Ki Haveli, where master artisans sculpted golden Jurassic sandstone into stone filigree as delicate as lace.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <div className="story-icon-wrap">
                  <Shield size={20} className="text-gold" />
                </div>
                <div className="story-text">
                  <h4>A Living Desert Citadel</h4>
                  <p>
                    Unlike most historical citadels, Sonar Qila remains a vibrant &ldquo;living fort&rdquo; home to thousands of descendants of the original medieval artisans, priests, and merchant families.
                  </p>
                </div>
              </div>
            </div>

            {/* Acharya Vikram Praise */}
            <div className="vikram-praise-card">
              <div className="vikram-praise-avatar">AV</div>
              <div className="vikram-praise-body">
                <strong>ACHARYA VIKRAM&rsquo;S HISTORICAL INSIGHT</strong>
                <p>
                  &ldquo;Trade carried more than goods, Explorer. It carried stories, ideas, and traditions. By reconstructing this route, you have unlocked how Jaisalmer connected Rajasthan to the wider medieval world!&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
