import { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  ArrowRight,
  Info,
  Award,
  Hammer,
  BookOpen,
  Camera
} from 'lucide-react';
import { sound } from '../../data/soundEffects';

/* 
  Amer Fort Heritage Architectural Restoration
  3 Authentic Rajasthani Pattern Elements:
  1. 'piece_lotus': Crown Arch Lotus Keystone (Top)
  2. 'piece_mirror': Sheesh Mahal Mirrored Star Octagram (Center-Left)
  3. 'piece_jali': Carved Sandstone Floral Jali (Bottom-Right)
*/

const RESTORATION_PIECES = [
  {
    id: 'piece_lotus',
    slotId: 'slot_top_keystone',
    name: 'Royal Lotus Arch Crest',
    era: 'Mughal-Rajput Stucco Inlay',
    description: 'Carved scalloped lotus arch with golden filigree and vermillion lapis floral borders.',
    shapeLabel: 'Lotus Arch Keystone'
  },
  {
    id: 'piece_mirror',
    slotId: 'slot_center_mirror',
    name: 'Sheesh Mahal Mirrored Octagram',
    era: 'Belgian Convex Glass & Plaster',
    description: 'Eight-pointed star composed of curved silvered mirrors designed to multiply candlelight.',
    shapeLabel: 'Convex Mirror Star'
  },
  {
    id: 'piece_jali',
    slotId: 'slot_corner_jali',
    name: 'Carved Sandstone Floral Medallion',
    era: 'Aravalli Pink Sandstone Piercing',
    description: 'Intricate geometric jali lattice providing continuous cross-ventilation in desert palaces.',
    shapeLabel: 'Floral Jali Medallion'
  }
];

const RESTORATION_SLOTS = [
  {
    id: 'slot_top_keystone',
    title: 'Keystone Arch Socket (North)',
    targetPieceId: 'piece_lotus',
    cx: 250,
    cy: 82,
    radius: 48,
    hint: 'Fits the curved lotus crown apex above the central sanctum arch.'
  },
  {
    id: 'slot_center_mirror',
    title: 'Mirror Octagram Cavity (Center-West)',
    targetPieceId: 'piece_mirror',
    cx: 145,
    cy: 250,
    radius: 48,
    hint: 'Fits the radiant 8-pointed star rosette near the hall threshold.'
  },
  {
    id: 'slot_corner_jali',
    title: 'Latticework Frame (South-East)',
    targetPieceId: 'piece_jali',
    cx: 355,
    cy: 250,
    radius: 48,
    hint: 'Fits the pierced floral ventilation medallion along the outer wall.'
  }
];

