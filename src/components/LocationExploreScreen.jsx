import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Hammer, 
  Award, 
  CheckCircle2, 
  Compass, 
  Camera,
  Droplets,
  Sun,
  HelpCircle,
  X,
  Hand
} from 'lucide-react';
import { sound } from '../data/soundEffects';

/* 
  The 3 Heritage Discovery Clues in the 2D Amer Fort Game World:
  World Coordinates: 2400 x 1600
  - Area 1: Ganesh Pol Gateway (Architectural Craft) -> (x: 460, y: 380)
  - Area 2: Sheesh Mahal Palace (Convex Mirrors & Light) -> (x: 1920, y: 380)
  - Area 3: Maota Lake Waterworks (Rehat Pulley Wheels) -> (x: 1940, y: 1280)
  Player Spawn: Central Courtyard (Jaleb Chowk) -> (x: 1200, y: 880)
*/
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 4.8;
const INTERACTION_RADIUS = 130;

const HERITAGE_CLUES = [
  {
    id: 'discovery_craft',
    title: 'Royal Architecture',
    subtitle: 'Ganesh Pol Gateway & Sandstone Arabesques',
    type: 'craft',
    area: 'North-West Gateway (Ganesh Pol)',
    x: 460,
    y: 380,
    shortTag: 'Royal Architecture',
    description: 'Constructed in 1592 CE under Raja Man Singh I, the Ganesh Pol served as the grand royal gateway. Rajput and Mughal master masons blended carved red sandstone with fine lime plaster, creating intricate floral frescoes with vegetable dyes that have resisted four centuries of weathering.',
    vikramQuote: 'Look closely. Heritage is not only about grand monuments. The smallest details can reveal how ancient masters lived and built. Notice how organic vegetable dyes remain vibrant after 400 years.',
    discoveryXP: 25
  },
  {
    id: 'discovery_mirror',
    title: 'Sheesh Mahal',
    subtitle: 'Convex Mirror Pavilion & Optical Science',
    type: 'mirror',
    area: 'North-East Pavilion (Sheesh Mahal)',
    x: 1920,
    y: 380,
    shortTag: 'Sheesh Mahal',
    description: 'The celebrated Hall of Mirrors (Sheesh Mahal) is adorned with thousands of concave and convex glass facets imported from Syria and Venice, set inside delicate stucco arabesques. The curved mirrors reflect and multiply light rays repeatedly, illuminating the hall without generating excess heat.',
    vikramQuote: 'You stand before the pinnacle of Rajput luxury and optical physics! By angling convex mirror tesserae into the stucco ceiling, a single candle would illuminate the entire hall like a galaxy of stars.',
    discoveryXP: 25
  },
  {
    id: 'discovery_water',
    title: 'Water Engineering',
    subtitle: 'Maota Lake & 5-Tier Persian Wheel System',
    type: 'water',
    area: 'South-East Ramparts (Maota Lake)',
    x: 1940,
    y: 1280,
    shortTag: 'Water Engineering',
    description: 'Maota Lake served as Amer Fort’s primary defensive moat and life-giving water source. Rajput engineers designed a 5-tier mechanical Persian wheel (Rehat/Araghatta) pulley system powered by bullocks, raising lake water 400 feet up across successive mountain cisterns to supply the royal palace.',
    vikramQuote: 'Observe the ramparts overlooking Maota Lake! In the desert heat, water engineering was survival. Five cascading Persian pulley wheels lifted millions of liters 400 feet up to the royal palaces.',
    discoveryXP: 25
  }
];

