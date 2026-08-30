import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Compass,
  X,
  Hand,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';
import { sound } from '../data/soundEffects';

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const PLAYER_SPEED = 4.8;
const INTERACTION_RADIUS = 130;

export default function JaisalmerExploreScreen({
  _location,
  onStartMiniGame,
  onClaimExplorationXP,
  _playerStats,
  _onReturnToMap,
  onOpenCodex
}) {
  // Canvas & Audio References
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioRef = useRef(null);

  // Audio & Ambient State
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  // Quest & Clue Collection State
  const [collectedClues, setCollectedClues] = useState([]); // array of clue IDs
  const [activeInspectionClue, setActiveInspectionClue] = useState(null);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Acharya Vikram Intro Modal State
  const [showIntroModal, setShowIntroModal] = useState(true);

  // Player & Camera Physics State
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

  // 3 Environmental Trade-Route Clues in Jaisalmer Fort
  const cluePoints = useRef([
    {
      id: 'clue_caravan',
      order: 1,
      title: 'Caravan Route',
      subtitle: 'Silk, Spice & Desert Waypoints',
      area: 'Dune Gate Approach (Akhai Pol)',
      x: 480,
      y: 420,
      shortTag: 'Caravan Route',
      description: 'Positioned strategically in the heart of the Great Thar Desert, Jaisalmer was the primary crossroads for camel caravans travelling between India, Persia, Arabia, and Central Asia.',
      vikramQuote: 'Look across the desert sands! Merchant caravans with hundreds of camels would travel for weeks across treacherous dunes, guided by stars to reach the safety of Jaisalmer.',
      discoveryXP: 25,
      iconType: 'caravan',
      glyphCode: 'THAR-CROSSROADS-1156'
    },
    {
      id: 'clue_trade',
      order: 2,
      title: 'Desert Trade',
      subtitle: 'Silk, Spices, Opium & Stonecraft',
      area: 'Central Bazaar Square (Manak Chowk)',
      x: 1950,
      y: 390,
      shortTag: 'Desert Trade',
      description: 'Merchants exchanged fine silks, precious gemstones, desert salt, saffron, and fragrant spices. The fort collected transit duties that funded palatial architecture and municipal stepwells.',
      vikramQuote: 'The bazaars echoed with dozens of languages. Wealth flowed through these stone corridors, allowing master masons to sculpt palaces like delicate lace.',
      discoveryXP: 25,
      iconType: 'trade',
      glyphCode: 'MANAK-CHOWK-BAZAAR'
    },
    {
      id: 'clue_living_heritage',
      order: 3,
      title: 'Jaisalmer\'s Living Heritage',
      subtitle: 'Sonar Qila & The Living Community',
      area: 'Royal Haveli Courtyard (Patwon Ki Haveli)',
      x: 1880,
      y: 1250,
      shortTag: 'Living Heritage',
      description: 'Constructed in 1156 CE by Rawal Jaisal from yellow Jurassic sandstone, Sonar Qila remains one of the world\'s few functioning "living forts", where thousands of families, craftsmen, and merchants still reside.',
      vikramQuote: 'Observe the bustling houses and intricately carved jali stone screens! Heritage here is not a quiet relic—it is a vibrant, continuous way of life spanning eight centuries.',
      discoveryXP: 25,
      iconType: 'heritage',
      glyphCode: 'SONAR-QILA-PATWON'
    }
  ]);

  // Current Nearby Interaction Target
  const [nearbyClue, setNearbyClue] = useState(null);

  // Dynamic Acharya Vikram Voice Line
  const [guideSpeech, setGuideSpeech] = useState(
    'Welcome to Jaisalmer, Explorer. Move freely around the golden sandstone citadel to uncover the 3 trade-route clues.'
  );

  // Background Ambient Sound Toggle
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

  // Open Clue Inspection Modal
  const handleInspectClue = useCallback((clue) => {
    sound.playInspect();
    setActiveInspectionClue(clue);
    setGuideSpeech(`“${clue.vikramQuote}”`);
  }, []);

  // Collect Current Clue
  const handleCollectClue = (clue) => {
    sound.playChime();
    const updated = [...collectedClues, clue.id];
    setCollectedClues(updated);
    setActiveInspectionClue(null);

    // If 3/3 clues collected
    if (updated.length === 3) {
      sound.playFanfare();
      setShowCelebrationBanner(true);
      setGuideSpeech(
        'Outstanding, Explorer! You have found all 3 trade-route clues. Click "RECONSTRUCT THE ROUTE" to piece together the journey!'
      );
      if (onClaimExplorationXP) {
        onClaimExplorationXP(75);
      }
      // Auto fade banner after 3 seconds
      setTimeout(() => {
        setShowCelebrationBanner(false);
      }, 3000);
    } else {
      setGuideSpeech(
        `Clue collected! (${updated.length}/3) Continue exploring the golden citadel for the remaining trade clues.`
      );
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showIntroModal || activeInspectionClue) return;

      if (e.key in keysPressed.current) {
        keysPressed.current[e.key] = true;
      }
      if (e.key.toLowerCase() === 'e' && nearbyClue) {
        handleInspectClue(nearbyClue);
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
  }, [showIntroModal, activeInspectionClue, nearbyClue, handleInspectClue]);

  // Main 60fps Game Loop & Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
      if (showIntroModal || activeInspectionClue) return;

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

      // Proximity Detection to Clues
      let closest = null;
      let minDst = INTERACTION_RADIUS;

      cluePoints.current.forEach((clue) => {
        if (collectedClues.includes(clue.id)) return;
        const dist = Math.hypot(p.x - clue.x, p.y - clue.y);
        if (dist < minDst) {
          minDst = dist;
          closest = clue;
        }
      });

      setNearbyClue(closest);
    };

    const render = () => {
      // Resize Canvas to Window
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);

      const p = playerRef.current;

      // Camera Follow Centering
      const camX = Math.max(0, Math.min(WORLD_WIDTH - width, p.x - width / 2));
      const camY = Math.max(0, Math.min(WORLD_HEIGHT - height, p.y - height / 2));

      ctx.save();
      ctx.translate(-camX, -camY);

      // =====================================================================
      // 1. DESERT GOLDEN SANDSTONE WORLD BACKGROUND (THAR DUNES)
      // =====================================================================
      // Deep Golden Ochre Base
      const desertGrad = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      desertGrad.addColorStop(0, '#92400e');
      desertGrad.addColorStop(0.35, '#b45309');
      desertGrad.addColorStop(0.7, '#d97706');
      desertGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = desertGrad;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Sweeping Thar Sand Dunes with Warm Highlights
      ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.beginPath();
      ctx.ellipse(320, 260, 520, 240, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(217, 119, 6, 0.55)';
      ctx.beginPath();
      ctx.ellipse(420, 1380, 600, 280, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();

      // Dune Wind Ripples
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
      ctx.lineWidth = 2;
      for (let rx = 60; rx < 600; rx += 40) {
        ctx.beginPath();
        ctx.moveTo(rx, 150 + (rx % 30));
        ctx.bezierCurveTo(rx + 50, 220, rx - 30, 320, rx + 40, 420);
        ctx.stroke();
      }

      // =====================================================================
      // 2. SONAR QILA FORTRESS COURTYARD (YELLOW JURASSIC SANDSTONE)
      // =====================================================================
      // Central Citadel Paved Platform
      const courtyardGrad = ctx.createLinearGradient(600, 300, 2000, 1300);
      courtyardGrad.addColorStop(0, '#78350f');
      courtyardGrad.addColorStop(0.5, '#92400e');
      courtyardGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = courtyardGrad;
      ctx.fillRect(600, 300, 1400, 1000);

      // Textured Golden Flagstones (natural stone hue variance, no wireframe lines)
      for (let x = 620; x < 1960; x += 140) {
        for (let y = 320; y < 1280; y += 110) {
          const stoneVar = (x * 11 + y * 17) % 3;
          ctx.fillStyle = stoneVar === 0 ? 'rgba(245, 158, 11, 0.14)' : stoneVar === 1 ? 'rgba(253, 224, 71, 0.09)' : 'rgba(69, 26, 3, 0.12)';
          ctx.fillRect(x + 2, y + 2, 136, 106);
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 2, y + 2, 136, 106);
        }
      }

      // =====================================================================
      // 3. FORTRESS MASSIVE WALLS, BASTIONS & TOWERS (TRIKUTA HILL 99 BASTIONS)
      // =====================================================================
      // Rampart Shadow Underlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(570, 240, 1460, 70);
      ctx.fillRect(570, 1260, 1460, 70);

      // North Wall & Battlements
      ctx.fillStyle = '#78350f';
      ctx.fillRect(580, 250, 1440, 50);
      ctx.fillStyle = '#f59e0b';
      for (let bx = 600; bx < 2000; bx += 40) {
        ctx.fillRect(bx, 235, 24, 25);
      }

      // South Ramparts Wall
      ctx.fillStyle = '#78350f';
      ctx.fillRect(580, 1280, 1440, 50);
      ctx.fillStyle = '#f59e0b';
      for (let bx = 600; bx < 2000; bx += 40) {
        ctx.fillRect(bx, 1320, 24, 25);
      }

      // Massive Round Bastions with Radial Golden Sandstone Shading
      const bastions = [
        { x: 580, y: 260, r: 75, name: 'Suraj Prol Bastion' },
        { x: 1300, y: 260, r: 85, name: 'Ganesh Prol Bastion' },
        { x: 2020, y: 260, r: 75, name: 'Hawa Prol Bastion' },
        { x: 580, y: 1300, r: 75, name: 'Akshya Prol Bastion' },
        { x: 1300, y: 1300, r: 85, name: 'Meghdoot Bastion' },
        { x: 2020, y: 1300, r: 75, name: 'Sonar Bastion' }
      ];

      bastions.forEach((b) => {
        // Outer Shadow Ring
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(b.x + 4, b.y + 4, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Bastion Body
        const bGrad = ctx.createRadialGradient(b.x - 10, b.y - 10, 10, b.x, b.y, b.r);
        bGrad.addColorStop(0, '#fef08a');
        bGrad.addColorStop(0.5, '#f59e0b');
        bGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Inner Chhatri Platform
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#b45309';
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // =====================================================================
      // 4. CENTRAL MANAK CHOWK & PATWON KI HAVELI ORNAMENTATION
      // =====================================================================
      // Central Chowk Mandala / Star of Marwar (1200, 800)
      ctx.beginPath();
      ctx.arc(1200, 800, 140, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // 8-Pointed Star Pattern
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(1200, 800);
        ctx.lineTo(1200 + Math.cos(rad) * 135, 800 + Math.sin(rad) * 135);
        ctx.stroke();
      }

      // Traditional Silk Rug Market Stall Inlays in Manak Chowk
      const rugPositions = [
        { x: 1040, y: 720, color: '#dc2626' },
        { x: 1320, y: 720, color: '#0284c7' },
        { x: 1040, y: 880, color: '#059669' },
        { x: 1320, y: 880, color: '#7c3aed' }
      ];
      rugPositions.forEach((rug) => {
        ctx.fillStyle = rug.color;
        ctx.fillRect(rug.x, rug.y, 65, 45);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rug.x, rug.y, 65, 45);
        // Fringe
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(rug.x + 4, rug.y + 4, 57, 37);
      });

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MANAK CHOWK BAZAAR', 1200, 805);

      // Haveli Jali Carvings & Pavilions (Patwon Ki Haveli Area - East Wing)
      ctx.fillStyle = '#54261a';
      ctx.fillRect(1740, 580, 220, 320);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(1740, 580, 220, 320);

      // Jharokha Balconies with Delicate Jali Lattice
      for (let hy = 620; hy < 860; hy += 75) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(1765, hy, 65, 55);
        ctx.fillRect(1865, hy, 65, 55);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(1765, hy, 65, 55);
        ctx.strokeRect(1865, hy, 65, 55);

        // Golden Lattice Grille
        ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
        ctx.fillRect(1775, hy + 12, 45, 30);
        ctx.fillRect(1875, hy + 12, 45, 30);
      }
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText('PATWON KI HAVELI', 1850, 925);

      // Camel Caravan Ancient Desert Trail
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.setLineDash([16, 14]);
      ctx.beginPath();
      ctx.moveTo(80, 420);
      ctx.quadraticCurveTo(340, 460, 580, 760);
      ctx.stroke();
      ctx.setLineDash([]);

      // =====================================================================
      // 5. RENDER 3 ENVIRONMENTAL TRADE-ROUTE CLUES
      // =====================================================================
      cluePoints.current.forEach((clue) => {
        const isCollected = collectedClues.includes(clue.id);
        const isNearby = nearbyClue && nearbyClue.id === clue.id;

        // Pedestal Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(clue.x, clue.y + 12, 36, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pedestal Base
        ctx.fillStyle = isCollected ? '#4b5563' : '#b45309';
        ctx.beginPath();
        ctx.ellipse(clue.x, clue.y + 4, 30, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isCollected ? '#6b7280' : '#d97706';
        ctx.fillRect(clue.x - 22, clue.y - 20, 44, 24);

        // Clue Ancient Carved Sandstone Relic / Compass Emblem
        ctx.fillStyle = isCollected ? '#9ca3af' : '#fef08a';
        ctx.beginPath();
        ctx.arc(clue.x, clue.y - 32, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isCollected ? '#6b7280' : '#ca8a04';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Glowing Pulse Animation for Active Clues
        if (!isCollected) {
          const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
          ctx.strokeStyle = `rgba(254, 240, 138, ${0.4 + pulse * 0.5})`;
          ctx.lineWidth = 3 + pulse * 4;
          ctx.beginPath();
          ctx.arc(clue.x, clue.y - 32, 26 + pulse * 8, 0, Math.PI * 2);
          ctx.stroke();

          // Sparkle Beam
          ctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
          ctx.beginPath();
          ctx.arc(clue.x, clue.y - 58 - pulse * 6, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating Tag & Area Badge
        ctx.fillStyle = isCollected ? 'rgba(31, 41, 55, 0.85)' : 'rgba(120, 53, 15, 0.92)';
        ctx.strokeStyle = isCollected ? 'rgba(156, 163, 175, 0.3)' : 'rgba(254, 240, 138, 0.7)';
        ctx.lineWidth = 1.5;
        const tagText = isCollected ? `✓ ${clue.shortTag}` : `[CLUE ${clue.order}] ${clue.shortTag}`;
        ctx.font = 'bold 12px sans-serif';
        const tw = ctx.measureText(tagText).width;

        ctx.beginPath();
        ctx.roundRect(clue.x - tw / 2 - 10, clue.y - 82, tw + 20, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isCollected ? '#d1d5db' : '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText(tagText, clue.x, clue.y - 66);

        // Proximity Highlight Interaction Prompt
        if (isNearby && !isCollected) {
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(clue.x - 65, clue.y - 118, 130, 28, 14);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('PRESS [E] / TAP', clue.x, clue.y - 100);
        }
      });

      // =====================================================================
      // 6. RENDER PLAYER AVATAR (THE EXPLORER)
      // =====================================================================
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 12, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (Royal Rajput/Explorer Attire)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Explorer Cloak / Tunic (Desert Saffron/Gold)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Explorer Head / Turban
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(4, 0, 11, 0, Math.PI * 2);
      ctx.fill();

      // Headband Feather / Jewel
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(8, -3, 6, 6);

      // Vision Direction Pointer
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(24, 0);
      ctx.stroke();

      ctx.restore();

      ctx.restore();

      // Trigger Next Frame
      updatePhysics();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [showIntroModal, activeInspectionClue, collectedClues, nearbyClue]);

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
    <div className="location-explore-screen-root jaisalmer-explore-theme">
      {/* Background Ambience Audio */}
      <audio 
        ref={audioRef} 
        loop 
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=" 
      />

      {/* Main Full-Screen 2D Canvas */}
      <canvas ref={canvasRef} className="exploration-canvas" />

      {/* Top Universal Game HUD */}
      <div className="explore-top-hud">
        <div className="hud-location-badge">
          <span className="hud-state-tag">RAJASTHAN &bull; THAR DESERT</span>
          <h2 className="hud-fort-name">JAISALMER FORT &bull; SONAR QILA</h2>
        </div>

        {/* Quest HUD Strip */}
        <div className="hud-quest-panel">
          <div className="quest-header">
            <Compass size={16} className="text-gold" />
            <span className="quest-title-text">QUEST: THE GOLDEN ROUTE</span>
          </div>
          <div className="quest-objective-row">
            <span className="quest-objective-label">Find 3 Trade-Route Clues</span>
            <span className="quest-counter-pill">
              CLUES: {collectedClues.length} / 3
            </span>
          </div>
        </div>

        {/* Audio & Codex Actions */}
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
          <span className="guide-name-label">ACHARYA VIKRAM</span>
          <p className="guide-speech-text">{guideSpeech}</p>
        </div>

        {/* Action Button: When 3/3 Clues Found */}
        {collectedClues.length === 3 && (
          <button 
            className="btn-heritage-primary btn-decode-trigger pulse-gold"
            onClick={() => {
              sound.playFanfare();
              if (onStartMiniGame) onStartMiniGame();
            }}
          >
            <Compass size={18} />
            <span>RECONSTRUCT THE ROUTE</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Mobile Virtual Joystick & Interact Controls */}
      <div className="mobile-touch-controls">
        <div 
          className="virtual-joystick-base"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="virtual-joystick-stick"></div>
        </div>

        {nearbyClue && !collectedClues.includes(nearbyClue.id) && (
          <button 
            className="mobile-interact-fab pulse-gold"
            onClick={() => handleInspectClue(nearbyClue)}
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
          <div className="intro-dialog-card jaisalmer-intro-card">
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
                <span className="guide-role-tag">ROYAL CHRONICLER &bull; THAR EXPEDITION</span>
                <h3 className="intro-fort-heading">WELCOME TO JAISALMER FORT</h3>
              </div>
            </div>

            <div className="intro-card-body">
              <p className="intro-speech-line">
                &ldquo;Welcome to Jaisalmer, Explorer.&rdquo;
              </p>
              <p className="intro-speech-line">
                &ldquo;This golden fortress stood along important routes connecting people, goods and ideas.&rdquo;
              </p>
              <p className="intro-speech-line">
                &ldquo;Your task is to piece together the journey.&rdquo;
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
                <Compass size={18} />
                <span>BEGIN EXPLORATION</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. ENVIRONMENTAL CLUE INSPECTION MODAL                              */}
      {/* =================================================================== */}
      {activeInspectionClue && (
        <div className="dialog-overlay-scrim animate-fade-in">
          <div className="inspection-dialog-card">
            <header className="inspection-card-header">
              <div className="inspection-title-group">
                <span className="discovery-location-tag">
                  {activeInspectionClue.area}
                </span>
                <h3 className="discovery-title-text">
                  [CLUE {activeInspectionClue.order}] {activeInspectionClue.title}
                </h3>
              </div>
              <button 
                className="btn-close-circle"
                onClick={() => setActiveInspectionClue(null)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="inspection-card-body">
              {/* Carved Glyph Emblem Artwork */}
              <div className="ancient-glyph-stone-display jaisalmer-glyph-stone">
                <div className="glyph-stone-inner">
                  <span className="glyph-seal-stamp">{activeInspectionClue.glyphCode}</span>
                  <div className="glyph-ancient-text">
                    {activeInspectionClue.subtitle}
                  </div>
                </div>
              </div>

              {/* Historical Context Description */}
              <p className="discovery-historical-desc">
                {activeInspectionClue.description}
              </p>

              {/* Acharya Vikram's Insight */}
              <div className="vikram-quote-box" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="vikram-mini-avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <span className="quote-speaker">Acharya Vikram:</span>
                  <p className="quote-text">&ldquo;{activeInspectionClue.vikramQuote}&rdquo;</p>
                </div>
              </div>
            </div>

            <footer className="inspection-card-footer">
              <button 
                className="btn-heritage-primary btn-large-cta"
                onClick={() => handleCollectClue(activeInspectionClue)}
              >
                <Award size={18} />
                <span>COLLECT CLUE (+25 XP)</span>
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. AUTO-FADING CELEBRATION OVERLAY                                  */}
      {/* =================================================================== */}
      {showCelebrationBanner && (
        <div className="quest-celebration-toast animate-slide-down">
          <Sparkles size={24} className="text-gold" />
          <div>
            <h4>ALL 3 TRADE-ROUTE CLUES FOUND!</h4>
            <p>You have unlocked &ldquo;RECONSTRUCT THE ROUTE&rdquo; mini-game.</p>
          </div>
        </div>
      )}
    </div>
  );
}