export default function RestoreHeritageMiniGame({ 
  location, 
  onCompleteRestoration, 
  onStartQuiz,
  onReturnToExplore, 
  onReturnToMap,
  onOpenCodex,
  playerStats: _playerStats 
}) {
  // Game Flow Stage: 'intro' | 'workbench' | 'celebrating' | 'completed_screen'
  const [stage, setStage] = useState('intro');

  // Restoration piece placement state: { slotId: pieceId }
  const [placedPieces, setPlacedPieces] = useState({});
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [errorSlotId, setErrorSlotId] = useState(null);
  const [recentCorrectSlot, setRecentCorrectSlot] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasAwardedStats, setHasAwardedStats] = useState(false);

  const restoredCount = Object.keys(placedPieces).length;
  const isAllRestored = restoredCount === RESTORATION_PIECES.length;

  // Unplaced pieces available in the tray
  const availablePieces = RESTORATION_PIECES.filter(p => !Object.values(placedPieces).includes(p.id));

  // Handle Piece Selection in Tray
  const handleSelectPiece = (pieceId) => {
    sound.playClick();
    if (selectedPieceId === pieceId) {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId(pieceId);
      setErrorSlotId(null);
    }
  };

  // Handle Attempt to Place Piece in Slot
  const handlePlaceInSlot = (slot) => {
    if (!selectedPieceId && !isAllRestored) {
      const matchingPiece = availablePieces.find(p => p.id === slot.targetPieceId);
      if (matchingPiece) {
        sound.playClick();
        setSelectedPieceId(matchingPiece.id);
      }
      return;
    }

    if (placedPieces[slot.id]) {
      return;
    }

    // Check if selected piece matches target slot
    if (selectedPieceId === slot.targetPieceId) {
      // Correct Placement
      sound.playBeamConnect();
      const updatedPlaced = {
        ...placedPieces,
        [slot.id]: selectedPieceId
      };
      setPlacedPieces(updatedPlaced);
      setSelectedPieceId(null);
      setErrorSlotId(null);
      setRecentCorrectSlot(slot.id);

      setTimeout(() => {
        setRecentCorrectSlot(null);
      }, 1000);

      // Check if all 3 pieces are restored
      if (Object.keys(updatedPlaced).length === RESTORATION_PIECES.length) {
        sound.playVictoryFanfare();
        setStage('celebrating');

        if (!hasAwardedStats && onCompleteRestoration) {
          setHasAwardedStats(true);
          onCompleteRestoration({
            xpAward: 100,
            relicAward: location.relic || {
              id: 'relic_amer_mirror',
              name: 'Sun Mirror of Amer',
              tier: 'Legendary Relic',
              lore: 'Masterfully carved solar brass prism and convex mirror inlay of Amer Fort.'
            }
          });
        }

        // After 2.6 seconds, smoothly transition to the clean completion screen
        setTimeout(() => {
          setStage('completed_screen');
        }, 2600);
      }
    } else {
      // Incorrect Placement - gentle feedback
      sound.playError();
      setErrorSlotId(slot.id);
      setTimeout(() => {
        setErrorSlotId(null);
      }, 750);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, pieceId) => {
    e.dataTransfer.setData('text/plain', pieceId);
    setSelectedPieceId(pieceId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();
    const droppedPieceId = e.dataTransfer.getData('text/plain') || selectedPieceId;
    if (!droppedPieceId) return;

    if (droppedPieceId === slot.targetPieceId) {
      sound.playBeamConnect();
      const updatedPlaced = {
        ...placedPieces,
        [slot.id]: droppedPieceId
      };
      setPlacedPieces(updatedPlaced);
      setSelectedPieceId(null);
      setErrorSlotId(null);
      setRecentCorrectSlot(slot.id);

      setTimeout(() => {
        setRecentCorrectSlot(null);
      }, 1000);

      if (Object.keys(updatedPlaced).length === RESTORATION_PIECES.length) {
        sound.playVictoryFanfare();
        setStage('celebrating');

        if (!hasAwardedStats && onCompleteRestoration) {
          setHasAwardedStats(true);
          onCompleteRestoration({
            xpAward: 100,
            relicAward: location.relic || {
              id: 'relic_amer_mirror',
              name: 'Sun Mirror of Amer',
              tier: 'Legendary Relic',
              lore: 'Masterfully carved solar brass prism and convex mirror inlay of Amer Fort.'
            }
          });
        }

        setTimeout(() => {
          setStage('completed_screen');
        }, 2600);
      }
    } else {
      sound.playError();
      setErrorSlotId(slot.id);
      setTimeout(() => {
        setErrorSlotId(null);
      }, 750);
    }
  };

  // Reset Button Handler
  const handleReset = () => {
    sound.playClick();
    setPlacedPieces({});
    setSelectedPieceId(null);
    setErrorSlotId(null);
    setRecentCorrectSlot(null);
  };

  return (
    <div className="restoration-screen-container">
      {/* ===================================================================== */}
      {/* 1. CINEMATIC RESTORATION INTRO MODAL                                  */}
      {/* ===================================================================== */}
      {stage === 'intro' && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Restoration Introduction">
          <div className="compact-inspection-modal-card restoration-intro-modal-card">
            <div className="inspection-modal-header">
              <div className="inspection-badge-pill">
                <Hammer size={14} className="text-gold" />
                <span>Amer Fort Architectural Preservation</span>
              </div>
            </div>

            <div className="inspection-content-body">
              {/* Acharya Vikram Guide Intro Spotlight */}
              <div className="restoration-intro-guide-showcase">
                <div className="guide-showcase-avatar-frame">
                  <img 
                    src="/assets/characters/acharya-vikram-portrait.jpg" 
                    alt="Acharya Vikram" 
                    className="vikram-portrait-photo"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                <div className="guide-showcase-dialogue-block">
                  <div className="guide-title-strip">
                    <strong>Acharya Vikram</strong>
                    <span className="guide-role-tag">Heritage Scholar &amp; Archaeologist</span>
                  </div>
                  <p className="intro-speech-line">
                    &ldquo;The clues you discovered reveal how this design was meant to be restored.&rdquo;
                  </p>
                  <p className="intro-speech-line intro-speech-callout">
                    &ldquo;Let&rsquo;s preserve it.&rdquo;
                  </p>
                </div>
              </div>

              {/* Damaged Artefact Preview Hint */}
              <div className="restoration-objective-preview-box">
                <Info size={16} className="text-gold" />
                <p>
                  Reconstruct the weathered 16th-century sandstone &amp; mirror relief of Amer Fort by fitting the 3 recovered architectural pieces back into their sacred sockets.
                </p>
              </div>
            </div>

            <div className="inspection-modal-actions">
              <button
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playChime();
                  setStage('workbench');
                }}
                id="begin-restoration-btn"
              >
                <Hammer size={18} />
                <span>BEGIN RESTORATION</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. DEDICATED COMPLETION SCREEN ("AMER FORT HERITAGE PRESERVED")        */}
      {/* ===================================================================== */}
      {stage === 'completed_screen' && (
        <div className="restoration-completed-fullscreen-view" role="region" aria-label="Amer Fort Heritage Preserved">
          <div className="completed-screen-card">
            {/* Header Title Banner */}
            <div className="completed-screen-header">
              <div className="completed-badge-pill">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Preservation Complete</span>
              </div>
              <h2 className="completed-main-title">AMER FORT HERITAGE PRESERVED</h2>
              <p className="completed-subtitle">
                You helped preserve a piece of heritage knowledge.
              </p>
            </div>

            {/* Radiant Restored Masterpiece Display */}
            <div className="completed-masterpiece-showcase">
              <svg 
                viewBox="0 0 500 420" 
                className="architectural-mandala-svg svg-radiant-glow completed-mandala-svg"
                role="img"
                aria-label="Fully Restored Amer Fort Masterpiece"
              >
                <defs>
                  <linearGradient id="sandstoneBaseGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2a1810" />
                    <stop offset="50%" stopColor="#3d2116" />
                    <stop offset="100%" stopColor="#1e0f0a" />
                  </linearGradient>

                  <linearGradient id="goldBorderGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#854d0e" />
                  </linearGradient>

                  <linearGradient id="lotusPinkGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="50%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>

                  <radialGradient id="mirrorSilverGrad2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#bae6fd" />
                    <stop offset="80%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </radialGradient>

                  <linearGradient id="emeraldJaliGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="60%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#064e3b" />
                  </linearGradient>

                  <filter id="mandalaGlow2" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Base Plate & Scalloped Arch */}
                <rect x="15" y="15" width="470" height="390" rx="20" fill="url(#sandstoneBaseGrad2)" stroke="url(#goldBorderGrad2)" strokeWidth="3" />
                <path 
                  d="M 50,390 L 50,160 Q 50,60 150,50 Q 250,15 350,50 Q 450,60 450,160 L 450,390 Z" 
                  fill="none" 
                  stroke="rgba(230, 179, 37, 0.6)" 
                  strokeWidth="2.5" 
                />

                {/* Concentric Golden Mandalas */}
                <g stroke="rgba(230, 179, 37, 0.45)" strokeWidth="1.5" fill="none">
                  <circle cx="250" cy="250" r="140" />
                  <circle cx="250" cy="250" r="100" />
                  <circle cx="250" cy="250" r="60" />
                  {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                    <line 
                      key={deg} 
                      x1="250" 
                      y1="250" 
                      x2={250 + 140 * Math.cos((deg * Math.PI) / 180)} 
                      y2={250 + 140 * Math.sin((deg * Math.PI) / 180)} 
                    />
                  ))}
                </g>

                {/* Central Medallion */}
                <circle cx="250" cy="250" r="32" fill="#eab308" />
                <circle cx="250" cy="250" r="22" fill="#1e1b4b" stroke="#fef08a" strokeWidth="2" />
                <polygon points="250,234 255,245 266,245 258,252 261,263 250,257 239,263 242,252 234,245 245,245" fill="#fde047" />

                {/* Fixed Rosettes */}
                <g transform="translate(355, 145)">
                  <circle r="34" fill="rgba(194, 89, 63, 0.5)" stroke="#e6b325" strokeWidth="2" />
                  <circle r="22" fill="#c2593f" />
                  <circle r="10" fill="#fde047" />
                </g>
                <g transform="translate(145, 145)">
                  <circle r="34" fill="rgba(14, 165, 233, 0.4)" stroke="#e6b325" strokeWidth="2" />
                  <circle r="20" fill="url(#mirrorSilverGrad2)" />
                </g>

                {/* Restored Slot 1: Top Lotus Keystone */}
                <g transform="translate(250, 82)">
                  <circle r="48" fill="rgba(254, 240, 138, 0.25)" stroke="url(#goldBorderGrad2)" strokeWidth="2.5" filter="url(#mandalaGlow2)" />
                  <path d="M -36,22 C -30,-12 0,-34 0,-34 C 0,-34 30,-12 36,22 C 22,12 -22,12 -36,22 Z" fill="url(#lotusPinkGrad2)" stroke="#fde047" strokeWidth="2" />
                  <path d="M -22,14 C -16,-5 0,-20 0,-20 C 0,-20 16,-5 22,14 C 12,8 -12,8 -22,14 Z" fill="url(#goldBorderGrad2)" />
                  <circle cx="0" cy="0" r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="0" y1="-20" x2="0" y2="-32" stroke="#fef08a" strokeWidth="2.5" />
                  <circle cx="0" cy="-32" r="3" fill="#fef08a" />
                </g>

                {/* Restored Slot 2: Sheesh Mahal Mirrored Star */}
                <g transform="translate(145, 250)">
                  <circle r="48" fill="rgba(56, 189, 248, 0.3)" stroke="url(#goldBorderGrad2)" strokeWidth="2.5" filter="url(#mandalaGlow2)" />
                  <polygon points="0,-32 10,-10 32,0 10,10 0,32 -10,10 -32,0 -10,-10" fill="url(#mirrorSilverGrad2)" stroke="#ffffff" strokeWidth="2" />
                  <polygon points="0,-18 6,-6 18,0 6,6 0,18 -6,6 -18,0 -6,-6" fill="#fde047" stroke="#a16207" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="5" fill="#ffffff" />
                </g>

                {/* Restored Slot 3: Sandstone Jali Floral Medallion */}
                <g transform="translate(355, 250)">
                  <circle r="48" fill="rgba(16, 185, 129, 0.3)" stroke="url(#goldBorderGrad2)" strokeWidth="2.5" filter="url(#mandalaGlow2)" />
                  <circle r="32" fill="#c2593f" stroke="#fde047" strokeWidth="2" />
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <g key={deg} transform={`rotate(${deg})`}>
                      <ellipse cx="0" cy="-16" rx="7" ry="12" fill="url(#emeraldJaliGrad2)" stroke="#fef08a" strokeWidth="1.2" />
                      <circle cx="0" cy="-16" r="3" fill="#ffffff" />
                    </g>
                  ))}
                  <circle r="10" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* Rewards Breakdown Cards */}
            <div className="completed-rewards-grid">
              <div className="completed-reward-card">
                <div className="reward-icon-circle bg-gold-subtle">
                  <Sparkles size={22} className="text-gold" />
                </div>
                <div className="reward-text-wrap">
                  <span className="reward-category-label">XP EARNED</span>
                  <strong className="reward-primary-value text-gold">+100 XP</strong>
                </div>
              </div>

              <div className="completed-reward-card">
                <div className="reward-icon-circle bg-emerald-subtle">
                  <Award size={22} className="text-emerald" />
                </div>
                <div className="reward-text-wrap">
                  <span className="reward-category-label">RELIC UNLOCKED</span>
                  <strong className="reward-primary-value text-emerald">Amer Fort Heritage Relic</strong>
                  <span className="reward-sub-detail">Sun Mirror of Amer</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="completed-screen-actions">
              <button
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playChime();
                  if (onStartQuiz) onStartQuiz();
                }}
                id="take-knowledge-challenge-btn"
              >
                <span>TAKE KNOWLEDGE CHALLENGE</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  onReturnToExplore();
                }}
                id="return-to-amer-fort-btn"
              >
                <span>RETURN TO AMER FORT</span>
              </button>

              {onOpenCodex && (
                <button
                  className="btn-heritage-secondary"
                  onClick={() => {
                    sound.playClick();
                    onOpenCodex();
                  }}
                  id="view-codex-from-restoration-btn"
                >
                  <BookOpen size={16} />
                  <span>VIEW IN HERITAGE CODEX</span>
                </button>
              )}

              <button
                className="btn-heritage-secondary btn-return-map-chip"
                onClick={() => {
                  sound.playClick();
                  onReturnToMap();
                }}
              >
                <Compass size={16} />
                <span>Return to Rajasthan Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. MAIN RESTORATION WORKBENCH (INTERACTIVE DRAG / TAP BOARD)           */}
      {/* ===================================================================== */}
      {(stage === 'workbench' || stage === 'celebrating') && (
        <>
          {/* Top Breadcrumb & Title Bar */}
          <div className="restoration-header-banner">
            <div className="restoration-title-block">
              <div className="restoration-badge-pill">
                <Sparkles size={14} className="text-gold" />
                <span>Interactive Architectural Restoration</span>
              </div>
              <h2 className="restoration-main-title">RESTORE THE HERITAGE</h2>
              <p className="restoration-subtitle">Reconstruct the lost architectural pattern.</p>
            </div>

            {/* Action Tray */}
            <div className="restoration-controls-tray">
              <div className="restoration-counter-badge" title="Restoration Completion Progress">
                <Hammer size={16} className="text-gold" />
                <span className="counter-text">
                  RESTORED <strong className="counter-digits">{restoredCount} / 3</strong>
                </span>
              </div>

              <button
                className="btn-heritage-secondary btn-sm"
                onClick={() => {
                  sound.playClick();
                  setShowHint(!showHint);
                }}
                title="Toggle restoration assistance"
              >
                <HelpCircle size={15} />
                <span>{showHint ? 'Hide Guidance' : 'Guidance'}</span>
              </button>

              <button
                className="btn-heritage-secondary btn-sm btn-reset-trial"
                onClick={handleReset}
                disabled={restoredCount === 0}
                title="Reset restored pieces"
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Acharya Vikram Context Guidance Box */}
          {showHint && (
            <div className="restoration-hint-box" role="region" aria-label="Acharya Vikram Guidance">
              <img 
                src="/assets/characters/acharya-vikram-portrait.jpg" 
                alt="Acharya Vikram" 
                className="vikram-mini-avatar-img"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="hint-text-content">
                <strong>Acharya Vikram advises:</strong>
                <p>
                  &ldquo;Look at the geometry of the surrounding pattern. The top crown mirrors the lotus gateway, the mirrored star belongs with the Sheesh Mahal inlays, and the pierced floral lattice aligns with the ventilation frame.&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Main Interactive Stage Grid */}
          <div className="restoration-workbench-layout">
            {/* Left / Center: The Damaged Architectural Relief Canvas */}
            <div className={`restoration-canvas-card ${isAllRestored ? 'canvas-fully-restored' : ''}`}>
              {/* Amer Fort Photographic Visual Reference Strip */}
              <div className="restoration-reference-visual-banner">
                <img 
                  src="/assets/monuments/amer-fort/amer-fort-panorama.jpg" 
                  alt="Amer Fort Architecture Reference" 
                  className="reference-banner-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="reference-banner-tag">
                  <Camera size={12} className="text-gold" />
                  <span>Amer Fort Heritage Reference &bull; Jaipur, 1592 CE</span>
                </div>
              </div>

              <div className="canvas-header-info">
                <span className="canvas-monument-tag">Amer Fort &bull; Damaged Architectural Panel</span>
                <span className="canvas-instruction-text">
                  {isAllRestored 
                    ? 'Artwork Masterfully Restored!' 
                    : selectedPieceId 
                      ? 'Tap a damaged socket to place the selected piece' 
                      : 'Select or drag a piece below to position over its damaged socket'}
                </span>
              </div>

              <div className="mandala-frame-wrapper">
                <svg 
                  viewBox="0 0 500 420" 
                  className={`architectural-mandala-svg ${isAllRestored ? 'svg-radiant-glow' : ''}`}
                  role="img"
                  aria-label="Amer Fort Damaged Architectural Panel"
                >
                  <defs>
                    <linearGradient id="damagedSandstoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1f140e" />
                      <stop offset="50%" stopColor="#2c1810" />
                      <stop offset="100%" stopColor="#140a06" />
                    </linearGradient>

                    <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#854d0e" />
                    </linearGradient>

                    <linearGradient id="lotusPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fda4af" />
                      <stop offset="50%" stopColor="#e11d48" />
                      <stop offset="100%" stopColor="#881337" />
                    </linearGradient>

                    <radialGradient id="mirrorSilverGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#bae6fd" />
                      <stop offset="80%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </radialGradient>

                    <linearGradient id="emeraldJaliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="60%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#064e3b" />
                    </linearGradient>

                    <filter id="mandalaGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Damaged Weathered Base Stone Plate */}
                  <rect x="15" y="15" width="470" height="390" rx="20" fill="url(#damagedSandstoneGrad)" stroke="url(#goldBorderGrad)" strokeWidth="2.5" />

                  {/* Faded Weathered Scalloped Arch */}
                  <path 
                    d="M 50,390 L 50,160 Q 50,60 150,50 Q 250,15 350,50 Q 450,60 450,160 L 450,390 Z" 
                    fill="none" 
                    stroke="rgba(230, 179, 37, 0.3)" 
                    strokeWidth="2" 
                    strokeDasharray="6 4"
                  />

                  {/* Weathered Stone Fissure & Crack Overlays (Indicating historic damage) */}
                  <g stroke="rgba(0, 0, 0, 0.6)" strokeWidth="2.5" fill="none" opacity="0.75">
                    <path d="M 230,60 L 245,110 L 260,135 L 255,180" />
                    <path d="M 120,230 L 160,260 L 180,245" />
                    <path d="M 330,240 L 370,270 L 390,250" />
                  </g>

                  {/* Decorative Sandstone Arabesque Faint Fill Lines */}
                  <g stroke="rgba(212, 163, 89, 0.2)" strokeWidth="1.5" fill="none">
                    <circle cx="250" cy="250" r="140" />
                    <circle cx="250" cy="250" r="100" />
                    <circle cx="250" cy="250" r="60" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line 
                        key={deg} 
                        x1="250" 
                        y1="250" 
                        x2={250 + 140 * Math.cos((deg * Math.PI) / 180)} 
                        y2={250 + 140 * Math.sin((deg * Math.PI) / 180)} 
                      />
                    ))}
                  </g>

                  {/* Intact Core Medallion */}
                  <circle cx="250" cy="250" r="32" fill="#eab308" opacity="0.8" />
                  <circle cx="250" cy="250" r="22" fill="#1e1b4b" stroke="#fef08a" strokeWidth="2" />
                  <polygon points="250,234 255,245 266,245 258,252 261,263 250,257 239,263 242,252 234,245 245,245" fill="#fde047" />

                  {/* ==================================================== */}
                  {/* THE 3 INTERACTIVE RESTORATION SLOTS                 */}
                  {/* ==================================================== */}
                  {RESTORATION_SLOTS.map((slot) => {
                    const isOccupied = Boolean(placedPieces[slot.id]);
                    const isError = errorSlotId === slot.id;
                    const isRecentSuccess = recentCorrectSlot === slot.id;
                    const isValidTarget = selectedPieceId === slot.targetPieceId;

                    return (
                      <g 
                        key={slot.id} 
                        transform={`translate(${slot.cx}, ${slot.cy})`}
                        className={`restoration-slot-svg-group ${isOccupied ? 'slot-filled' : 'slot-vacant'} ${isValidTarget ? 'slot-valid-target' : ''} ${isError ? 'slot-error-shake' : ''}`}
                        onClick={() => handlePlaceInSlot(slot)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, slot)}
                        style={{ cursor: isOccupied ? 'default' : 'pointer' }}
                      >
                        {/* Vacant Missing Socket Cutout with Damaged Patina */}
                        {!isOccupied && (
                          <g>
                            {/* Outer Glow Halo on Selection */}
                            <circle 
                              r={slot.radius + 6} 
                              fill="none" 
                              stroke={isValidTarget ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.12)"} 
                              strokeWidth={isValidTarget ? "3" : "1.5"}
                              strokeDasharray={isValidTarget ? "8 4" : "4 4"}
                              className={isValidTarget ? "pulsing-socket-ring" : ""}
                            />

                            {/* Darkened Damaged Socket Cutout */}
                            <circle 
                              r={slot.radius} 
                              fill="rgba(8, 12, 20, 0.95)" 
                              stroke={isError ? "var(--terracotta-accent)" : isValidTarget ? "var(--gold-primary)" : "rgba(212, 163, 89, 0.4)"} 
                              strokeWidth={isError ? "3" : "2"}
                            />

                            {/* Faint Ghost Icon Silhouette */}
                            <g opacity="0.3">
                              {slot.id === 'slot_top_keystone' && (
                                <path d="M -24,15 C -20,-10 0,-25 0,-25 C 0,-25 20,-10 24,15 C 15,10 -15,10 -24,15 Z" fill="#e6b325" />
                              )}
                              {slot.id === 'slot_center_mirror' && (
                                <polygon points="0,-22 6,-6 22,0 6,6 0,22 -6,6 -22,0 -6,-6" fill="#38bdf8" />
                              )}
                              {slot.id === 'slot_corner_jali' && (
                                <g>
                                  <circle r="18" fill="none" stroke="#10b981" strokeWidth="2" />
                                  <circle r="6" fill="#10b981" />
                                </g>
                              )}
                            </g>

                            {/* Slot Label Text */}
                            <text 
                              y="4" 
                              textAnchor="middle" 
                              fill={isValidTarget ? "var(--gold-light)" : "rgba(255, 255, 255, 0.65)"} 
                              fontSize="9" 
                              fontWeight="700"
                              fontFamily="Outfit, sans-serif"
                            >
                              {isValidTarget ? 'TAP TO PLACE' : 'DAMAGED'}
                            </text>
                          </g>
                        )}

                        {/* Placed: Slot 1 - Top Lotus Arch Keystone */}
                        {isOccupied && slot.id === 'slot_top_keystone' && (
                          <g className={isRecentSuccess ? 'piece-snap-celebration' : ''}>
                            <circle r={slot.radius} fill="rgba(254, 240, 138, 0.2)" stroke="url(#goldBorderGrad)" strokeWidth="2" filter="url(#mandalaGlow)" />
                            <path 
                              d="M -36,22 C -30,-12 0,-34 0,-34 C 0,-34 30,-12 36,22 C 22,12 -22,12 -36,22 Z" 
                              fill="url(#lotusPinkGrad)" 
                              stroke="#fde047" 
                              strokeWidth="2" 
                            />
                            <path 
                              d="M -22,14 C -16,-5 0,-20 0,-20 C 0,-20 16,-5 22,14 C 12,8 -12,8 -22,14 Z" 
                              fill="url(#goldBorderGrad)" 
                            />
                            <circle cx="0" cy="0" r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                            <line x1="0" y1="-20" x2="0" y2="-32" stroke="#fef08a" strokeWidth="2.5" />
                            <circle cx="0" cy="-32" r="3" fill="#fef08a" />
                          </g>
                        )}

                        {/* Placed: Slot 2 - Sheesh Mahal Mirror Octagram */}
                        {isOccupied && slot.id === 'slot_center_mirror' && (
                          <g className={isRecentSuccess ? 'piece-snap-celebration' : ''}>
                            <circle r={slot.radius} fill="rgba(56, 189, 248, 0.25)" stroke="url(#goldBorderGrad)" strokeWidth="2" filter="url(#mandalaGlow)" />
                            <polygon 
                              points="0,-32 10,-10 32,0 10,10 0,32 -10,10 -32,0 -10,-10" 
                              fill="url(#mirrorSilverGrad)" 
                              stroke="#ffffff" 
                              strokeWidth="2" 
                            />
                            <polygon 
                              points="0,-18 6,-6 18,0 6,6 0,18 -6,6 -18,0 -6,-6" 
                              fill="#fde047" 
                              stroke="#a16207" 
                              strokeWidth="1.5" 
                            />
                            <circle cx="0" cy="0" r="5" fill="#ffffff" />
                            {[45, 135, 225, 315].map((ang) => (
                              <circle 
                                key={ang} 
                                cx={24 * Math.cos((ang * Math.PI) / 180)} 
                                cy={24 * Math.sin((ang * Math.PI) / 180)} 
                                r="3.5" 
                                fill="#ffffff" 
                                stroke="#38bdf8" 
                                strokeWidth="1" 
                              />
                            ))}
                          </g>
                        )}

                        {/* Placed: Slot 3 - Sandstone Jali Floral Medallion */}
                        {isOccupied && slot.id === 'slot_corner_jali' && (
                          <g className={isRecentSuccess ? 'piece-snap-celebration' : ''}>
                            <circle r={slot.radius} fill="rgba(16, 185, 129, 0.25)" stroke="url(#goldBorderGrad)" strokeWidth="2" filter="url(#mandalaGlow)" />
                            <circle r="32" fill="#c2593f" stroke="#fde047" strokeWidth="2" />
                            {[0, 60, 120, 180, 240, 300].map((deg) => (
                              <g key={deg} transform={`rotate(${deg})`}>
                                <ellipse cx="0" cy="-16" rx="7" ry="12" fill="url(#emeraldJaliGrad)" stroke="#fef08a" strokeWidth="1.2" />
                                <circle cx="0" cy="-16" r="3" fill="#ffffff" />
                              </g>
                            ))}
                            <circle r="10" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
                            <circle r="4" fill="#064e3b" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right / Bottom: Pattern Pieces Tray & Target Picker */}
            <div className="restoration-tray-card">
              <div className="tray-header">
                <h3 className="tray-title">Restoration Pieces</h3>
                <span className="tray-subtitle">
                  {availablePieces.length > 0 
                    ? `Select or drag a piece to its damaged socket in the panel above.`
                    : `All 3 architectural pieces have been perfectly restored!`}
                </span>
              </div>

              <div className="restoration-pieces-list">
                {RESTORATION_PIECES.map((piece) => {
                  const isPlaced = Object.values(placedPieces).includes(piece.id);
                  const isSelected = selectedPieceId === piece.id;

                  return (
                    <div
                      key={piece.id}
                      className={`restoration-piece-card ${isPlaced ? 'piece-card-placed' : ''} ${isSelected ? 'piece-card-selected' : ''}`}
                      onClick={() => !isPlaced && handleSelectPiece(piece.id)}
                      draggable={!isPlaced}
                      onDragStart={(e) => !isPlaced && handleDragStart(e, piece.id)}
                      role="button"
                      tabIndex={isPlaced ? -1 : 0}
                      aria-pressed={isSelected}
                      aria-label={`${piece.name} - ${isPlaced ? 'Restored' : 'Select to place'}`}
                    >
                      {/* Miniature Piece Visual Badge */}
                      <div className="piece-icon-frame">
                        {piece.id === 'piece_lotus' && (
                          <svg viewBox="0 0 80 80" className="mini-piece-svg">
                            <circle cx="40" cy="40" r="36" fill="#3d2116" stroke="#eab308" strokeWidth="2" />
                            <path d="M 15,55 C 20,25 40,12 40,12 C 40,12 60,25 65,55 C 50,45 30,45 15,55 Z" fill="#e11d48" stroke="#fde047" strokeWidth="1.5" />
                            <circle cx="40" cy="38" r="5" fill="#fde047" />
                          </svg>
                        )}
                        {piece.id === 'piece_mirror' && (
                          <svg viewBox="0 0 80 80" className="mini-piece-svg">
                            <circle cx="40" cy="40" r="36" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                            <polygon points="40,12 48,30 68,40 48,50 40,68 32,50 12,40 32,30" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="40" cy="40" r="6" fill="#fde047" />
                          </svg>
                        )}
                        {piece.id === 'piece_jali' && (
                          <svg viewBox="0 0 80 80" className="mini-piece-svg">
                            <circle cx="40" cy="40" r="36" fill="#1e1b4b" stroke="#10b981" strokeWidth="2" />
                            <circle cx="40" cy="40" r="24" fill="#c2593f" />
                            {[0, 60, 120, 180, 240, 300].map((d) => (
                              <circle key={d} cx={40 + 14 * Math.cos((d * Math.PI) / 180)} cy={40 + 14 * Math.sin((d * Math.PI) / 180)} r="4" fill="#10b981" />
                            ))}
                            <circle cx="40" cy="40" r="6" fill="#fde047" />
                          </svg>
                        )}
                      </div>

                      {/* Piece Details */}
                      <div className="piece-meta-block">
                        <div className="piece-name-row">
                          <h4 className="piece-name">{piece.name}</h4>
                          {isPlaced ? (
                            <span className="piece-status-chip chip-restored">
                              <CheckCircle2 size={13} />
                              <span>Restored</span>
                            </span>
                          ) : isSelected ? (
                            <span className="piece-status-chip chip-selected">
                              <span>Selected</span>
                            </span>
                          ) : null}
                        </div>
                        <span className="piece-era-tag">{piece.era}</span>
                        <p className="piece-desc">{piece.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Touch & Mouse Helper */}
              <div className="restoration-touch-guide">
                <Sparkles size={14} className="text-gold" />
                <span>Drag piece to socket OR tap piece then tap target</span>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 4. TEMPORARY CELEBRATION TOAST OVERLAY (DURING RESTORATION TRANSITION) */}
          {/* =================================================================== */}
          {stage === 'celebrating' && (
            <div className="walk-all-clues-discovered-banner quest-celebration-toast-overlay" role="region" aria-label="Heritage Restored Toast">
              <div className="banner-left-trophy">
                <div className="trophy-crest-circle">
                  <Award size={28} className="text-gold" />
                </div>
                <div className="banner-text-block">
                  <span className="banner-tag-badge">HERITAGE RESTORED!</span>
                  <h3 className="banner-main-title">AMER FORT RELIEF COMPLETE</h3>
                  <p className="banner-subtext">
                    <strong className="text-gold">+100 XP</strong> &bull; <strong className="text-emerald">+1 Relic (Amer Mirror)</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
