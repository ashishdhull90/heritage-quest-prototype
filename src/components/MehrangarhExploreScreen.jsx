import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Scroll,
  X,
  Hand,
  Shield,
  Volume2,
  VolumeX,
  ArrowRight,
  Compass,
  DoorOpen,
  Sun
} from 'lucide-react';
import { sound } from '../data/soundEffects';
import JaiPolExploreScreen from './JaiPolExploreScreen';
import SunCitadelExploreScreen from './SunCitadelExploreScreen';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 4.8;
const INTERACTION_RADIUS = 130;

export default function MehrangarhExploreScreen({
  location,
  onStartMiniGame,
  onClaimExplorationXP,
  playerStats,
  onReturnToMap,
  onOpenCodex
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Initial Dialogue Intro Modal State
  const [showIntroModal, setShowIntroModal] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('seen_mehrangarh_intro');
    return !hasSeenIntro;
  });

  // Discovered Fragment IDs State
  const [discoveredIds, setDiscoveredIds] = useState(() => {
    const isDone = playerStats.completedLocations?.includes(location.id) || 
                   playerStats.completedExplorations?.includes(location.id);
    return isDone ? ['frag_foundation', 'frag_gates', 'frag_water'] : [];
  });

  // Dedicated Jai Pol Interactive Exploration Screen State
  const [showJaiPolExplore, setShowJaiPolExplore] = useState(false);

  // Dedicated Sun Citadel Interactive Exploration Screen State
  const [showSunCitadelExplore, setShowSunCitadelExplore] = useState(false);

  // Active Fragment Being Inspected
  const [activeInspectionFragment, setActiveInspectionFragment] = useState(null);
  const [nearbyFragment, setNearbyFragment] = useState(null);

  // Floating Collection Toast
  const [collectionToast, setCollectionToast] = useState(null);

  // Quest Completed Celebration Overlay (2.5s auto-fade)
  const [showQuestCelebration, setShowQuestCelebration] = useState(false);

  // Sound Mute Toggle
  const [audioMuted, setAudioMuted] = useState(!sound.enabled);

  // Player & Movement Physics State (Spawn at Central Shringar Chowk)
  const playerRef = useRef({
    x: 1180,
    y: 850,
    vx: 0,
    vy: 0,
    angle: 0,
    moving: false,
    walkFrame: 0
  });

  const keysPressed = useRef({});
  const joystickTouchRef = useRef(null);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0, active: false });
  const joystickVectorRef = useRef({ x: 0, y: 0, active: false });
  const isInteractingModalOpen = useRef(false);

  useEffect(() => {
    isInteractingModalOpen.current = !!(activeInspectionFragment || showIntroModal || showJaiPolExplore || showSunCitadelExplore);
  }, [activeInspectionFragment, showIntroModal, showJaiPolExplore, showSunCitadelExplore]);

  // Audio Toggle
  const handleToggleSound = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    sound.enabled = !next;
    if (!next) sound.playClick();
  };

  const handleStartExploration = () => {
    sound.playChime();
    sessionStorage.setItem('seen_mehrangarh_intro', 'true');
    setShowIntroModal(false);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isInteractingModalOpen.current) {
        if (e.key === 'Escape') {
          if (activeInspectionFragment) setActiveInspectionFragment(null);
        }
        return;
      }

      keysPressed.current[e.key.toLowerCase()] = true;

      // E or Space to Interact with nearby fragment (directly opens Sun Citadel or Jai Pol)
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearbyFragment) {
        e.preventDefault();
        sound.playChime();
        if (nearbyFragment.id === 'frag_foundation') {
          setShowSunCitadelExplore(true);
        } else if (nearbyFragment.id === 'frag_gates') {
          setShowJaiPolExplore(true);
        } else {
          setActiveInspectionFragment(nearbyFragment);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyFragment, activeInspectionFragment]);

  // Touch Virtual Joystick Handlers (Reusing Amer Fort Implementation)
  const handleJoystickTouchStart = (e) => {
    if (isInteractingModalOpen.current) return;
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
    const touch = e.touches ? e.touches[0] : e;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    joystickTouchRef.current = { centerX, centerY, radius: rect.width / 2 };

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxR = rect.width / 2;
    const normX = dx / (dist > maxR ? dist : maxR);
    const normY = dy / (dist > maxR ? dist : maxR);

    joystickVectorRef.current = { x: normX, y: normY, active: true };
    setJoystickVector({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchMove = (e) => {
    if (!joystickTouchRef.current || isInteractingModalOpen.current) return;
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
    const touch = e.touches ? e.touches[0] : e;
    const { centerX, centerY, radius } = joystickTouchRef.current;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const normX = dx / (dist > radius ? dist : radius);
    const normY = dy / (dist > radius ? dist : radius);

    joystickVectorRef.current = { x: normX, y: normY, active: true };
    setJoystickVector({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchEnd = () => {
    joystickTouchRef.current = null;
    joystickVectorRef.current = { x: 0, y: 0, active: false };
    setJoystickVector({ x: 0, y: 0, active: false });
  };

  // Preloaded Environment Image Asset (Authentic Mehrangarh Home Visual)
  const bgHomeImgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg';
    img.onload = () => {
      bgHomeImgRef.current = img;
    };
    if (img.complete) {
      bgHomeImgRef.current = img;
    }
  }, []);

  // Main 60FPS Game Loop & Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const player = playerRef.current;

      // Calculate Movement Vector
      let dx = 0;
      let dy = 0;

      if (!isInteractingModalOpen.current) {
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;

        if (joystickVectorRef.current.active) {
          dx = joystickVectorRef.current.x;
          dy = joystickVectorRef.current.y;
        }
      }

      const mag = Math.hypot(dx, dy);
      if (mag > 0.05) {
        const speed = PLAYER_SPEED * (mag > 1 ? 1 : mag);
        player.vx = (dx / mag) * speed;
        player.vy = (dy / mag) * speed;
        player.angle = Math.atan2(dy, dx);
        player.moving = true;
        player.walkFrame = (player.walkFrame + 0.15) % (Math.PI * 2);
      } else {
        player.vx *= 0.7;
        player.vy *= 0.7;
        player.moving = false;
      }

      // Update Player Position & Clamp to World
      player.x = Math.max(80, Math.min(WORLD_WIDTH - 80, player.x + player.vx));
      player.y = Math.max(80, Math.min(WORLD_HEIGHT - 80, player.y + player.vy));

      // Camera Follow Centered on Player
      const camX = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, player.x - canvas.width / 2));
      const camY = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, player.y - canvas.height / 2));

      // Proximity Detection to Inscription Fragments
      let foundNearby = null;
      (location.inscriptionFragments || []).forEach((frag) => {
        const dist = Math.hypot(player.x - frag.x, player.y - frag.y);
        if (dist <= INTERACTION_RADIUS) {
          foundNearby = frag;
        }
      });
      setNearbyFragment(foundNearby);

      // ===================================================================
      // DRAW CANVAS SCENE: AUTHENTIC MEHRANGARH FORT PHOTOGRAPH
      // ===================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-camX, -camY);

      // --- LAYER 1: AUTHENTIC MEHRANGARH FORT HOME / COURTYARD PHOTOGRAPH ---
      if (bgHomeImgRef.current && bgHomeImgRef.current.complete) {
        // Draw the full authentic Mehrangarh Fort photograph across the 2400x1600 world
        ctx.drawImage(bgHomeImgRef.current, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      } else {
        // Sandstone fallback gradient while image is loading
        const terrainGrad = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        terrainGrad.addColorStop(0, '#1c131a');
        terrainGrad.addColorStop(0.4, '#2d181e');
        terrainGrad.addColorStop(0.8, '#1e1424');
        terrainGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = terrainGrad;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      }

      // Subtle atmospheric lighting & vignette so the photograph is prominent while UI is crisp
      const envVignette = ctx.createRadialGradient(
        WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 400,
        WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 1400
      );
      envVignette.addColorStop(0, 'rgba(0, 0, 0, 0.04)');
      envVignette.addColorStop(0.6, 'rgba(15, 10, 5, 0.18)');
      envVignette.addColorStop(1, 'rgba(5, 5, 10, 0.55)');
      ctx.fillStyle = envVignette;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // --- LAYER 2: 3 ANCIENT MONOLITHIC INSCRIPTION STATIONS ---
      (location.inscriptionFragments || []).forEach((frag, idx) => {
        const isDiscovered = discoveredIds.includes(frag.id);
        const isNear = nearbyFragment && nearbyFragment.id === frag.id;

        // Proximity Radiant Aura
        ctx.beginPath();
        ctx.arc(frag.x, frag.y, isNear ? 64 : 44, 0, Math.PI * 2);
        ctx.fillStyle = isDiscovered 
          ? 'rgba(16, 185, 129, 0.16)' 
          : isNear 
            ? 'rgba(234, 179, 8, 0.38)' 
            : 'rgba(234, 179, 8, 0.14)';
        ctx.fill();

        // Stepped Lotus Pedestal
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.roundRect(frag.x - 34, frag.y - 34, 68, 68, 12);
        ctx.fill();
        ctx.strokeStyle = isDiscovered ? '#10b981' : '#eab308';
        ctx.lineWidth = isNear ? 3.5 : 2;
        ctx.stroke();

        // Monolithic Inscription Tablet Stele
        ctx.fillStyle = isDiscovered ? '#064e3b' : '#78350f';
        ctx.beginPath();
        ctx.roundRect(frag.x - 24, frag.y - 24, 48, 48, 8);
        ctx.fill();
        ctx.strokeStyle = isDiscovered ? '#34d399' : '#fde047';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Ancient Glyph / Number Marker
        ctx.fillStyle = isDiscovered ? '#34d399' : '#fde047';
        ctx.font = '900 18px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`0${idx + 1}`, frag.x, frag.y + 6);

        // Station Banner Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(frag.x - 80, frag.y + 40, 160, 24, 12);
        ctx.fill();
        ctx.strokeStyle = isDiscovered ? 'rgba(16, 185, 129, 0.5)' : 'rgba(234, 179, 8, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isDiscovered ? '#34d399' : '#fde047';
        ctx.font = 'bold 9.5px Outfit, sans-serif';
        ctx.fillText(
          isDiscovered ? `✓ ${frag.shortTag}` : `📜 ${frag.shortTag}`,
          frag.x,
          frag.y + 56
        );
      });

      // 3. Draw Player Character Avatar
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Player Shadow
      ctx.beginPath();
      ctx.ellipse(0, 4, 18, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Explorer Body (Blue & Gold Trim for Mehrangarh)
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e6b325';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Directional Headlamp / Flashlight Beam
      const torchGrad = ctx.createRadialGradient(18, 0, 2, 80, 0, 80);
      torchGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      torchGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = torchGrad;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.arc(10, 0, 80, -0.4, 0.4);
      ctx.closePath();
      ctx.fill();

      // Character Heading Marker
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(12, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Restore camera translation

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [discoveredIds, nearbyFragment, location]);

  // Collect Fragment Action
  const handleCollectFragment = (frag) => {
    if (!discoveredIds.includes(frag.id)) {
      sound.playChime();
      const nextDiscovered = [...discoveredIds, frag.id];
      setDiscoveredIds(nextDiscovered);
      
      // Floating feedback toast
      setCollectionToast({
        title: `FRAGMENT COLLECTED (0${nextDiscovered.length}/03)`,
        subtitle: frag.title,
        xp: frag.discoveryXP || 25
      });

      setTimeout(() => setCollectionToast(null), 3200);

      // If all 3 gathered, trigger celebration
      if (nextDiscovered.length === 3) {
        sound.playFanfare();
        setShowQuestCelebration(true);
        if (onClaimExplorationXP) onClaimExplorationXP(75);
        setTimeout(() => setShowQuestCelebration(false), 3000);
      }
    }
    setActiveInspectionFragment(null);
  };

  // Complete Jai Pol Feature Exploration Callback
  const handleCompleteJaiPol = ({ xpAward = 80 } = {}) => {
    if (onClaimExplorationXP) {
      onClaimExplorationXP(xpAward);
    }
    if (!discoveredIds.includes('frag_gates')) {
      setDiscoveredIds(prev => [...prev, 'frag_gates']);
    }
  };

  // Complete Sun Citadel Feature Exploration Callback
  const handleCompleteSunCitadel = ({ xpAward = 80 } = {}) => {
    if (onClaimExplorationXP) {
      onClaimExplorationXP(xpAward);
    }
    if (!discoveredIds.includes('frag_foundation')) {
      setDiscoveredIds(prev => [...prev, 'frag_foundation']);
    }
  };

  const fragmentsCount = discoveredIds.length;
  const isAllFragmentsFound = fragmentsCount === 3;

  return (
    <div className="location-explore-screen mehrangarh-explore-screen">
      {/* =================================================================== */}
      {/* 1. TOP EXPLORATION HUD                                              */}
      {/* =================================================================== */}
      <header className="location-top-hud">
        <div className="hud-left-location">
          <div className="hud-badge-crumbs">
            <span>RAJASTHAN &bull; MARWAR (JODHPUR)</span>
          </div>
          <div className="hud-title-row">
            <h1 className="hud-fort-name">MEHRANGARH FORT</h1>
            <span className="hud-era-tag">1459 CE (Rao Jodha)</span>
          </div>
        </div>

        <div className="hud-center-mission-pill">
          <div className="mission-title-row">
            <Scroll size={14} className="text-gold" />
            <span className="mission-label">
              {isAllFragmentsFound ? '✓ ALL 3 FRAGMENTS DISCOVERED' : 'QUEST: THE HIDDEN INSCRIPTION'}
            </span>
          </div>
          <div className="mission-progress-bar-wrap">
            <div 
              className="mission-progress-bar-fill"
              style={{ width: `${(fragmentsCount / 3) * 100}%` }}
            ></div>
          </div>
          <div className="mission-clues-counter">
            <span>{isAllFragmentsFound ? 'Ready to Decode Chronicle' : 'Explore ramparts & courtyards'} &bull; <strong className="text-gold">FRAGMENTS: {fragmentsCount} / 3</strong></span>
          </div>
        </div>

        <div className="hud-right-stats-group">
          <button 
            className="btn-hud-round-action btn-monument-landmark-chip pulse-gold"
            onClick={() => {
              sound.playChime();
              setShowSunCitadelExplore(true);
            }}
            title="Explore Sun Citadel (Rao Jodha Chamber)"
            style={{
              background: 'rgba(230, 179, 37, 0.18)',
              border: '1px solid rgba(230, 179, 37, 0.45)',
              color: 'var(--gold-light)'
            }}
          >
            <Sun size={16} />
            <span>Sun Citadel</span>
          </button>

          <button 
            className="btn-hud-round-action btn-monument-landmark-chip pulse-gold"
            onClick={() => {
              sound.playChime();
              setShowJaiPolExplore(true);
            }}
            title="Explore Jai Pol Victory Gateway"
            style={{
              background: 'rgba(230, 179, 37, 0.18)',
              border: '1px solid rgba(230, 179, 37, 0.45)',
              color: 'var(--gold-light)'
            }}
          >
            <DoorOpen size={16} />
            <span>Jai Pol</span>
          </button>

          <div className="hud-player-stats-chip">
            <span className="stat-pill-item" title="Explorer Lore Points">
              <Sparkles size={14} className="text-gold" />
              <strong>{playerStats.xp} XP</strong>
            </span>
            <span className="stat-pill-item" title="Sacred Relics">
              <Award size={14} className="text-emerald" />
              <strong>{playerStats.unlockedRelics.length}/4</strong>
            </span>
          </div>

          {onOpenCodex && (
            <button 
              className="btn-hud-round-action"
              onClick={() => {
                sound.playClick();
                onOpenCodex();
              }}
              title="Open Heritage Codex"
            >
              <BookOpen size={16} />
              <span>Codex</span>
            </button>
          )}

          <button 
            className="btn-hud-round-action"
            onClick={handleToggleSound}
            title={audioMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Sound"
          >
            {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button 
            className="btn-hud-round-action btn-return-map-chip"
            onClick={() => {
              sound.playClick();
              onReturnToMap();
            }}
            title="Return to Rajasthan Journey Hub"
          >
            &larr; Hub
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. 2D EXPLORATION VIEWPORT CANVAS WITH FOLLOW CAMERA                */}
      {/* =================================================================== */}
      <div className="game-viewport-2d-frame" ref={containerRef}>
        {/* Visual Fallback Image Layer (Cover) */}
        <img 
          src="/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg"
          alt="Mehrangarh Fort Home"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 0
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* 2D Canvas Viewport */}
        <canvas ref={canvasRef} className="game-canvas-2d" style={{ position: 'relative', zIndex: 1 }} />

        {/* Ambient Vignette & Decorative Corners */}
        <div className="viewport-overlay-vignette" style={{ zIndex: 2 }}></div>
        <div className="viewport-corner tl" style={{ zIndex: 3 }}></div>
        <div className="viewport-corner tr" style={{ zIndex: 3 }}></div>
        <div className="viewport-corner bl" style={{ zIndex: 3 }}></div>
        <div className="viewport-corner br" style={{ zIndex: 3 }}></div>

        {/* =================================================================== */}
        {/* 3. PROXIMITY INTERACTION PROMPT                                     */}
        {/* =================================================================== */}
        {nearbyFragment && !activeInspectionFragment && (
          <div className="proximity-interact-prompt animate-bounce" style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <Hand size={18} className="text-gold" />
            <div className="prompt-text">
              <strong>
                {nearbyFragment.id === 'frag_foundation' 
                  ? 'SUN CITADEL (RAO JODHA)' 
                  : nearbyFragment.id === 'frag_gates' 
                    ? 'JAI POL GATEWAY' 
                    : 'INSCRIPTION FRAGMENT'}
              </strong>
              <span>
                Press <strong>E</strong> or Tap to {
                  nearbyFragment.id === 'frag_foundation' 
                    ? 'Explore Sun Citadel' 
                    : nearbyFragment.id === 'frag_gates' 
                      ? 'Explore Jai Pol' 
                      : 'Inspect'
                } ({nearbyFragment.shortTag})
              </span>
            </div>
            <button 
              className="btn-interact-action"
              onClick={() => {
                sound.playChime();
                if (nearbyFragment.id === 'frag_foundation') {
                  setShowSunCitadelExplore(true);
                } else if (nearbyFragment.id === 'frag_gates') {
                  setShowJaiPolExplore(true);
                } else {
                  setActiveInspectionFragment(nearbyFragment);
                }
              }}
            >
              {(nearbyFragment.id === 'frag_foundation' || nearbyFragment.id === 'frag_gates') ? 'EXPLORE' : 'INTERACT'}
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. FLOATING COLLECTION TOAST                                        */}
        {/* =================================================================== */}
        {collectionToast && (
          <div className="quest-collection-floating-toast" role="status" style={{ zIndex: 50 }}>
            <div className="toast-crest-icon">
              <Scroll size={22} className="text-gold" />
            </div>
            <div className="toast-text-wrap">
              <span className="toast-headline">{collectionToast.title}</span>
              <strong className="toast-clue-title">{collectionToast.subtitle}</strong>
            </div>
            <span className="toast-xp-pill">+{collectionToast.xp} XP</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. QUEST COMPLETE CELEBRATION OVERLAY (2.5s AUTO-FADE)              */}
        {/* =================================================================== */}
        {showQuestCelebration && (
          <div className="quest-celebration-overlay animate-fade-in" role="status" style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 8, 15, 0.85)' }}>
            <div className="celebration-card">
              <div className="celebration-icon-frame pulse-gold">
                <Scroll size={36} className="text-gold" />
              </div>
              <span className="celebration-pretitle">ARCHEOLOGICAL DISCOVERY</span>
              <h2 className="celebration-title">ALL 3 FRAGMENTS GATHERED!</h2>
              <p className="celebration-desc">
                You have unearthed all inscription fragments in Mehrangarh Fort.
              </p>
              <div className="celebration-xp-pill">
                <Sparkles size={16} />
                <span>+75 Exploration XP Claimed</span>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. READY TO DECODE ACTION DOCK                                      */}
        {/* =================================================================== */}
        {isAllFragmentsFound && (
          <div className="restoration-ready-dock animate-fade-in" style={{ position: 'absolute', bottom: '80px', right: '20px', zIndex: 25 }}>
            <button 
              className="btn-heritage-primary btn-large-cta pulse-gold"
              onClick={() => {
                sound.playFanfare();
                if (onStartMiniGame) onStartMiniGame();
              }}
              id="begin-mehrangarh-restoration-btn"
            >
              <Sparkles size={20} />
              <span>DECODE INSCRIPTION AT WORKBENCH</span>
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. CONTROLS GUIDE OVERLAY CHIP                                      */}
        {/* =================================================================== */}
        <div className="keyboard-controls-hint-dock" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
          <div className="control-key-capsule">
            <span className="key-cap">W</span>
            <span className="key-cap">A</span>
            <span className="key-cap">S</span>
            <span className="key-cap">D</span>
            <span className="hint-label">Move Rao Jodha</span>
          </div>
          <div className="control-key-capsule">
            <span className="key-cap">E</span>
            <span className="hint-label">Explore / Inspect</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 7. DOCKED COMPANION GUIDE BAR (ACHARYA VIKRAM)                      */}
        {/* =================================================================== */}
        <div className="docked-companion-guide-bar">
          <div className="guide-portrait-frame">
            <img 
              src="/assets/characters/acharya-vikram-portrait.jpg" 
              alt="Acharya Vikram" 
              className="vikram-portrait-svg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="guide-speech-block">
            <div className="guide-title-strip">
              <strong>Acharya Vikram</strong>
              <span className="guide-role-tag">&bull; Royal Chronicler</span>
            </div>
            <p className="guide-speech-text">
              {isAllFragmentsFound 
                ? '“Excellent! All three inscription fragments are retrieved. Open the archeological decoder to reconstruct the founding chronicle of Rao Jodha!”' 
                : nearbyFragment 
                  ? `“You are standing right beside ${nearbyFragment.shortTag}! Press E or tap Interact to inspect the weathered inscription.”` 
                  : '“Explore the high ramparts and stepwell terraces. The stone inscriptions of 1459 CE are scattered throughout these courtyards.”'}
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 8. MOBILE VIRTUAL JOYSTICK & ACTION BUTTON (AMER FORT ADAPTATION)   */}
        {/* =================================================================== */}
        {/* Mobile Virtual Joystick (Lower-Left) */}
        <div 
          className="virtual-joystick-touchzone"
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
          onPointerDown={handleJoystickTouchStart}
          onPointerMove={handleJoystickTouchMove}
          onPointerUp={handleJoystickTouchEnd}
          onPointerCancel={handleJoystickTouchEnd}
          aria-label="Virtual Joystick"
        >
          <div className="joystick-base-circle">
            <div 
              className="joystick-stick-knob"
              style={{
                transform: `translate(${joystickVector.x * 26}px, ${joystickVector.y * 26}px)`
              }}
            ></div>
          </div>
          <span className="joystick-label">TOUCH TO MOVE</span>
        </div>

        {/* Mobile Action Button (Lower-Right) */}
        <div className="mobile-action-touchzone">
          <button
            className={`btn-mobile-action-interact ${nearbyFragment ? 'interact-active pulse-gold' : 'interact-idle'}`}
            onClick={() => {
              if (nearbyFragment) {
                sound.playChime();
                if (nearbyFragment.id === 'frag_foundation') {
                  setShowSunCitadelExplore(true);
                } else if (nearbyFragment.id === 'frag_gates') {
                  setShowJaiPolExplore(true);
                } else {
                  setActiveInspectionFragment(nearbyFragment);
                }
              }
            }}
            disabled={!nearbyFragment}
            aria-label="Interact Button"
          >
            <Hand size={22} />
            <span>{(nearbyFragment?.id === 'frag_foundation' || nearbyFragment?.id === 'frag_gates') ? 'EXPLORE' : 'INTERACT'}</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 9. ACHARYA VIKRAM INTRO MODAL                                       */}
      {/* =================================================================== */}
      {showIntroModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content discovery-inspection-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Shield size={20} className="text-gold" />
                <h3>MEHRANGARH FORT &bull; JODHPUR</h3>
              </div>
            </div>

            <div className="modal-body">
              {/* Featured Mehrangarh Fort Photography Banner */}
              <div className="inspection-featured-photo-frame" style={{ marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                <img 
                  src="/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg" 
                  alt="Mehrangarh Fort Home" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg';
                  }}
                />
              </div>

              <div className="guide-dialogue-card" style={{ marginTop: 0 }}>
                <div className="guide-avatar-badge">
                  <img 
                    src="/assets/characters/acharya-vikram-portrait.jpg" 
                    alt="Acharya Vikram" 
                    className="guide-avatar-img-circle"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="guide-speech">
                  <strong>Acharya Vikram:</strong>
                  <p className="intro-speech-line">&ldquo;Another chapter of Rajasthan awaits.&rdquo;</p>
                  <p className="intro-speech-line">&ldquo;Mehrangarh rises above Jodhpur like a fortress carved from the landscape.&rdquo;</p>
                  <p className="intro-speech-line">&ldquo;Somewhere within these walls lies an ancient story waiting to be decoded.&rdquo;</p>
                </div>
              </div>

              <div className="modal-objective-callout">
                <Scroll size={18} className="text-gold" />
                <div>
                  <strong>YOUR MISSION:</strong>
                  <p>Explore the ramparts, locate the 3 weathered inscription fragments, and decode their secrets at the workbench.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={handleStartExploration}
                id="begin-mehrangarh-exploration-btn"
              >
                <span>BEGIN EXPLORATION</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 10. ENVIRONMENTAL DISCOVERY INSPECTION MODAL                        */}
      {/* =================================================================== */}
      {activeInspectionFragment && (
        <div className="modal-overlay" onClick={() => setActiveInspectionFragment(null)} role="dialog" aria-modal="true">
          <div className="modal-content discovery-inspection-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Scroll size={20} className="text-gold" />
                <h3>INSCRIPTION FRAGMENT DISCOVERY</h3>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setActiveInspectionFragment(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Featured Mehrangarh Location Photo */}
              <div className="inspection-featured-photo-frame" style={{ marginBottom: '0.85rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                <img 
                  src="/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg" 
                  alt={activeInspectionFragment.title} 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg';
                  }}
                />
              </div>

              {/* Stone Carved Inscription Display Graphic */}
              <div className="discovery-photo-frame" style={{ minHeight: '140px', background: 'radial-gradient(circle, #2d3748 0%, #171923 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                <div className="ancient-glyph-text" style={{ fontSize: '1.25rem', fontFamily: 'serif', color: 'var(--gold-light)', letterSpacing: '2px', textAlign: 'center', marginBottom: '0.5rem' }}>
                  {activeInspectionFragment.ancientScript}
                </div>
                <div className="transcription-text" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                  &ldquo;{activeInspectionFragment.transcription}&rdquo;
                </div>
              </div>

              <div className="discovery-header-row">
                <span className="discovery-area-tag">{activeInspectionFragment.area}</span>
                <span className="discovery-xp-tag">+{activeInspectionFragment.discoveryXP || 25} XP</span>
              </div>

              <h2 className="discovery-monument-title">{activeInspectionFragment.title}</h2>
              <p className="discovery-subtitle-text">{activeInspectionFragment.subtitle}</p>
              <p className="discovery-description-text">{activeInspectionFragment.description}</p>

              {/* Acharya Vikram Context */}
              <div className="guide-dialogue-card">
                <div className="guide-avatar-badge">
                  <img 
                    src="/assets/characters/acharya-vikram-portrait.jpg" 
                    alt="Acharya Vikram" 
                    className="guide-avatar-img-circle"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="guide-speech">
                  <strong>Acharya Vikram:</strong>
                  <p>&ldquo;{activeInspectionFragment.vikramQuote}&rdquo;</p>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ flexDirection: 'column', gap: '0.6rem' }}>
              {activeInspectionFragment.id === 'frag_foundation' && (
                <button
                  className="btn-heritage-primary btn-large-cta pulse-gold"
                  onClick={() => {
                    sound.playChime();
                    setActiveInspectionFragment(null);
                    setShowSunCitadelExplore(true);
                  }}
                  style={{ width: '100%', marginBottom: '0.2rem' }}
                >
                  <Sun size={18} />
                  <span>ENTER SUN CITADEL EXPLORATION</span>
                </button>
              )}

              {activeInspectionFragment.id === 'frag_gates' && (
                <button
                  className="btn-heritage-primary btn-large-cta pulse-gold"
                  onClick={() => {
                    sound.playChime();
                    setActiveInspectionFragment(null);
                    setShowJaiPolExplore(true);
                  }}
                  style={{ width: '100%', marginBottom: '0.2rem' }}
                >
                  <Compass size={18} />
                  <span>ENTER JAI POL EXPLORATION</span>
                </button>
              )}

              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '0.75rem' }}>
                <button 
                  className="btn-heritage-secondary"
                  onClick={() => setActiveInspectionFragment(null)}
                >
                  Close
                </button>

                <button 
                  className="btn-heritage-primary btn-large-cta pulse-gold"
                  onClick={() => handleCollectFragment(activeInspectionFragment)}
                  id="collect-fragment-btn"
                >
                  <Scroll size={18} />
                  <span>COLLECT FRAGMENT ({discoveredIds.includes(activeInspectionFragment.id) ? 'ALREADY SAVED' : 'SAVE TO CODEX'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 11. DEDICATED JAI POL INTERACTIVE EXPLORATION SUB-SCREEN              */}
      {/* ===================================================================== */}
      {showJaiPolExplore && (
        <div 
          className="modal-overlay sheesh-fullscreen-modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Jai Pol Interactive Exploration"
          style={{ zIndex: 120, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ width: '100%', maxWidth: '1240px', height: 'clamp(620px, 88vh, 800px)', padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <JaiPolExploreScreen
              location={location}
              playerStats={playerStats}
              onCompleteJaiPol={handleCompleteJaiPol}
              onReturnToFort={() => setShowJaiPolExplore(false)}
              onOpenCodex={onOpenCodex}
              onClaimExplorationXP={onClaimExplorationXP}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 12. DEDICATED SUN CITADEL INTERACTIVE EXPLORATION SUB-SCREEN           */}
      {/* ===================================================================== */}
      {showSunCitadelExplore && (
        <div 
          className="modal-overlay sheesh-fullscreen-modal-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Sun Citadel Interactive Exploration"
          style={{ zIndex: 120, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ width: '100%', maxWidth: '1240px', height: 'clamp(620px, 88vh, 800px)', padding: '0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <SunCitadelExploreScreen
              location={location}
              playerStats={playerStats}
              onCompleteSunCitadel={handleCompleteSunCitadel}
              onReturnToFort={() => setShowSunCitadelExplore(false)}
              onOpenCodex={onOpenCodex}
              onClaimExplorationXP={onClaimExplorationXP}
            />
          </div>
        </div>
      )}
    </div>
  );
}
