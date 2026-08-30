import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Award, 
  Shield,
  X,
  Hand,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';
import { sound } from '../data/soundEffects';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 4.8;
const INTERACTION_RADIUS = 130;

export default function ChittorgarhExploreScreen({
  _location,
  onClaimExplorationXP,
  onCompleteChapter,
  _playerStats,
  _onReturnToMap,
  onOpenCodex
}) {
  // Canvas & Audio References
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioRef = useRef(null);

  // Audio State
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  // Quest & Challenges State
  const [completedChallengeIds, setCompletedChallengeIds] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [consequenceFeedback, setConsequenceFeedback] = useState(null); // null | { isBest, title, text, insight }
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Intro Modal State
  const [showIntroModal, setShowIntroModal] = useState(true);

  // Player Physics & Camera State
  const playerRef = useRef({
    x: 1200,
    y: 850,
    vx: 0,
    vy: 0,
    angle: 0,
    isMoving: false,
    stepCount: 0
  });

  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false
  });

  const joystickActive = useRef(false);
  const joystickVector = useRef({ x: 0, y: 0 });

  // 3 Preservation Challenges Data
  const challengePoints = useRef([
    {
      id: 'challenge_weathering',
      order: 1,
      title: 'Weathered Architecture',
      subtitle: 'Vijay Stambha Carvings & Natural Weathering',
      area: 'Tower of Victory (Vijay Stambha)',
      x: 550,
      y: 450,
      scenario: 'Ancient 15th-century sculptures and ornamental friezes on the exterior of Vijay Stambha are exposed to harsh monsoon rains, thermal expansion, and frequent physical visitor contact. How should these fragile surfaces be protected?',
      options: [
        {
          id: 'A',
          text: 'Install gentle protective perimeter barriers with clear viewing sightlines and informative tactile replicas nearby.',
          isBest: true,
          consequenceTitle: 'EXEMPLARY PRESERVATION DECISION',
          consequenceText: 'Reducing direct contact shields delicate 500-year-old stone carvings from natural oils and abrasion, while tactile replicas keep the site fully inclusive, accessible, and educational for all visitors.',
          vikramInsight: 'Conservation succeeds when we protect the original monument while keeping its knowledge alive and accessible.'
        },
        {
          id: 'B',
          text: 'Allow unrestricted touching and rubbing by all visitors for a hands-on tactile experience.',
          isBest: false,
          consequenceTitle: 'CONSERVATION HAZARD',
          consequenceText: 'Unrestricted touch rapidly wears away intricate chisel marks and transfers acidic skin oils that cause stone flaking and micro-fissures over time.',
          vikramInsight: 'Hands-on engagement is great, but delicate centuries-old stone cannot endure continuous physical abrasion.'
        },
        {
          id: 'C',
          text: 'Cover the entire tower permanently in opaque solid metal siding.',
          isBest: false,
          consequenceTitle: 'IMPAIRED HERITAGE ACCESS',
          consequenceText: 'Enclosing the monument in solid casing completely prevents visual appreciation, traps damaging condensation inside, and disfigures historical architecture.',
          vikramInsight: 'Preservation should never obliterate the visual beauty and educational value of the site itself.'
        }
      ],
      discoveryXP: 50
    },
    {
      id: 'challenge_crowding',
      order: 2,
      title: 'Visitor Impact',
      subtitle: 'Gateway Foot Traffic & Rampart Conservation',
      area: 'Ram Pol Gateway & Main Ramparts',
      x: 1850,
      y: 420,
      scenario: 'High visitor density during peak holiday seasons causes congestion along narrow medieval stairwells, creating physical foot-traffic friction and destabilizing unpaved rampart slopes. How should visitor flow be managed?',
      options: [
        {
          id: 'A',
          text: 'Design designated one-way walking pathways, clear interpretive signage, and timed visitor group entry.',
          isBest: true,
          consequenceTitle: 'BALANCED VISITOR FLOW RESTORED',
          consequenceText: 'Timed group dispersal and designated walking routes prevent bottleneck congestion and wear on ancient staircases, offering every visitor a safe, dignified, and serene educational journey.',
          vikramInsight: 'When visitors move along guided heritage trails, the monument breathes and stays protected for generations.'
        },
        {
          id: 'B',
          text: 'Allow visitors to freely climb across unpaved earthen slopes and fragile parapet ruins.',
          isBest: false,
          consequenceTitle: 'EROSION & INSTABILITY RISK',
          consequenceText: 'Unregulated climbing across unpaved slopes causes severe soil erosion and destabilizes ancient stone foundation footings during monsoon rains.',
          vikramInsight: 'Unmarked shortcuts degrade slope stability and put both the ruins and visitors at risk.'
        },
        {
          id: 'C',
          text: 'Barricade the entire fort and permanently close the site to the public.',
          isBest: false,
          consequenceTitle: 'LOSS OF LIVING CONNECTION',
          consequenceText: 'Shutting down public access permanently disconnects communities from their own cultural heritage and halts public education.',
          vikramInsight: 'A monument locked away loses its living voice. Heritage lives through responsible public stewardship.'
        }
      ],
      discoveryXP: 50
    },
    {
      id: 'challenge_water',
      order: 3,
      title: 'Water Heritage',
      subtitle: 'Gaumukh Kund Spring Reservoir Conservation',
      area: 'Gaumukh Kund Natural Spring',
      x: 1750,
      y: 1200,
      scenario: 'The historic Gaumukh Kund subterranean natural spring and its carved stone runoff channels face seasonal silt accumulation and surface debris. How should this ancient hydraulic engineering system be conserved?',
      options: [
        {
          id: 'A',
          text: 'Clean stone channels gently using eco-friendly heritage techniques and engage visitors in keeping water bodies pristine.',
          isBest: true,
          consequenceTitle: 'SUSTAINABLE WATER HERITAGE PRESERVED',
          consequenceText: 'Gentle periodic maintenance preserves medieval masonry joints and restores the natural spring flow, demonstrating how ancient Rajput water engineering enabled centuries of hilltop self-sufficiency.',
          vikramInsight: 'Traditional water systems are marvels of ecological engineering. Preserving Gaumukh Kund honors Mewar’s water wisdom.'
        },
        {
          id: 'B',
          text: 'Drain the spring completely and replace the stone channels with modern PVC plastic pipes.',
          isBest: false,
          consequenceTitle: 'DESTRUCTION OF HISTORIC HYDRAULICS',
          consequenceText: 'Replacing authentic hand-carved stone reservoirs with plastic piping permanently destroys irreplaceable medieval engineering heritage.',
          vikramInsight: 'Modern materials should not destroy historical craftsmanship when traditional restorative methods are available.'
        },
        {
          id: 'C',
          text: 'Leave the reservoir unmaintained without any cleaning or community guidance.',
          isBest: false,
          consequenceTitle: 'SILTATION & BIOLOGICAL DECAY',
          consequenceText: 'Neglecting natural springs leads to heavy silt build-up, unchecked root intrusion, and structural cracking of centuries-old retaining walls.',
          vikramInsight: 'Water bodies require proactive care. Inaction leads to irreversible structural collapse.'
        }
      ],
      discoveryXP: 50
    }
  ]);

  const [nearbyChallenge, setNearbyChallenge] = useState(null);

  // Dynamic Acharya Vikram Voice Line
  const [guideSpeech, setGuideSpeech] = useState(
    'Welcome to Chittorgarh, Explorer. Explore the monumental hill-fort and help resolve the 3 preservation challenges.'
  );

  // Audio Toggle
  const toggleAmbientSound = () => {
    sound.playClick();
    if (!audioRef.current) return;
    if (ambientPlaying) {
      audioRef.current.pause();
      setAmbientPlaying(false);
    } else {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
      setAmbientPlaying(true);
    }
  };

  // Open Challenge Modal
  const handleInspectChallenge = useCallback((challenge) => {
    sound.playInspect();
    setActiveChallenge(challenge);
    setSelectedOptionId(null);
    setConsequenceFeedback(null);
    setGuideSpeech(`“${challenge.scenario}”`);
  }, []);

  // Submit Preservation Decision
  const handleSelectOption = (option) => {
    sound.playClick();
    setSelectedOptionId(option.id);

    if (option.isBest) {
      sound.playFanfare();
      setConsequenceFeedback({
        isBest: true,
        title: option.consequenceTitle,
        text: option.consequenceText,
        insight: option.vikramInsight
      });

      // Mark challenge completed if not already
      if (!completedChallengeIds.includes(activeChallenge.id)) {
        const updated = [...completedChallengeIds, activeChallenge.id];
        setCompletedChallengeIds(updated);
        if (onClaimExplorationXP) {
          onClaimExplorationXP(activeChallenge.discoveryXP || 50);
        }

        // If all 3 completed
        if (updated.length === 3) {
          setGuideSpeech(
            'Incredible leadership, Explorer! You have solved all 3 preservation challenges. Click "FINISH PRESERVATION" to complete your Rajasthan quest!'
          );
        }
      }
    } else {
      sound.playError();
      setConsequenceFeedback({
        isBest: false,
        title: option.consequenceTitle,
        text: option.consequenceText,
        insight: option.vikramInsight
      });
    }
  };

  const handleCloseChallengeModal = () => {
    setActiveChallenge(null);
    setSelectedOptionId(null);
    setConsequenceFeedback(null);

    if (completedChallengeIds.length === 3) {
      setShowCelebrationModal(true);
    }
  };

  const handleClaimFinalRelicAndFinish = () => {
    sound.playFanfare();
    if (onCompleteChapter) {
      onCompleteChapter({
        xpAward: 250,
        relicAward: {
          id: 'relic_chittorgarh_crest',
          name: 'Guardian of Chittorgarh',
          tier: 'Mythic Relic',
          xpReward: 250,
          lore: 'A sacred golden Mewari seal crowned with the Tower of Victory and the sunburst crest, awarded to true guardians of India’s living heritage.',
          iconType: 'flame'
        }
      });
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showIntroModal || activeChallenge || showCelebrationModal) return;

      if (e.key in keysPressed.current) {
        keysPressed.current[e.key] = true;
      }
      if (e.key.toLowerCase() === 'e' && nearbyChallenge) {
        handleInspectChallenge(nearbyChallenge);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key in keysPressed.current) {
        keysPressed.current[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showIntroModal, activeChallenge, showCelebrationModal, nearbyChallenge, handleInspectChallenge]);

  // Main 60fps Game Loop & Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
      if (showIntroModal || activeChallenge || showCelebrationModal) return;

      let dx = 0;
      let dy = 0;

      const keys = keysPressed.current;
      if (keys.w || keys.ArrowUp) dy -= 1;
      if (keys.s || keys.ArrowDown) dy += 1;
      if (keys.a || keys.ArrowLeft) dx -= 1;
      if (keys.d || keys.ArrowRight) dx += 1;

      if (joystickActive.current) {
        dx = joystickVector.current.x;
        dy = joystickVector.current.y;
      }

      const len = Math.hypot(dx, dy);
      const p = playerRef.current;

      if (len > 0.05) {
        const normX = dx / len;
        const normY = dy / len;
        p.vx = normX * PLAYER_SPEED;
        p.vy = normY * PLAYER_SPEED;
        p.angle = Math.atan2(normY, normX);
        p.isMoving = true;
        p.stepCount += 0.2;
      } else {
        p.vx *= 0.75;
        p.vy *= 0.75;
        if (Math.hypot(p.vx, p.vy) < 0.1) {
          p.vx = 0;
          p.vy = 0;
          p.isMoving = false;
        }
      }

      // Constrain inside world boundary
      p.x = Math.max(120, Math.min(WORLD_WIDTH - 120, p.x + p.vx));
      p.y = Math.max(120, Math.min(WORLD_HEIGHT - 120, p.y + p.vy));

      // Proximity Detection
      let closest = null;
      let minDst = INTERACTION_RADIUS;

      challengePoints.current.forEach((ch) => {
        if (completedChallengeIds.includes(ch.id)) return;
        const dist = Math.hypot(p.x - ch.x, p.y - ch.y);
        if (dist < minDst) {
          minDst = dist;
          closest = ch;
        }
      });

      setNearbyChallenge(closest);
    };

    const render = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      const p = playerRef.current;

      const camX = Math.max(0, Math.min(WORLD_WIDTH - width, p.x - width / 2));
      const camY = Math.max(0, Math.min(WORLD_HEIGHT - height, p.y - height / 2));

      ctx.save();
      ctx.translate(-camX, -camY);

      // =====================================================================
      // 1. MEWAR HILLTOP PLATEAU WORLD BACKGROUND (ARAVALLI GRANITE)
      // =====================================================================
      // Rugged Aravalli Hilltop Granite Base
      const hillGrad = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      hillGrad.addColorStop(0, '#1e1b2e');
      hillGrad.addColorStop(0.35, '#2e263d');
      hillGrad.addColorStop(0.7, '#1f192b');
      hillGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = hillGrad;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Vast 700-Acre Plateau Stone Terraces (Weathered Mewar Granite)
      const plateauGrad = ctx.createLinearGradient(400, 250, 2000, 1350);
      plateauGrad.addColorStop(0, '#2d3345');
      plateauGrad.addColorStop(0.5, '#3b4256');
      plateauGrad.addColorStop(1, '#252a38');
      ctx.fillStyle = plateauGrad;
      ctx.fillRect(400, 250, 1600, 1100);

      // Natural Flagstone Paving Slabs with subtle granite speckles (no wireframe look)
      for (let x = 420; x < 1960; x += 150) {
        for (let y = 270; y < 1330; y += 120) {
          const slabVar = (x * 13 + y * 7) % 3;
          ctx.fillStyle = slabVar === 0 ? 'rgba(255, 255, 255, 0.05)' : slabVar === 1 ? 'rgba(234, 179, 8, 0.04)' : 'rgba(0, 0, 0, 0.08)';
          ctx.fillRect(x + 2, y + 2, 146, 116);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 2, y + 2, 146, 116);
        }
      }

      // Ancient Weathered Stone Footpaths connecting Vijay Stambha to Gaumukh
      const drawGraniteRoad = (x1, y1, x2, y2) => {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.22)';
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      drawGraniteRoad(550, 480, 1200, 800); // Vijay Stambha to Central Court
      drawGraniteRoad(1200, 800, 1850, 1150); // Central Court to Gaumukh Reservoir
      drawGraniteRoad(1200, 800, 1200, 1280); // Central Court to Padmini Palace Area

      // =====================================================================
      // 2. MONUMENTAL FORTRESS WALLS, GATES & PARAPETS
      // =====================================================================
      // North Rampart Wall
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(380, 210, 1640, 60);
      ctx.fillStyle = '#e2e8f0';
      for (let bx = 400; bx < 2020; bx += 45) {
        ctx.fillRect(bx, 195, 26, 30);
      }

      // South Rampart Wall
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(380, 1330, 1640, 60);
      ctx.fillStyle = '#e2e8f0';
      for (let bx = 400; bx < 2020; bx += 45) {
        ctx.fillRect(bx, 1375, 26, 30);
      }

      // Ram Pol Gateway Arch Structure (East Gate)
      ctx.fillStyle = '#475569';
      ctx.fillRect(1800, 260, 140, 240);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(1800, 260, 140, 240);

      // Arch Opening
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(1870, 380, 45, Math.PI, 0);
      ctx.lineTo(1915, 500);
      ctx.lineTo(1825, 500);
      ctx.closePath();
      ctx.fill();

      // =====================================================================
      // 3. VIJAY STAMBHA (9-STORY TOWER OF VICTORY SILHOUETTE)
      // =====================================================================
      // Tower Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(550, 470, 80, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tower Plinth
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(490, 420, 120, 40);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(490, 420, 120, 40);

      // 9 Carved Tiers
      const tiers = [
        { w: 104, h: 22 },
        { w: 96, h: 20 },
        { w: 88, h: 20 },
        { w: 80, h: 18 },
        { w: 72, h: 18 },
        { w: 64, h: 16 },
        { w: 56, h: 16 },
        { w: 48, h: 14 },
        { w: 40, h: 14 }
      ];

      let curY = 420;
      tiers.forEach((t, i) => {
        curY -= t.h;
        ctx.fillStyle = i % 2 === 0 ? '#cbd5e1' : '#f8fafc';
        ctx.fillRect(550 - t.w / 2, curY, t.w, t.h);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(550 - t.w / 2, curY, t.w, t.h);

        // Balcony Jharokha accents
        ctx.fillStyle = '#b45309';
        ctx.fillRect(550 - t.w / 2 - 4, curY + t.h - 4, t.w + 8, 4);
      });

      // Summit Dome & Kalasha
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(550, curY - 10, 16, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(548, curY - 22, 4, 12);

      // =====================================================================
      // 4. GAUMUKH KUND & PADMINI WATER RESERVOIR
      // =====================================================================
      // Gaumukh Spring Reservoir Basin
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(1600, 1050, 300, 260);

      // Natural Water Body
      const waterGrad = ctx.createLinearGradient(1620, 1070, 1880, 1290);
      waterGrad.addColorStop(0, '#0284c7');
      waterGrad.addColorStop(0.5, '#0369a1');
      waterGrad.addColorStop(1, '#075985');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(1620, 1070, 260, 220);

      // Stone Stepped Ghats (Kund steps)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1620, 1070, 260, 220);
      ctx.strokeRect(1640, 1090, 220, 180);
      ctx.strokeRect(1660, 1110, 180, 140);

      // Animated Water Ripples
      const waveOffset = (Date.now() / 400) % 20;
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
      ctx.lineWidth = 1.5;
      for (let wy = 1120; wy < 1260; wy += 25) {
        ctx.beginPath();
        ctx.moveTo(1670, wy);
        ctx.quadraticCurveTo(1750, wy + (Math.sin(wy + waveOffset) * 6), 1830, wy);
        ctx.stroke();
      }

      // =====================================================================
      // 5. RENDER 3 PRESERVATION CHALLENGE STATIONS
      // =====================================================================
      challengePoints.current.forEach((ch) => {
        const isDone = completedChallengeIds.includes(ch.id);
        const isNearby = nearbyChallenge && nearbyChallenge.id === ch.id;

        // Station Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(ch.x, ch.y + 14, 38, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Conservation Station Base Plinth
        ctx.fillStyle = isDone ? '#065f46' : '#991b1b';
        ctx.beginPath();
        ctx.ellipse(ch.x, ch.y + 4, 32, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDone ? '#10b981' : '#ef4444';
        ctx.fillRect(ch.x - 24, ch.y - 22, 48, 26);

        // Shield Crest Emblem
        ctx.fillStyle = isDone ? '#a7f3d0' : '#fef08a';
        ctx.beginPath();
        ctx.arc(ch.x, ch.y - 34, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isDone ? '#059669' : '#b91c1c';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glowing Pulse Animation
        if (!isDone) {
          const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.5})`;
          ctx.lineWidth = 3 + pulse * 4;
          ctx.beginPath();
          ctx.arc(ch.x, ch.y - 34, 26 + pulse * 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Floating Title Badge
        ctx.fillStyle = isDone ? 'rgba(6, 78, 59, 0.95)' : 'rgba(127, 29, 29, 0.95)';
        ctx.strokeStyle = isDone ? 'rgba(52, 211, 153, 0.8)' : 'rgba(254, 202, 202, 0.8)';
        ctx.lineWidth = 1.5;
        const tagText = isDone ? `✓ ${ch.title}` : `[CHALLENGE ${ch.order}] ${ch.title}`;
        ctx.font = 'bold 12px sans-serif';
        const tw = ctx.measureText(tagText).width;

        ctx.beginPath();
        ctx.roundRect(ch.x - tw / 2 - 12, ch.y - 84, tw + 24, 26, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDone ? '#ecfdf5' : '#fee2e2';
        ctx.textAlign = 'center';
        ctx.fillText(tagText, ch.x, ch.y - 67);

        // Proximity Highlight Interaction Prompt
        if (isNearby && !isDone) {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(ch.x - 65, ch.y - 120, 130, 28, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('PRESS [E] / TAP', ch.x, ch.y - 102);
        }
      });

      // =====================================================================
      // 6. RENDER PLAYER AVATAR (THE EXPLORER)
      // =====================================================================
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 12, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Cloak
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Head & Turban
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(4, 0, 11, 0, Math.PI * 2);
      ctx.fill();

      // Vision Pointer
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();

      ctx.restore();

      ctx.restore();

      updatePhysics();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [showIntroModal, activeChallenge, showCelebrationModal, completedChallengeIds, nearbyChallenge]);

  // Touch Virtual Joystick Handlers
  const handleTouchStart = (e) => {
    joystickActive.current = true;
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!joystickActive.current) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxR = rect.width / 2;

    if (dist > 0) {
      joystickVector.current = {
        x: (dx / dist) * Math.min(1, dist / maxR),
        y: (dy / dist) * Math.min(1, dist / maxR)
      };
    }
  };

  const handleTouchEnd = () => {
    joystickActive.current = false;
    joystickVector.current = { x: 0, y: 0 };
  };

  return (
    <div className="location-explore-screen-root chittorgarh-explore-theme">
      <audio 
        ref={audioRef} 
        loop 
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=" 
      />

      <canvas ref={canvasRef} className="exploration-canvas" />

      {/* Top Universal Game HUD */}
      <div className="explore-top-hud">
        <div className="hud-location-badge">
          <span className="hud-state-tag">RAJASTHAN &bull; MEWAR REALM</span>
          <h2 className="hud-fort-name">CHITTORGARH FORT &bull; HILL BASTION</h2>
        </div>

        {/* Quest HUD Panel */}
        <div className="hud-quest-panel">
          <div className="quest-header">
            <Shield size={16} className="text-gold" />
            <span className="quest-title-text">QUEST: THE PRESERVATION CHALLENGE</span>
          </div>
          <div className="quest-objective-row">
            <span className="quest-objective-label">Protect 3 Heritage Locations</span>
            <span className="quest-counter-pill">
              CHALLENGES: {completedChallengeIds.length} / 3
            </span>
          </div>
        </div>

        {/* Actions Group */}
        <div className="hud-actions-group">
          <button 
            className="btn-hud-icon" 
            onClick={toggleAmbientSound}
            title={ambientPlaying ? 'Mute Atmosphere' : 'Play Atmosphere'}
          >
            {ambientPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button 
            className="btn-hud-codex"
            onClick={() => {
              sound.playClick();
              if (onOpenCodex) onOpenCodex();
            }}
          >
            <BookOpen size={16} />
            <span>Codex</span>
          </button>
        </div>
      </div>

      {/* Acharya Vikram Real-Time Dialogue Bar */}
      <div className="explore-bottom-guide-bar">
        <div className="guide-avatar-circle">
          <img 
            src="/assets/characters/acharya-vikram-portrait.jpg" 
            alt="Acharya Vikram" 
            className="guide-avatar-img-circle"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="guide-dialogue-content">
          <span className="guide-name-label">ACHARYA VIKRAM &bull; HERITAGE STEWARDSHIP</span>
          <p className="guide-speech-text">{guideSpeech}</p>
        </div>

        {completedChallengeIds.length === 3 && (
          <button 
            className="btn-heritage-primary btn-decode-trigger pulse-gold"
            onClick={() => {
              sound.playFanfare();
              setShowCelebrationModal(true);
            }}
          >
            <Shield size={18} />
            <span>COMPLETE PRESERVATION</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Mobile Virtual Joystick & Interact Button */}
      <div className="mobile-touch-controls">
        <div 
          className="virtual-joystick-base"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="virtual-joystick-stick"></div>
        </div>

        {nearbyChallenge && !completedChallengeIds.includes(nearbyChallenge.id) && (
          <button 
            className="mobile-interact-fab pulse-gold"
            onClick={() => handleInspectChallenge(nearbyChallenge)}
          >
            <Hand size={24} />
            <span>INTERACT</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* 1. ACHARYA VIKRAM INTRO MODAL                                       */}
      {/* =================================================================== */}
      {showIntroModal && (
        <div className="dialog-overlay-scrim animate-fade-in">
          <div className="intro-dialog-card chittorgarh-intro-card">
            <div className="intro-card-header">
              <div className="guide-intro-avatar">
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="guide-avatar-img-circle"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="guide-role-tag">ROYAL CHRONICLER &bull; FINAL RAJASTHAN TRIAL</span>
                <h3 className="intro-fort-heading">WELCOME TO CHITTORGARH FORT</h3>
              </div>
            </div>

            <div className="intro-card-body">
              <p className="intro-speech-line">
                &ldquo;You have travelled far, Explorer.&rdquo;
              </p>
              <p className="intro-speech-line">
                &ldquo;Chittorgarh carries centuries of stories within its walls.&rdquo;
              </p>
              <p className="intro-speech-line">
                &ldquo;But discovering heritage is only the beginning.&rdquo;
              </p>
              <p className="intro-speech-line">
                &ldquo;Can you decide how it should be protected?&rdquo;
              </p>
            </div>

            <div className="intro-card-footer">
              <button 
                className="btn-heritage-primary btn-large-cta"
                onClick={() => {
                  sound.playClick();
                  setShowIntroModal(false);
                }}
              >
                <Shield size={18} />
                <span>BEGIN EXPLORATION</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PRESERVATION CHALLENGE & CONSEQUENCE MODAL                        */}
      {/* =================================================================== */}
      {activeChallenge && (
        <div className="dialog-overlay-scrim animate-fade-in">
          <div className="inspection-dialog-card preservation-challenge-card">
            <header className="inspection-card-header">
              <div className="inspection-title-group">
                <span className="discovery-location-tag">
                  {activeChallenge.area} &bull; PRESERVATION SCENARIO
                </span>
                <h3 className="discovery-title-text">
                  [CHALLENGE {activeChallenge.order}] {activeChallenge.title}
                </h3>
              </div>
              <button 
                className="btn-close-circle"
                onClick={handleCloseChallengeModal}
              >
                <X size={18} />
              </button>
            </header>

            <div className="inspection-card-body">
              {/* Scenario Narrative Box */}
              <div className="preservation-scenario-box">
                <AlertTriangle size={20} className="text-gold" />
                <p>{activeChallenge.scenario}</p>
              </div>

              {/* Options Decision Grid */}
              <div className="preservation-options-list">
                <span className="options-prompt-label">SELECT A PRESERVATION ACTION:</span>
                {activeChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      className={`preservation-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(opt)}
                    >
                      <div className="option-letter-badge">{opt.id}</div>
                      <div className="option-text-wrap">{opt.text}</div>
                    </button>
                  );
                })}
              </div>

              {/* Consequence Feedback Reveal */}
              {consequenceFeedback && (
                <div className={`preservation-consequence-card ${consequenceFeedback.isBest ? 'consequence-success' : 'consequence-hazard'} animate-fade-in`}>
                  <div className="consequence-header">
                    {consequenceFeedback.isBest ? (
                      <CheckCircle2 size={20} className="text-emerald" />
                    ) : (
                      <AlertTriangle size={20} className="text-rose" />
                    )}
                    <strong>{consequenceFeedback.title}</strong>
                  </div>
                  <p className="consequence-desc">{consequenceFeedback.text}</p>
                  
                  <div className="consequence-vikram-note">
                    <span className="note-speaker">Acharya Vikram&rsquo;s Guidance:</span>
                    <p className="note-text">&ldquo;{consequenceFeedback.insight}&rdquo;</p>
                  </div>
                </div>
              )}
            </div>

            <footer className="inspection-card-footer">
              {consequenceFeedback?.isBest ? (
                <button 
                  className="btn-heritage-primary btn-large-cta pulse-gold"
                  onClick={handleCloseChallengeModal}
                >
                  <CheckCircle2 size={18} />
                  <span>PRESERVATION COMPLETE (+50 XP)</span>
                </button>
              ) : (
                <button 
                  className="btn-heritage-secondary"
                  onClick={handleCloseChallengeModal}
                >
                  <span>Close &amp; Explore</span>
                </button>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. HERITAGE PRESERVATION COMPLETE CELEBRATION MODAL                 */}
      {/* =================================================================== */}
      {showCelebrationModal && (
        <div className="dialog-overlay-scrim animate-fade-in">
          <div className="intro-dialog-card chittorgarh-celebration-card">
            <div className="intro-card-header">
              <div className="guide-intro-avatar pulse-gold">
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="guide-avatar-img-circle"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="guide-role-tag">GRAND FINALE &bull; MEWAR CITADEL</span>
                <h3 className="intro-fort-heading">HERITAGE PRESERVATION COMPLETE</h3>
              </div>
            </div>

            <div className="intro-card-body">
              <div className="preservation-complete-milestones">
                <div className="milestone-chip done">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>✓ Weathered Stone Protected</span>
                </div>
                <div className="milestone-chip done">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>✓ Visitor Foot-Traffic Balanced</span>
                </div>
                <div className="milestone-chip done">
                  <CheckCircle2 size={14} className="text-emerald" />
                  <span>✓ Historic Water Spring Preserved</span>
                </div>
              </div>

              <div className="vikram-praise-card" style={{ marginTop: '1rem' }}>
                <div className="vikram-praise-avatar">
                  <img 
                    src="/assets/characters/acharya-vikram-portrait.jpg" 
                    alt="Acharya Vikram" 
                    className="guide-avatar-img-circle"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="vikram-praise-body">
                  <strong>ACHARYA VIKRAM&rsquo;S FINAL LESSON</strong>
                  <p>
                    &ldquo;You have learned something important, Explorer. Heritage survives when knowledge becomes action. By understanding preservation, you are now a true Guardian of Bharat&rsquo;s living past.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="intro-card-footer">
              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={handleClaimFinalRelicAndFinish}
              >
                <Award size={18} />
                <span>CLAIM RELIC &bull; COMPLETE RAJASTHAN (+250 XP)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
