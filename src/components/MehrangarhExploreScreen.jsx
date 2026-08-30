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
  ArrowRight
} from 'lucide-react';
import { sound } from '../data/soundEffects';

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
  const joystickVector = useRef({ x: 0, y: 0 });
  const isInteractingModalOpen = useRef(false);

  useEffect(() => {
    isInteractingModalOpen.current = !!(activeInspectionFragment || showIntroModal);
  }, [activeInspectionFragment, showIntroModal]);

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

      // E or Space to Interact with nearby fragment
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearbyFragment) {
        e.preventDefault();
        sound.playChime();
        setActiveInspectionFragment(nearbyFragment);
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

  // Mobile Virtual Joystick Handlers
  const handleJoystickMove = (vector) => {
    joystickVector.current = vector;
  };

  const handleJoystickEnd = () => {
    joystickVector.current = { x: 0, y: 0 };
  };

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

        if (joystickVector.current.x !== 0 || joystickVector.current.y !== 0) {
          dx = joystickVector.current.x;
          dy = joystickVector.current.y;
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
      // ===================================================================
      // DRAW CANVAS SCENE: MEHRANGARH CITADEL & JODHPUR CLIFFS
      // ===================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-camX, -camY);

      // --- LAYER 1: DESERT SKY & CLIFFSIDE BLUE CITY HORIZON ---
      // Volcanic Rock Base Ground
      const terrainGrad = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      terrainGrad.addColorStop(0, '#1c131a');
      terrainGrad.addColorStop(0.4, '#2d181e');
      terrainGrad.addColorStop(0.8, '#1e1424');
      terrainGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = terrainGrad;
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Blue City Precipice Vista (South-West drop-off)
      const blueCityGradient = ctx.createLinearGradient(0, 1100, 800, 1600);
      blueCityGradient.addColorStop(0, '#1e3a5f');
      blueCityGradient.addColorStop(0.5, '#0c2340');
      blueCityGradient.addColorStop(1, '#050f1a');
      ctx.fillStyle = blueCityGradient;
      ctx.fillRect(0, 1100, 1000, 500);

      // Cliff Edge Rock Strata Fissures
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 1100);
      ctx.lineTo(320, 1140);
      ctx.lineTo(650, 1110);
      ctx.lineTo(1000, 1200);
      ctx.stroke();

      // Jodhpur Indigo-Blue Traditional Houses below the cliff
      for (let hx = 30; hx < 920; hx += 55) {
        for (let hy = 1160; hy < 1550; hy += 48) {
          const houseColor = (hx + hy) % 3 === 0 ? '#1e40af' : (hx + hy) % 2 === 0 ? '#0284c7' : '#0369a1';
          ctx.fillStyle = houseColor;
          ctx.fillRect(hx + (hy % 25), hy, 42, 32);
          // Flat Roof & White Parapet Trim
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(hx + (hy % 25), hy, 42, 4);
          // Tiny Courtyard / Doorway
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(hx + (hy % 25) + 16, hy + 14, 10, 14);
        }
      }

      // --- LAYER 2: MASSIVE RED SANDSTONE FORTRESS WALLS & BASTIONS ---
      // Primary Citadel Paved Terrace
      const terraceGrad = ctx.createLinearGradient(200, 150, 2200, 1450);
      terraceGrad.addColorStop(0, '#38221b');
      terraceGrad.addColorStop(0.5, '#4a2c22');
      terraceGrad.addColorStop(1, '#2f1a14');
      ctx.fillStyle = terraceGrad;
      ctx.fillRect(200, 150, 2000, 1300);

      // Sandstone Paving Flagstones with realistic stone variation (no wireframe look)
      for (let x = 200; x < 2200; x += 160) {
        for (let y = 150; y < 1450; y += 120) {
          const stoneHue = (x * 7 + y * 13) % 4;
          ctx.fillStyle = stoneHue === 0 ? 'rgba(194, 89, 63, 0.12)' : stoneHue === 1 ? 'rgba(217, 119, 6, 0.08)' : 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(x + 2, y + 2, 156, 116);
          ctx.strokeStyle = 'rgba(230, 179, 37, 0.08)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 2, y + 2, 156, 116);
        }
      }

      // Massive High Rampart Walls with Cast Shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(170, 120, 2080, 50); // Shadow top
      ctx.fillRect(170, 1420, 2080, 60); // Shadow bottom

      // Heavy Red Sandstone Outer Ramparts
      ctx.fillStyle = '#6e3020';
      ctx.fillRect(180, 120, 2040, 40); // Top wall
      ctx.fillRect(180, 1420, 2040, 40); // Bottom wall
      ctx.fillRect(180, 120, 40, 1340); // Left wall
      ctx.fillRect(2180, 120, 40, 1340); // Right wall

      // Crenellated Battlements (Merlons and Embrasures)
      ctx.fillStyle = '#8f3e28';
      for (let bx = 180; bx < 2220; bx += 40) {
        ctx.fillRect(bx, 105, 24, 25);
        ctx.fillRect(bx, 1445, 24, 25);
      }
      for (let by = 120; by < 1460; by += 40) {
        ctx.fillRect(165, by, 25, 24);
        ctx.fillRect(2205, by, 25, 24);
      }

      // Giant Corner Bastions with Chhatri Cupolas
      const fortBastions = [
        { x: 200, y: 140, name: 'Fatehpol Bastion' },
        { x: 2200, y: 140, name: 'Jayapol Bastion' },
        { x: 200, y: 1440, name: 'Loha Pol Bastion' },
        { x: 2200, y: 1440, name: 'Suraj Pol Bastion' },
        { x: 1200, y: 140, name: 'Khandar Batta Bastion' }
      ];
      fortBastions.forEach((b) => {
        // Bastion Base Shadow
        ctx.beginPath();
        ctx.arc(b.x + 4, b.y + 4, 60, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();

        // Bastion Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, 56, 0, Math.PI * 2);
        ctx.fillStyle = '#7a3522';
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner Octagonal Chhatri Platform
        ctx.beginPath();
        ctx.arc(b.x, b.y, 34, 0, Math.PI * 2);
        ctx.fillStyle = '#99442e';
        ctx.fill();
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Central Dome Finial
        ctx.beginPath();
        ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
      });

      // --- LAYER 3: ROYAL PALACE WINGS (PHOOL MAHAL & MOTI MAHAL FACADES) ---
      // Phool Mahal / Moti Mahal Palace Wing (North Plaza)
      ctx.fillStyle = '#54261a';
      ctx.fillRect(800, 200, 800, 180);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(800, 200, 800, 180);

      // Ornate Jharokha Balconies & Scalloped Arches along Palace Facade
      for (let jx = 840; jx < 1560; jx += 90) {
        // Balcony Base
        ctx.fillStyle = '#78350f';
        ctx.fillRect(jx, 220, 60, 50);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(jx, 220, 60, 50);
        // Scalloped Arch Crest
        ctx.beginPath();
        ctx.arc(jx + 30, 220, 20, Math.PI, 0);
        ctx.fillStyle = '#92400e';
        ctx.fill();
        ctx.stroke();
        // Golden Jali Lattice Window
        ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
        ctx.fillRect(jx + 15, 235, 30, 25);
      }
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MOTI MAHAL & PHOOL MAHAL PALACE WING', 1200, 340);

      // --- LAYER 4: HISTORIC CORONATION PLAZA (SHRINGAR CHOWK) ---
      // Royal Marble Throne & Mandala Court (1200, 850)
      const chowkX = 1200;
      const chowkY = 850;

      // Outer Radial Mandala Inlay
      ctx.beginPath();
      ctx.arc(chowkX, chowkY, 140, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 8-Point Solar Star Pattern
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 2;
      for (let deg = 0; deg < 360; deg += 45) {
        const rad = (deg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(chowkX, chowkY);
        ctx.lineTo(chowkX + 135 * Math.cos(rad), chowkY + 135 * Math.sin(rad));
        ctx.stroke();
      }

      // Takhat-e-Rawat (Royal Coronation White Marble Throne Plinth)
      ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
      ctx.fillRect(chowkX - 55, chowkY - 55, 110, 110);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.strokeRect(chowkX - 55, chowkY - 55, 110, 110);

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SHRINGAR CHOWK', chowkX, chowkY - 8);
      ctx.font = '9px Outfit, sans-serif';
      ctx.fillStyle = '#b45309';
      ctx.fillText('Rathore Throne Plinth', chowkX, chowkY + 12);

      // --- LAYER 5: HISTORIC SIEGE CANNONS & BATTERY (KILKILA & BHAVANI) ---
      const cannons = [
        { x: 680, y: 180, label: 'Kilkila Cannon (1707 CE)' },
        { x: 1720, y: 180, label: 'Bhavani Cannon (Brass Siege)' }
      ];
      cannons.forEach((c) => {
        // Cannon Carriage Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y + 12, 34, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wooden Carriage Wheels
        ctx.fillStyle = '#451a03';
        ctx.fillRect(c.x - 22, c.y - 12, 44, 24);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.strokeRect(c.x - 22, c.y - 12, 44, 24);

        // Heavy Cast Bronze Barrel
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c.x - 7, c.y - 38, 14, 46);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(c.x - 7, c.y - 38, 14, 46);

        // Pyramidal Cannonballs Stack
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(c.x + 32, c.y, 6, 0, Math.PI * 2);
        ctx.arc(c.x + 44, c.y, 6, 0, Math.PI * 2);
        ctx.arc(c.x + 38, c.y - 8, 6, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.label, c.x, c.y + 36);
      });

      // --- LAYER 6: RANISAR STEPWELL WATERWORKS (EAST WING) ---
      const stepwellX = 1920;
      const stepwellY = 1120;
      // Stepwell Basin
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(stepwellX - 90, stepwellY - 90, 180, 180);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.strokeRect(stepwellX - 90, stepwellY - 90, 180, 180);
      // Stepped Stone Tiers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(stepwellX - 70, stepwellY - 70, 140, 140);
      ctx.strokeRect(stepwellX - 50, stepwellY - 50, 100, 100);
      // Deep Pool
      ctx.fillStyle = '#082f49';
      ctx.fillRect(stepwellX - 30, stepwellY - 30, 60, 60);
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RANISAR STEPWELL', stepwellX, stepwellY + 110);

      // --- LAYER 7: BHAKURCHEERIA FOUNDATION CLIFF & JAYAPOL GATEWAY LABELS ---
      const areaLabels = [
        { text: '🏰 JAYAPOL VICTORY GATEWAY (1806 CE)', x: 1850, y: 310 },
        { text: '⛰️ BHAKURCHEERIA HERMITAGE CLIFF (1459 CE)', x: 520, y: 320 },
        { text: '⚔️ MARWAR WEAPONRY RAMPARTS', x: 500, y: 1280 }
      ];
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillStyle = 'rgba(253, 224, 71, 0.75)';
      areaLabels.forEach((lbl) => {
        ctx.fillText(lbl.text, lbl.x, lbl.y);
      });

      // --- LAYER 8: 3 ANCIENT MONOLITHIC INSCRIPTION STATIONS ---
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

  const fragmentsCount = discoveredIds.length;
  const isAllFragmentsFound = fragmentsCount === 3;

  return (
    <div className="location-explore-screen mehrangarh-explore-screen" ref={containerRef}>
      {/* 2D Canvas Viewport */}
      <canvas ref={canvasRef} className="exploration-canvas" />

      {/* =================================================================== */}
      {/* 1. TOP EXPLORATION HUD                                              */}
      {/* =================================================================== */}
      <header className="exploration-top-hud">
        <div className="hud-left-group">
          <button 
            className="btn-hud-back"
            onClick={() => {
              sound.playClick();
              onReturnToMap();
            }}
            title="Return to Rajasthan Journey Hub"
          >
            &larr; Hub
          </button>
          <div className="hud-monument-identity">
            <span className="hud-realm-badge">MARWAR &bull; JODHPUR</span>
            <h1 className="hud-monument-title">MEHRANGARH FORT</h1>
          </div>
        </div>

        <div className="hud-center-objective">
          <div className="objective-box">
            <span className="objective-label">QUEST: THE HIDDEN INSCRIPTION</span>
            <strong className="objective-task">
              {isAllFragmentsFound ? '✓ All 3 Fragments Found! Decode Inscription' : 'Find the 3 Inscription Fragments in the fort'}
            </strong>
          </div>
          <div className="clues-counter-pill">
            <Scroll size={14} className="text-gold" />
            <span>FRAGMENTS: {fragmentsCount}/3</span>
          </div>
        </div>

        <div className="hud-right-stats">
          <div className="hud-stat-box" title="Explorer Lore Points">
            <Sparkles size={16} className="text-gold" />
            <span>{playerStats.xp} XP</span>
          </div>
          <div className="hud-stat-box" title="Sacred Relics">
            <Award size={16} className="text-emerald" />
            <span>{playerStats.unlockedRelics.length}/4</span>
          </div>
          {onOpenCodex && (
            <button 
              className="btn-hud-codex"
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
            className="btn-hud-sound"
            onClick={handleToggleSound}
            title={audioMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle Sound"
          >
            {audioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. ACHARYA VIKRAM GUIDE BAR                                         */}
      {/* =================================================================== */}
      <div className="exploration-guide-bar">
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
        <div className="guide-text-content">
          <strong>Acharya Vikram:</strong>
          <p>
            {isAllFragmentsFound 
              ? '“Excellent! All three inscription fragments are retrieved. Open the archeological decoder to reconstruct the founding chronicle of Rao Jodha!”' 
              : nearbyFragment 
                ? `“You are standing right beside ${nearbyFragment.shortTag}! Press E or tap Interact to inspect the weathered inscription.”` 
                : '“Explore the high ramparts and stepwell terraces. The stone inscriptions of 1459 CE are scattered throughout these courtyards.”'}
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. PROXIMITY INTERACTION PROMPT                                     */}
      {/* =================================================================== */}
      {nearbyFragment && !activeInspectionFragment && (
        <div className="proximity-interact-prompt animate-bounce">
          <Hand size={18} className="text-gold" />
          <div className="prompt-text">
            <strong>INSCRIPTION FRAGMENT</strong>
            <span>Press <strong>E</strong> or Tap to Inspect ({nearbyFragment.shortTag})</span>
          </div>
          <button 
            className="btn-interact-action"
            onClick={() => {
              sound.playChime();
              setActiveInspectionFragment(nearbyFragment);
            }}
          >
            INTERACT
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. FLOATING COLLECTION TOAST                                        */}
      {/* =================================================================== */}
      {collectionToast && (
        <div className="floating-clue-toast animate-slide-in" role="status">
          <Scroll size={22} className="text-gold" />
          <div className="toast-content">
            <strong>{collectionToast.title}</strong>
            <p>{collectionToast.subtitle}</p>
          </div>
          <span className="toast-xp">+{collectionToast.xp} XP</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. QUEST COMPLETE CELEBRATION OVERLAY (2.5s AUTO-FADE)              */}
      {/* =================================================================== */}
      {showQuestCelebration && (
        <div className="quest-celebration-overlay animate-fade-in" role="status">
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
        <div className="restoration-ready-dock animate-fade-in">
          <div className="ready-dock-content">
            <div className="dock-icon">
              <Scroll size={24} className="text-gold" />
            </div>
            <div className="dock-text">
              <strong>DECODE THE INSCRIPTION UNLOCKED</strong>
              <p>Reconstruct Rao Jodha’s 1459 CE chronicle to unlock the Mehrangarh Inscription Relic!</p>
            </div>
          </div>
          <button 
            className="btn-heritage-primary btn-large-cta pulse-gold"
            onClick={() => {
              sound.playFanfare();
              onStartMiniGame();
            }}
            id="begin-decoder-btn"
          >
            <span>DECODE THE INSCRIPTION</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. MOBILE VIRTUAL JOYSTICK & CONTROLS                               */}
      {/* =================================================================== */}
      <div className="mobile-touch-controls">
        <div 
          className="virtual-joystick-area"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (touch.clientX - centerX) / (rect.width / 2);
            const dy = (touch.clientY - centerY) / (rect.height / 2);
            handleJoystickMove({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (touch.clientX - centerX) / (rect.width / 2);
            const dy = (touch.clientY - centerY) / (rect.height / 2);
            handleJoystickMove({ x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) });
          }}
          onTouchEnd={handleJoystickEnd}
        >
          <div className="joystick-knob"></div>
        </div>

        {nearbyFragment && (
          <button 
            className="mobile-interact-btn pulse-gold"
            onClick={() => {
              sound.playChime();
              setActiveInspectionFragment(nearbyFragment);
            }}
          >
            <Hand size={22} />
            <span>INTERACT</span>
          </button>
        )}
      </div>

      {/* =================================================================== */}
      {/* 8. ACHARYA VIKRAM INTRO MODAL                                       */}
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
                  src="/assets/monuments/mehrangarh-fort/mehrangarh-fort.jpg" 
                  alt="Mehrangarh Fort Jodhpur" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/mehrangarh-fort-panorama.jpg';
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
      {/* 9. ENVIRONMENTAL DISCOVERY INSPECTION MODAL                         */}
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
                  src="/assets/monuments/mehrangarh-fort/mehrangarh-fort.jpg" 
                  alt={activeInspectionFragment.title} 
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/mehrangarh-fort-panorama.jpg';
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

            <div className="modal-footer">
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
      )}
    </div>
  );
}