export default function LocationExploreScreen({ 
  location, 
  onStartMiniGame, 
  onClaimExplorationXP,
  playerStats, 
  onReturnToMap,
  onOpenCodex
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Preloaded Environment Image Assets
  const bgPanoramaRef = useRef(null);
  const sheeshInteriorRef = useRef(null);

  useEffect(() => {
    // 1. Primary Amer Fort Panoramic Exploration Backdrop
    const imgPanorama = new Image();
    imgPanorama.src = '/assets/monuments/amer-fort/amer-fort-panorama.jpg';
    imgPanorama.onload = () => {
      bgPanoramaRef.current = imgPanorama;
    };

    // 2. Sheesh Mahal Interior Close-Up Photo
    const imgSheesh = new Image();
    imgSheesh.src = '/assets/monuments/amer-fort/sheesh-mahal-interior.jpg';
    imgSheesh.onload = () => {
      sheeshInteriorRef.current = imgSheesh;
    };
  }, []);

  // Exploration Discovered Clues State
  const [discoveredIds, setDiscoveredIds] = useState(() => {
    const isDone = playerStats.completedLocations?.includes(location.id) || playerStats.completedExplorations?.includes(location.id);
    return isDone ? ['discovery_craft', 'discovery_mirror', 'discovery_water'] : [];
  });

  // Active Clue Being Inspected
  const [activeInspectionClue, setActiveInspectionClue] = useState(null);
  const [nearbyClue, setNearbyClue] = useState(null);

  // Quest Floating Feedback Toast Notification
  const [collectionToast, setCollectionToast] = useState(null);

  // Exploration Idle Timer for gentle scholar hints
  const [timeSinceLastClue, setTimeSinceLastClue] = useState(0);

  // Modals / Overlays
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCodexModal, setShowCodexModal] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  // Temporary Controls Hint (Auto-fades after 5s or upon movement)
  const [showControlsHint, setShowControlsHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControlsHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Mobile virtual joystick state
  const joystickTouchRef = useRef(null);
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0, active: false });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Player & Game State Refs (avoid React state thrashing during 60 FPS loop)
  const gameStateRef = useRef({
    player: {
      x: 1200,
      y: 880,
      vx: 0,
      vy: 0,
      facing: 'S', // N, NE, E, SE, S, SW, W, NW
      walkTimer: 0,
      isMoving: false
    },
    camera: {
      x: 1200 - 450,
      y: 880 - 300,
      width: 900,
      height: 600
    },
    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    },
    isPaused: false,
    ambientTick: 0
  });

  const discoveriesCount = discoveredIds.length;
  const isAllDiscovered = discoveriesCount === HERITAGE_CLUES.length;
  const isLocationMastered = playerStats.completedLocations?.includes(location.id);

  // Timer for gentle hints when exploring without finding a clue
  useEffect(() => {
    if (isAllDiscovered) return;
    const interval = setInterval(() => {
      setTimeSinceLastClue((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isAllDiscovered]);

  // Check if touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 900);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const k = e.key;
      const gs = gameStateRef.current;

      if (['w', 'W', 'ArrowUp', 'a', 'A', 'ArrowLeft', 's', 'S', 'ArrowDown', 'd', 'D', 'ArrowRight'].includes(k)) {
        setShowControlsHint(false);
      }

      if (['w', 'W', 'ArrowUp'].includes(k)) { gs.keys.w = true; e.preventDefault(); }
      if (['a', 'A', 'ArrowLeft'].includes(k)) { gs.keys.a = true; e.preventDefault(); }
      if (['s', 'S', 'ArrowDown'].includes(k)) { gs.keys.s = true; e.preventDefault(); }
      if (['d', 'D', 'ArrowRight'].includes(k)) { gs.keys.d = true; e.preventDefault(); }

      // Interact key: 'e', 'E', or Space
      if (['e', 'E', ' '].includes(k)) {
        if (!gs.isPaused && nearbyClue) {
          e.preventDefault();
          sound.playChime();
          setActiveInspectionClue(nearbyClue);
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key;
      const gs = gameStateRef.current;

      if (['w', 'W', 'ArrowUp'].includes(k)) gs.keys.w = false;
      if (['a', 'A', 'ArrowLeft'].includes(k)) gs.keys.a = false;
      if (['s', 'S', 'ArrowDown'].includes(k)) gs.keys.s = false;
      if (['d', 'D', 'ArrowRight'].includes(k)) gs.keys.d = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyClue]);

  // Pause movement when modal or temporary celebration is open
  useEffect(() => {
    gameStateRef.current.isPaused = !!(activeInspectionClue || showHelpModal || showCodexModal || showCompletionOverlay);
  }, [activeInspectionClue, showHelpModal, showCodexModal, showCompletionOverlay]);

  // Collect Clue Action
  const handleCollectClue = (clueId) => {
    sound.playSuccess();
    const clueObj = HERITAGE_CLUES.find((c) => c.id === clueId);
    if (!discoveredIds.includes(clueId)) {
      const nextDiscovered = [...discoveredIds, clueId];
      setDiscoveredIds(nextDiscovered);
      setTimeSinceLastClue(0);

      // Trigger floating feedback toast
      setCollectionToast({
        title: clueObj?.title || 'Heritage Clue',
        xp: clueObj?.discoveryXP || 25
      });
      setTimeout(() => setCollectionToast(null), 2400);

      if (nextDiscovered.length === HERITAGE_CLUES.length) {
        sound.playVictoryFanfare();
        setShowCompletionOverlay(true);
        if (onClaimExplorationXP) {
          onClaimExplorationXP(75);
        }
        // Auto-fade celebration overlay after 2.8 seconds so player can cleanly explore
        setTimeout(() => {
          setShowCompletionOverlay(false);
        }, 2800);
      }
    }
    setActiveInspectionClue(null);
  };

  // Launch Restoration Mini-Game
  const handleStartRestoration = () => {
    sound.playChime();
    onStartMiniGame();
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas viewport to match parent container size
    const updateCanvasDimensions = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        gameStateRef.current.camera.width = rect.width;
        gameStateRef.current.camera.height = rect.height;
      }
    };
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    // Main Game Loop Function
    const renderGame = () => {
      const gs = gameStateRef.current;
      gs.ambientTick += 0.05;

      const player = gs.player;
      const camera = gs.camera;

      // -------------------------------------------------------------
      // 1. UPDATE PLAYER PHYSICS & MOVEMENT (IF NOT PAUSED)
      // -------------------------------------------------------------
      if (!gs.isPaused) {
        let inputX = 0;
        let inputY = 0;

        // Keyboard inputs
        if (gs.keys.w || gs.keys.ArrowUp) inputY -= 1;
        if (gs.keys.s || gs.keys.ArrowDown) inputY += 1;
        if (gs.keys.a || gs.keys.ArrowLeft) inputX -= 1;
        if (gs.keys.d || gs.keys.ArrowRight) inputX += 1;

        // Touch virtual joystick inputs
        if (joystickVector.active) {
          inputX = joystickVector.x;
          inputY = joystickVector.y;
        }

        // Normalize diagonal vector
        const mag = Math.hypot(inputX, inputY);
        if (mag > 0.05) {
          player.isMoving = true;
          const normX = (inputX / (mag > 1 ? mag : 1)) * PLAYER_SPEED;
          const normY = (inputY / (mag > 1 ? mag : 1)) * PLAYER_SPEED;

          player.vx = normX;
          player.vy = normY;
          player.walkTimer += 0.25;

          // Determine facing direction
          const angle = Math.atan2(normY, normX);
          const deg = (angle * 180) / Math.PI;
          if (deg >= -22.5 && deg < 22.5) player.facing = 'E';
          else if (deg >= 22.5 && deg < 67.5) player.facing = 'SE';
          else if (deg >= 67.5 && deg < 112.5) player.facing = 'S';
          else if (deg >= 112.5 && deg < 157.5) player.facing = 'SW';
          else if (deg >= 157.5 || deg < -157.5) player.facing = 'W';
          else if (deg >= -157.5 && deg < -112.5) player.facing = 'NW';
          else if (deg >= -112.5 && deg < -67.5) player.facing = 'N';
          else if (deg >= -67.5 && deg < -22.5) player.facing = 'NE';
        } else {
          player.isMoving = false;
          player.vx *= 0.7;
          player.vy *= 0.7;
        }

        // Apply movement with boundary collision clamping
        player.x = Math.max(140, Math.min(WORLD_WIDTH - 140, player.x + player.vx));
        player.y = Math.max(140, Math.min(WORLD_HEIGHT - 140, player.y + player.vy));

        // Proximity detection to heritage clues
        let closestClue = null;
        let minDist = INTERACTION_RADIUS;

        HERITAGE_CLUES.forEach((clue) => {
          const dist = Math.hypot(player.x - clue.x, player.y - clue.y);
          if (dist < minDist) {
            minDist = dist;
            closestClue = clue;
          }
        });

        setNearbyClue(closestClue);
      }

      // -------------------------------------------------------------
      // 2. SMOOTH CAMERA TRACKING (CENTERED ON PLAYER)
      // -------------------------------------------------------------
      const targetCamX = Math.max(0, Math.min(WORLD_WIDTH - camera.width, player.x - camera.width / 2));
      const targetCamY = Math.max(0, Math.min(WORLD_HEIGHT - camera.height, player.y - camera.height / 2));
      camera.x += (targetCamX - camera.x) * 0.12;
      camera.y += (targetCamY - camera.y) * 0.12;

      // -------------------------------------------------------------
      // 3. CANVAS RENDERING (RICH AMER FORT ENVIRONMENT)
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // --- 3.1 PRIMARY AMER FORT ENVIRONMENTAL BACKDROP ---
      if (bgPanoramaRef.current && bgPanoramaRef.current.complete) {
        // Draw the full high-res Amer Fort photographic landscape across the 2400x1600 world
        ctx.drawImage(bgPanoramaRef.current, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      } else {
        // Warm desert sandstone fallback gradient while loading
        const gradFallback = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        gradFallback.addColorStop(0, '#3a2717');
        gradFallback.addColorStop(0.5, '#452e1b');
        gradFallback.addColorStop(1, '#2b1a10');
        ctx.fillStyle = gradFallback;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      }

      // --- 3.2 ATMOSPHERIC COLOR GRADE & SUNLIGHT VIGNETTE ---
      const envVignette = ctx.createRadialGradient(
        WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 300,
        WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 1300
      );
      envVignette.addColorStop(0, 'rgba(253, 224, 71, 0.04)');
      envVignette.addColorStop(0.5, 'rgba(15, 10, 5, 0.18)');
      envVignette.addColorStop(1, 'rgba(10, 5, 2, 0.5)');
      ctx.fillStyle = envVignette;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // --- 3.3 INTERCONNECTED SANDSTONE COURTYARD PATHWAYS ---
      // Draw royal sandstone paved avenues leading from Central Courtyard (1200, 880) to the 3 discovery zones
      const drawPavedPath = (startX, startY, endX, endY, width = 64) => {
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 169, 109, 0.32)';
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Golden Trim Inlay Lines along pathway borders
        ctx.strokeStyle = 'rgba(230, 179, 37, 0.45)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      };

      // Path 1: Central Courtyard -> Ganesh Pol Gateway (North-West)
      drawPavedPath(1200, 880, 460, 380, 72);
      // Path 2: Central Courtyard -> Sheesh Mahal Mirror Palace (North-East)
      drawPavedPath(1200, 880, 1920, 380, 72);
      // Path 3: Central Courtyard -> Maota Lake Waterworks (South-East)
      drawPavedPath(1200, 880, 1940, 1280, 72);

      // Central Courtyard (Jaleb Chowk) Sandstone Plaza
      ctx.save();
      ctx.fillStyle = 'rgba(44, 30, 20, 0.55)';
      ctx.fillRect(940, 660, 520, 440);
      ctx.strokeStyle = 'rgba(230, 179, 37, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(940, 660, 520, 440);

      // Geometric Floor Tile Grid inside Plaza
      ctx.strokeStyle = 'rgba(230, 179, 37, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 940; x <= 1460; x += 65) {
        ctx.beginPath();
        ctx.moveTo(x, 660);
        ctx.lineTo(x, 1100);
        ctx.stroke();
      }
      for (let y = 660; y <= 1100; y += 55) {
        ctx.beginPath();
        ctx.moveTo(940, y);
        ctx.lineTo(1460, y);
        ctx.stroke();
      }

      // Central Royal Fountain & Star Plinth (1200, 880)
      const fountainX = 1200;
      const fountainY = 880;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.arc(fountainX, fountainY, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e6b325';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Water Ripple inside Central Basin
      const fRipple = (gs.ambientTick * 12) % 35;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fountainX, fountainY, 20 + fRipple, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // --- 3.4 OUTER SANDSTONE FORTRESS WALLS & CORNER BASTIONS ---
      ctx.save();
      ctx.strokeStyle = 'rgba(194, 89, 63, 0.85)';
      ctx.lineWidth = 18;
      ctx.strokeRect(50, 50, WORLD_WIDTH - 100, WORLD_HEIGHT - 100);

      ctx.strokeStyle = '#e6b325';
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, WORLD_WIDTH - 120, WORLD_HEIGHT - 120);

      // Corner Watchtower Chhatris
      const cornerPositions = [
        [60, 60],
        [WORLD_WIDTH - 60, 60],
        [60, WORLD_HEIGHT - 60],
        [WORLD_WIDTH - 60, WORLD_HEIGHT - 60]
      ];
      cornerPositions.forEach(([cx, cy]) => {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e6b325';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
      ctx.restore();

      // --- 3.5 ZONED ARCHITECTURAL HIGHLIGHTS & PAVILIONS ---

      // [ZONE 1: GANESH POL GATEWAY - ARCHITECTURAL CRAFT (x: 460, y: 380)]
      ctx.save();
      ctx.fillStyle = 'rgba(180, 83, 9, 0.35)';
      ctx.fillRect(260, 210, 400, 340);
      ctx.strokeStyle = 'rgba(230, 179, 37, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(260, 210, 400, 340);

      // Gateway Carved Arch Plinth
      ctx.beginPath();
      ctx.arc(460, 380, 85, Math.PI, 0);
      ctx.fillStyle = 'rgba(230, 179, 37, 0.2)';
      ctx.fill();
      ctx.stroke();

      // Gateway Torches / Lantern Halos
      [310, 610].forEach((tx) => {
        const torchPulse = Math.sin(gs.ambientTick * 3 + tx) * 4;
        ctx.fillStyle = 'rgba(253, 224, 71, 0.4)';
        ctx.beginPath();
        ctx.arc(tx, 310, 18 + torchPulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // [ZONE 2: SHEESH MAHAL PALACE OF MIRRORS (x: 1920, y: 380)]
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(1720, 210, 400, 340);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1720, 210, 400, 340);

      // Shimmering Optical Star Rays & Mirror Tesserae
      for (let i = 0; i < 6; i++) {
        const rayAngle = (gs.ambientTick * 0.8 + (i * Math.PI) / 3);
        const rayLen = 70 + Math.sin(gs.ambientTick * 2 + i) * 15;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(1920, 380);
        ctx.lineTo(1920 + Math.cos(rayAngle) * rayLen, 380 + Math.sin(rayAngle) * rayLen);
        ctx.stroke();
      }

      // Mirror Pavilion Marble Pillar Points
      for (let mx = 1760; mx <= 2080; mx += 80) {
        for (let my = 250; my <= 510; my += 130) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(mx, my, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // [ZONE 3: MAOTA LAKE & REHAT WATERWORKS (x: 1940, y: 1280)]
      ctx.save();
      ctx.fillStyle = 'rgba(14, 116, 144, 0.4)';
      ctx.fillRect(1740, 1100, 400, 340);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1740, 1100, 400, 340);

      // Animated Water Ripples on Maota Lake
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
      for (let i = 0; i < 3; i++) {
        const rippleOffset = (gs.ambientTick * 14 + i * 45) % 120;
        ctx.beginPath();
        ctx.ellipse(1940, 1280, 50 + rippleOffset, 25 + rippleOffset * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // --- 3.6 RENDER THE 3 HERITAGE CLUE BEACONS ---
      HERITAGE_CLUES.forEach((clue) => {
        const isFound = discoveredIds.includes(clue.id);
        const isNearby = nearbyClue?.id === clue.id;
        const pulse = Math.sin(gs.ambientTick * 2) * 6;

        // Ground Aura Halo
        const glowColor = isFound 
          ? 'rgba(16, 185, 129, 0.45)' 
          : clue.type === 'mirror' 
            ? 'rgba(56, 189, 248, 0.55)' 
            : 'rgba(230, 179, 37, 0.55)';

        ctx.beginPath();
        ctx.arc(clue.x, clue.y, (isNearby ? 48 : 36) + pulse, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();

        // Clue Pedestal Base
        ctx.beginPath();
        ctx.arc(clue.x, clue.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = isFound ? '#10b981' : clue.type === 'mirror' ? '#38bdf8' : '#e6b325';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Clue Center Icon Emblem
        ctx.fillStyle = isFound ? '#10b981' : '#fde047';
        ctx.font = 'bold 16px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isFound ? '✓' : '✦', clue.x, clue.y + 1);

        // Hover / Proximity Prompt
        if (isNearby && !gs.isPaused) {
          ctx.fillStyle = 'rgba(10, 14, 24, 0.95)';
          ctx.strokeStyle = '#e6b325';
          ctx.lineWidth = 1.5;
          const promptW = 190;
          const promptH = 34;
          const promptX = clue.x - promptW / 2;
          const promptY = clue.y - 68;

          ctx.beginPath();
          ctx.roundRect(promptX, promptY, promptW, promptH, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(isTouchDevice ? 'Tap INTERACT below' : '[E] Investigate Clue', clue.x, promptY + 17);
        }
      });

      // --- 3.7 RENDER PLAYER CHARACTER (HIGH CONTRAST OVER AMER FORT) ---
      const px = player.x;
      const py = player.y;
      const walkBob = player.isMoving ? Math.sin(player.walkTimer * 3) * 2.5 : 0;

      // Dark Ground Drop Shadow for High Contrast
      ctx.beginPath();
      ctx.ellipse(px, py + 14, 20, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fill();

      // Explorer Lantern Field of View Light (Illuminates the fort environment around player)
      const lightGrad = ctx.createRadialGradient(px, py, 15, px, py, 160);
      lightGrad.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
      lightGrad.addColorStop(0.6, 'rgba(253, 224, 71, 0.12)');
      lightGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(px, py, 160, 0, Math.PI * 2);
      ctx.fill();

      // Player Body (Sandstone/Safari Vest + Royal Saffron Pagri Turban)
      // Body Coat with Dark Outline
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(px, py - 6 + walkBob, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vest Belt & Leather Strap
      ctx.fillStyle = '#c2593f';
      ctx.fillRect(px - 10, py - 4 + walkBob, 20, 5);

      // Head & Skin Tone
      ctx.fillStyle = '#e0a96d';
      ctx.beginPath();
      ctx.arc(px, py - 24 + walkBob, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Saffron Explorer Pagri Turban
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py - 27 + walkBob, 12, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Facing Direction Arrow / Compass Point
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      const faceAngle = Math.atan2(
        player.vy || (player.facing.includes('S') ? 1 : player.facing.includes('N') ? -1 : 0), 
        player.vx || (player.facing.includes('E') ? 1 : player.facing.includes('W') ? -1 : 0)
      );
      const arrowDist = 22;
      ctx.arc(px + Math.cos(faceAngle) * arrowDist, py + Math.sin(faceAngle) * arrowDist + walkBob, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(renderGame);
    };

    animationFrameId = requestAnimationFrame(renderGame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [discoveredIds, nearbyClue, joystickVector, isTouchDevice]);

  // Touch Virtual Joystick Handlers
  const handleJoystickTouchStart = (e) => {
    e.preventDefault();
    if (showControlsHint) setShowControlsHint(false);
    const touch = e.touches[0];
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

    setJoystickVector({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchMove = (e) => {
    if (!joystickTouchRef.current) return;
    if (showControlsHint) setShowControlsHint(false);
    const touch = e.touches[0];
    const { centerX, centerY, radius } = joystickTouchRef.current;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const normX = dx / (dist > radius ? dist : radius);
    const normY = dy / (dist > radius ? dist : radius);

    setJoystickVector({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchEnd = () => {
    joystickTouchRef.current = null;
    setJoystickVector({ x: 0, y: 0, active: false });
  };

  // Get Dynamic Guide Dialogue from Acharya Vikram
  const getGuideSpeech = () => {
    if (isAllDiscovered) {
      return '“Splendidly done, Explorer! All three heritage clues have been recovered. You are now prepared to restore the lost architectural pattern!”';
    }
    if (nearbyClue) {
      return `“You are near the ${nearbyClue.title}! Press E or tap Interact to inspect its secrets.”`;
    }
    if (timeSinceLastClue > 18) {
      return '“I sense another story waiting to be uncovered nearby. Look closely at the gateways, courtyards, and ramparts.”';
    }
    return '“Welcome to Amer Fort! Explore the site, uncover the 3 lost clues, and restore the damaged heritage artifact.”';
  };

  return (
    <div className="location-explore-screen amer-explore-screen">
      {/* ===================================================================== */}
      {/* 1. TOP EXPLORATION HUD                                                */}
      {/* ===================================================================== */}
      <header className="location-top-hud">
        {/* Left Monument Identity */}
        <div className="hud-monument-badge-group">
          <div className="hud-monument-avatar">
            <Compass size={22} className="text-gold" />
          </div>
          <div className="hud-monument-titles">
            <span className="hud-state-label">RAJASTHAN &bull; {location.region}</span>
            <h1 className="hud-monument-name">{location.name}</h1>
            <span className="hud-era-tag">{location.era}</span>
            {isLocationMastered && (
              <span className="hud-mastered-chip">
                <CheckCircle2 size={13} />
                <span>Mastered</span>
              </span>
            )}
          </div>
        </div>

        {/* Center Quest Mission Pill */}
        <div className={`hud-center-mission-pill quest-hud-card ${isAllDiscovered ? 'quest-completed-pill' : ''}`}>
          <div className="mission-title-row">
            {isAllDiscovered ? (
              <>
                <CheckCircle2 size={14} className="text-emerald" />
                <span className="mission-label text-emerald">✓ FIRST QUEST COMPLETE</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-gold" />
                <span className="mission-label">FIRST QUEST &bull; RESTORE THE HERITAGE</span>
              </>
            )}
          </div>
          <div className="mission-progress-bar-wrap">
            <div 
              className="mission-progress-bar-fill" 
              style={{ 
                width: `${(discoveriesCount / 3) * 100}%`,
                background: isAllDiscovered ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : undefined,
                boxShadow: isAllDiscovered ? '0 0 8px rgba(16, 185, 129, 0.8)' : undefined
              }}
            ></div>
          </div>
          <div className="mission-clues-counter">
            <span>{isAllDiscovered ? 'All 3 clues recovered • Ready for restoration' : 'Explore the site and restore the damaged artifact.'} &bull; <strong className={isAllDiscovered ? 'text-emerald' : 'text-gold'}>CLUES: {discoveriesCount} / 3</strong></span>
          </div>
        </div>

        {/* Right Stats & Nav Actions */}
        <div className="hud-right-stats-group">
          <div className="hud-player-stats-chip">
            <span className="stat-pill-item" title="Lore Points">
              <Sparkles size={13} className="text-gold" />
              <strong>{playerStats.xp} XP</strong>
            </span>
            <span className="stat-pill-item" title="Unlocked Relics">
              <Award size={13} className="text-gold" />
              <strong>{playerStats.unlockedRelics.length}/4 Relics</strong>
            </span>
          </div>

          {/* Unobtrusive Restoration Unlocked CTA in HUD */}
          {isAllDiscovered && (
            <button 
              className="btn-hud-round-action btn-restoration-unlocked-cta pulse-gold"
              onClick={handleStartRestoration}
              title="Restoration Unlocked: Reconstruct Lost Architecture"
              id="hud-restoration-unlocked-btn"
            >
              <Hammer size={16} className="text-gold" />
              <span className="restoration-btn-label">RESTORATION UNLOCKED</span>
            </button>
          )}

          <button 
            className="btn-hud-round-action"
            onClick={() => {
              sound.playClick();
              setShowHelpModal(true);
            }}
            title="Controls & Quest Guide"
          >
            <HelpCircle size={17} />
          </button>

          <button 
            className="btn-hud-round-action btn-return-map-chip"
            onClick={() => {
              sound.playClick();
              onReturnToMap();
            }}
            title="Return to Rajasthan Map"
          >
            <Compass size={17} />
            <span className="map-btn-text">Map</span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. 2D EXPLORATION VIEWPORT CANVAS WITH FOLLOW CAMERA                  */}
      {/* ===================================================================== */}
      <div className="game-viewport-2d-frame" ref={containerRef}>
        {/* Canvas Engine */}
        <canvas ref={canvasRef} className="game-canvas-2d" />

        {/* Ambient Vignette & Golden Filigree Frame */}
        <div className="viewport-overlay-vignette"></div>
        <div className="viewport-corner tl"></div>
        <div className="viewport-corner tr"></div>
        <div className="viewport-corner bl"></div>
        <div className="viewport-corner br"></div>

        {/* Floating Collection Feedback Toast */}
        {collectionToast && (
          <div className="quest-collection-floating-toast" role="status" aria-live="polite">
            <div className="toast-crest-icon">
              <Sparkles size={20} className="text-gold" />
            </div>
            <div className="toast-text-wrap">
              <span className="toast-headline">CLUE RECOVERED!</span>
              <strong className="toast-clue-title">{collectionToast.title}</strong>
            </div>
            <div className="toast-xp-pill">+{collectionToast.xp} XP</div>
          </div>
        )}

        {/* Top-Right Radar Mini-Map & Clues Tracker */}
        <div className="viewport-radar-minimap-card">
          <div className="radar-minimap-header">
            <div className="radar-header-left">
              <Compass size={12} className="text-gold" />
              <span>MINI-MAP</span>
            </div>
            <span className="radar-clues-badge">CLUES: {discoveriesCount}/3</span>
          </div>

          <div className="radar-map-display">
            <svg viewBox="0 0 240 160" className="radar-svg-map">
              {/* Fort perimeter boundary */}
              <rect x="6" y="6" width="228" height="148" fill="rgba(24, 16, 12, 0.85)" stroke="#c2593f" strokeWidth="2" rx="3" />
              <rect x="9" y="9" width="222" height="142" fill="none" stroke="rgba(230, 179, 37, 0.35)" strokeWidth="1" />
              
              {/* Paved pathway vectors */}
              <line x1="120" y1="88" x2="46" y2="38" stroke="rgba(230, 179, 37, 0.4)" strokeWidth="3" />
              <line x1="120" y1="88" x2="192" y2="38" stroke="rgba(230, 179, 37, 0.4)" strokeWidth="3" />
              <line x1="120" y1="88" x2="194" y2="128" stroke="rgba(230, 179, 37, 0.4)" strokeWidth="3" />
              
              {/* Central Courtyard Plaza & Fountain */}
              <rect x="94" y="66" width="52" height="44" fill="rgba(44, 30, 20, 0.9)" stroke="rgba(230, 179, 37, 0.6)" strokeWidth="1" />
              <circle cx="120" cy="88" r="4" fill="#38bdf8" />

              {/* Discovered Clues Checkmarks (Undiscovered clues stay hidden!) */}
              {discoveredIds.includes('discovery_craft') && (
                <circle cx="46" cy="38" r="5" fill="#10b981" stroke="#fff" strokeWidth="1" />
              )}
              {discoveredIds.includes('discovery_mirror') && (
                <circle cx="192" cy="38" r="5" fill="#10b981" stroke="#fff" strokeWidth="1" />
              )}
              {discoveredIds.includes('discovery_water') && (
                <circle cx="194" cy="128" r="5" fill="#10b981" stroke="#fff" strokeWidth="1" />
              )}
            </svg>
          </div>

          <div className="radar-checklist-list">
            {HERITAGE_CLUES.map((clue) => {
              const isFound = discoveredIds.includes(clue.id);
              return (
                <div key={clue.id} className={`radar-checklist-item ${isFound ? 'found' : 'hidden'}`}>
                  <span className="radar-check-dot">{isFound ? '✓' : '•'}</span>
                  <span className="radar-clue-name">{clue.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls Overlay Helper Hint (Temporary hint that fades out) */}
        {showControlsHint && (
          <div className="temporary-controls-hint-card animate-fade-in" role="status">
            <div className="controls-hint-column desktop-hint-view">
              <div className="hint-row">
                <span className="hint-key-cap">WASD / ARROW KEYS</span>
                <span className="hint-action-text">Move</span>
              </div>
              <div className="hint-row">
                <span className="hint-key-cap">E</span>
                <span className="hint-action-text">Interact</span>
              </div>
            </div>

            <div className="controls-hint-column mobile-hint-view">
              <div className="hint-row">
                <span className="hint-key-cap">JOYSTICK</span>
                <span className="hint-action-text">Move</span>
              </div>
              <div className="hint-row">
                <span className="hint-key-cap">INTERACT</span>
                <span className="hint-action-text">Interact</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Virtual Joystick (Lower-Left) */}
        <div 
          className="virtual-joystick-touchzone"
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
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
            className={`btn-mobile-action-interact ${nearbyClue ? 'interact-active pulse-gold' : 'interact-idle'}`}
            onClick={() => {
              if (nearbyClue) {
                sound.playChime();
                setActiveInspectionClue(nearbyClue);
              }
            }}
            disabled={!nearbyClue}
            aria-label="Interact Button"
          >
            <Hand size={22} />
            <span>INTERACT</span>
          </button>
        </div>

        {/* Docked Guide Bar (Acharya Vikram) */}
        <div className="docked-companion-guide-bar">
          <div className="guide-portrait-frame">
            <img 
              src="/assets/characters/acharya-vikram-portrait.jpg" 
              alt="Acharya Vikram" 
              className="guide-portrait-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="guide-speech-block">
            <div className="guide-title-strip">
              <strong>Acharya Vikram</strong>
              <span className="guide-role-tag">Heritage Guide</span>
            </div>
            <p className="guide-speech-text">
              {getGuideSpeech()}
            </p>
          </div>

          {/* Quick Guide Actions */}
          <div className="guide-bar-actions">
            <button 
              className="btn-heritage-secondary btn-sm"
              onClick={() => {
                sound.playClick();
                if (onOpenCodex) onOpenCodex();
              }}
              title="Open Heritage Codex Journal"
            >
              <BookOpen size={14} />
              <span>Codex</span>
            </button>

            {isAllDiscovered && (
              <button 
                className="btn-heritage-primary btn-sm pulse-gold"
                onClick={handleStartRestoration}
              >
                <Hammer size={14} />
                <span>RESTORE</span>
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. TEMPORARY QUEST COMPLETE CELEBRATION TOAST OVERLAY (FADES OUT)   */}
        {/* =================================================================== */}
        {showCompletionOverlay && (
          <div className="walk-all-clues-discovered-banner quest-celebration-toast-overlay" role="region" aria-label="Quest Complete">
            <div className="banner-left-trophy">
              <div className="trophy-crest-circle">
                <Award size={28} className="text-gold" />
              </div>
              <div className="banner-text-block">
                <span className="banner-tag-badge">✓ QUEST COMPLETE</span>
                <h3 className="banner-main-title">THE LOST HERITAGE CLUES</h3>
                <p className="banner-subtext">
                  All 3 clues recovered &bull; <strong className="text-gold">+75 Exploration XP Awarded</strong>
                </p>
              </div>
            </div>

            <div className="banner-right-cta">
              <button
                className="btn-heritage-primary btn-sm pulse-gold"
                onClick={handleStartRestoration}
              >
                <Hammer size={16} />
                <span>START RESTORATION</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 4. DISCOVERY INSPECTION MODAL (WHEN A CLUE IS INVESTIGATED)           */}
      {/* ===================================================================== */}
      {activeInspectionClue && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Investigation: ${activeInspectionClue.title}`}>
          <div className="compact-inspection-modal-card">
            <div className="inspection-modal-header">
              <div className="inspection-badge-pill">
                <Sparkles size={14} className="text-gold" />
                <span>DISCOVERY FOUND &bull; {activeInspectionClue.shortTag}</span>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setActiveInspectionClue(null)}
                aria-label="Close Inspection"
              >
                <X size={18} />
              </button>
            </div>

            <div className="inspection-content-body">
              {/* Featured Close-Up Photograph */}
              <div className="inspection-featured-photo-frame">
                <img 
                  src={
                    activeInspectionClue.type === 'mirror'
                      ? '/assets/monuments/amer-fort/sheesh-mahal-interior.jpg'
                      : '/assets/monuments/amer-fort/amer-fort-panorama.jpg'
                  } 
                  alt={activeInspectionClue.title} 
                  className="inspection-featured-photo"
                  style={{
                    objectPosition: 
                      activeInspectionClue.type === 'mirror'
                        ? 'center center'
                        : activeInspectionClue.type === 'craft'
                          ? '22% 35%'
                          : '80% 75%'
                  }}
                />
                <div className="photo-caption-bar">
                  <div className="photo-caption-left">
                    <Camera size={13} className={activeInspectionClue.type === 'mirror' ? 'text-sky' : activeInspectionClue.type === 'craft' ? 'text-gold' : 'text-teal'} />
                    <span>
                      {activeInspectionClue.type === 'mirror' 
                        ? 'Sheesh Mahal Interior (Hall of Mirrors)' 
                        : activeInspectionClue.type === 'craft'
                          ? 'Ganesh Pol Gateway & Carved Sandstone'
                          : 'Maota Lake & Ramparts Waterworks'}
                    </span>
                  </div>
                  <span className="photo-verified-tag">Amer Fort Archives</span>
                </div>
              </div>

              <div className="inspection-spotlight-row">
                <div className={`spotlight-icon-circle icon-${activeInspectionClue.type}`}>
                  {activeInspectionClue.type === 'craft' && <Hammer size={32} className="text-gold" />}
                  {activeInspectionClue.type === 'mirror' && <Sun size={32} className="text-sky" />}
                  {activeInspectionClue.type === 'water' && <Droplets size={32} className="text-teal" />}
                </div>

                <div className="inspection-titles-block">
                  <span className="inspection-pretitle">{activeInspectionClue.area}</span>
                  <h3 className="inspection-main-title">{activeInspectionClue.title}</h3>
                </div>
              </div>

              <div className="inspection-lore-box">
                <p>{activeInspectionClue.description}</p>
              </div>

              {/* Spoken Quote from Acharya Vikram */}
              <div className="vikram-spoken-card">
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="vikram-mini-avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="vikram-quote-wrap">
                  <strong>Acharya Vikram explains:</strong>
                  <p>&ldquo;{activeInspectionClue.vikramQuote}&rdquo;</p>
                </div>
              </div>
            </div>

            <div className="inspection-modal-actions">
              <button
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => handleCollectClue(activeInspectionClue.id)}
                id="collect-2d-clue-btn"
              >
                {discoveredIds.includes(activeInspectionClue.id) ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>CLUE FOUND &bull; CONTINUE EXPLORING</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>COLLECT CLUE (+{activeInspectionClue.discoveryXP} XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. QUICK HELP / CONTROLS MODAL                                       */}
      {/* ===================================================================== */}
      {showHelpModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Controls & Guide">
          <div className="compact-inspection-modal-card">
            <div className="inspection-modal-header">
              <div className="inspection-badge-pill">
                <HelpCircle size={14} className="text-gold" />
                <span>How to Play &bull; 2D Heritage Walk</span>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="inspection-content-body">
              <div className="help-step-row">
                <div className="help-step-num">1</div>
                <div>
                  <strong>Move the Explorer:</strong>
                  <p className="text-secondary text-sm">Use <strong className="text-gold">W, A, S, D</strong> or <strong className="text-gold">Arrow Keys</strong> to move in 360 degrees. On mobile/tablet, drag the virtual joystick.</p>
                </div>
              </div>

              <div className="help-step-row">
                <div className="help-step-num">2</div>
                <div>
                  <strong>Investigate Heritage Clues:</strong>
                  <p className="text-secondary text-sm">Walk close to the 3 glowing beacons (Ganesh Pol, Sheesh Mahal, Maota Lake) and press <strong className="text-gold">E</strong> or tap <strong className="text-gold">INTERACT</strong> to inspect clues.</p>
                </div>
              </div>

              <div className="help-step-row">
                <div className="help-step-num">3</div>
                <div>
                  <strong>Restore the Heritage:</strong>
                  <p className="text-secondary text-sm">Collect all 3 clues to earn +75 XP and unlock the architectural restoration puzzle!</p>
                </div>
              </div>
            </div>

            <div className="inspection-modal-actions">
              <button
                className="btn-heritage-primary"
                onClick={() => setShowHelpModal(false)}
              >
                <span>Back to Heritage Walk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. CODEX ARCHIVE MODAL                                               */}
      {/* ===================================================================== */}
      {showCodexModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Codex Archive">
          <div className="codex-drawer-card">
            <div className="inspection-modal-header">
              <div className="inspection-badge-pill">
                <BookOpen size={14} className="text-gold" />
                <span>Amer Fort Architectural Archive</span>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setShowCodexModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="highlights-grid" style={{ margin: '1rem 0' }}>
              {location.highlights?.map((item, idx) => (
                <div key={idx} className="highlight-card">
                  <div className="highlight-card-header">
                    <span className="feat-num">0{idx + 1}</span>
                    <h4>{item.title}</h4>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>

            <div className="inspection-modal-actions">
              <button
                className="btn-heritage-primary"
                onClick={() => setShowCodexModal(false)}
              >
                <span>Close Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
