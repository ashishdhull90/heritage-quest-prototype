import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  Camera, 
  Shield, 
  X, 
  Layers, 
  ArrowLeft, 
  Check,
  Waves,
  Droplets,
  RotateCcw,
  Hand
} from 'lucide-react';
import { sound } from '../data/soundEffects';

/*
  Authentic 3D Features & Hotspots for Ranisar Lake
  Mapped to the visible zones of the authentic Ranisar Lake photograph:
  1. RANISAR LAKE: Center-foreground water edge
  2. WATER CONSERVATION: Northwest historic intake tower and conduits
  3. FORT AND LAKE LANDSCAPE: East elevated viewpoint overlooking fort ramparts
  4. STEPPED WATER ACCESS: Southwest stepped sandstone ghat descent
*/
const FEATURES_DATA = [
  {
    id: 'feature_ranisar_lake',
    number: 1,
    title: 'Ranisar Lake',
    category: 'RANISAR LAKE',
    icon: Waves,
    color: '#00d2ff',
    colorHex: 0x00d2ff,
    tagColor: 'rgba(0, 210, 255, 0.2)',
    pos: { x: 0, y: 0.8, z: -8 },
    image: '/assets/monuments/mehrangarh-fort/ranisar-lake.jpg',
    imageObjectPosition: 'center center',
    imageCaption: 'Authentic 15th-century Ranisar Lake reservoir nestled directly below Mehrangarh Fort',
    shortDesc: 'The historic perennial reservoir nestled directly at the foot of Mehrangarh Fort, serving as a primary water source for the citadel and old city.',
    lore: 'Ranisar Lake is a renowned historic water body situated at the base of Mehrangarh Fort’s rocky volcanic ridge. Commissioned in 1459 CE during the founding of Jodhpur by Rani Jasmade Hadi (queen of Rao Jodha), Ranisar was engineered to harvest natural runoff from the elevated fort slopes. For centuries, this perennial lake served as an indispensable water source, safeguarding the fort’s inhabitants and surrounding settlements against extreme desert aridity.',
    importance: 'The lake provided a reliable supply of fresh water that allowed the fortress to withstand prolonged sieges and severe dry seasons without depleting underground reserves.',
    didYouKnow: 'Ranisar Lake was built in close coordination with its twin reservoir, Padamsar Lake, creating a connected catchment network that gathered precious monsoon rainfall from across the rocky plateau.',
    xpReward: 20
  },
  {
    id: 'feature_water_conservation',
    number: 2,
    title: 'Water Conservation',
    category: 'WATER CONSERVATION',
    icon: Droplets,
    color: '#06b6d4',
    colorHex: 0x06b6d4,
    tagColor: 'rgba(6, 182, 212, 0.2)',
    pos: { x: -24, y: 1.8, z: -25 },
    image: '/assets/monuments/mehrangarh-fort/ranisar-lake.jpg',
    imageObjectPosition: 'left center',
    imageCaption: 'Historic stone waterworks intake pavilion, sluices, and rainwater runoff catchment conduits',
    shortDesc: 'Ingenious rainwater harvesting networks, stone intake conduits, and silt-trapping masonry designed to store water in Rajasthan’s arid climate.',
    lore: 'In the arid environment of western Rajasthan, water conservation was fundamental to survival and governance. Engineers at Mehrangarh devised extensive catchment systems carved directly into the volcanic rock to direct rainwater down the hillside into Ranisar. Stone barriers, intake conduits, and silt-trapping masonry ensured minimal evaporation and maintained clean water throughout scorching summer months.',
    importance: 'This sophisticated hydrological planning turned a dry desert ridge into a sustainable stronghold capable of sustaining royalty, garrison troops, and animals year-round.',
    didYouKnow: 'Traditional Marwar water systems relied on strict community stewardship and precision gravity conduits, capturing seasonal monsoon downpours with virtually zero water loss.',
    xpReward: 20
  },
  {
    id: 'feature_fort_landscape',
    number: 3,
    title: 'Fort and Lake Landscape',
    category: 'FORT AND LAKE LANDSCAPE',
    icon: Shield,
    color: '#f59e0b',
    colorHex: 0xf59e0b,
    tagColor: 'rgba(245, 158, 11, 0.2)',
    pos: { x: 24, y: 3.5, z: 2 },
    image: '/assets/monuments/mehrangarh-fort/ranisar-lake.jpg',
    imageObjectPosition: 'center top',
    imageCaption: 'Towering red sandstone curtain walls and battlements of Mehrangarh Fort rising above Ranisar Lake',
    shortDesc: 'The dramatic visual harmony and military integration between Mehrangarh’s soaring sandstone battlements and the lake basin below.',
    lore: 'The visual synergy between Mehrangarh Fort and Ranisar Lake illustrates masterly Rajput landscape engineering. Towering red sandstone battlements rise sharply from the natural cliff face directly above the calm water basin. This strategic layout not only provided an awe-inspiring panorama but also ensured the lake was fully protected and monitored from the high bastions above.',
    importance: 'The positioning of the fort on the rocky crest combined military supremacy with direct control over the region’s most precious natural resource.',
    didYouKnow: 'The sheer height of Mehrangarh’s curtain walls casts broad shadows across sections of the lake basin during the day, naturally reducing water evaporation rates beneath the hot desert sun.',
    xpReward: 20
  },
  {
    id: 'feature_stepped_access',
    number: 4,
    title: 'Stepped Water Access',
    category: 'STEPPED WATER ACCESS',
    icon: Layers,
    color: '#10b981',
    colorHex: 0x10b981,
    tagColor: 'rgba(16, 185, 129, 0.2)',
    pos: { x: -16, y: 1.2, z: 14 },
    image: '/assets/monuments/mehrangarh-fort/ranisar-lake.jpg',
    imageObjectPosition: 'left bottom',
    imageCaption: 'Multi-tiered sandstone ghat stairs carved for safe pedestrian access across shifting water levels',
    shortDesc: 'Carved sandstone terraces, descending ghat stairs, and fortified access pathways adapting to seasonal water fluctuations.',
    lore: 'Surrounding the perimeter of Ranisar Lake are carefully engineered stepped stone structures, known as ghats, built with durable local sandstone. These broad flights of stone steps adapt smoothly to fluctuating seasonal water levels, allowing safe and direct access to the water whether after monsoon rains or during dry spells. Reinforced retaining walls and parapets guard the perimeter against erosion and flash runoff.',
    importance: 'The stepped ghat architecture represents a hallmark of historic Indian water engineering, combining practical utility, structural resilience, and civic elegance.',
    didYouKnow: 'The multi-tiered stone steps were laid with precision interlocking masonry, allowing water to filter naturally while preventing slope collapses during heavy desert cloudbursts.',
    xpReward: 20
  }
];

const STORAGE_KEY = 'heritage_ranisar_lake_3d_mastered_features';
const MASTERY_KEY = 'heritage_ranisar_lake_3d_mastery_awarded';

// Helper: Create 3D floating sprite label for each clue marker
function createTextSprite(text, color = '#38bdf8') {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  // Background capsule
  ctx.fillStyle = 'rgba(7, 15, 28, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(8, 8, 368, 80, 22);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 192, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true, 
    depthTest: false 
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(6.5, 1.625, 1);
  return sprite;
}

export default function RanisarLakeExploreScreen({
  location: _location,
  playerStats,
  onCompleteRanisarLake,
  onReturnToFort,
  onOpenCodex,
  onClaimExplorationXP
}) {
  const mountRef = useRef(null);

  // Active UI modal & mastery state
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [nearbyFeature, setNearbyFeature] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [discoveryToast, setDiscoveryToast] = useState(null);

  // Feature Discovery & Mastery State (Independent Persistence)
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read Ranisar Lake discoveries from localStorage', e);
    }
    return [];
  });

  const [hasAwardedMastery, setHasAwardedMastery] = useState(() => {
    try {
      return localStorage.getItem(MASTERY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Save mastered features to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteredIds));
    } catch (err) {
      console.warn('Could not save Ranisar Lake discoveries', err);
    }
  }, [masteredIds]);

  // Player position & input state for 3D navigation (Spawn on lower stone landing)
  const playerState = useRef({
    x: -2,
    y: 1.0,
    z: 16,
    angle: 0,
    speed: 0,
    vx: 0,
    vz: 0
  });

  const keysRef = useRef({});
  const joystickVector = useRef({ x: 0, y: 0, active: false });
  const [joystickUI, setJoystickUI] = useState({ x: 0, y: 0, active: false });
  
  // Elevated, forward-looking camera angle so the soaring Mehrangarh Fort walls and lake are clearly visible
  const cameraOrbit = useRef({ angle: Math.PI, pitch: 0.12, distance: 13.5 });
  const isPointerDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0, orbitAngle: 0, orbitPitch: 0 });

  // Reset Player to start viewpoint
  const handleResetCamera = useCallback(() => {
    sound.playClick();
    playerState.current.x = -2;
    playerState.current.y = 1.0;
    playerState.current.z = 16;
    cameraOrbit.current = { angle: Math.PI, pitch: 0.12, distance: 13.5 };
  }, []);

  // Mark Feature Mastered Handler
  const handleMasterFeature = (feature) => {
    sound.playSuccess();
    if (!masteredIds.includes(feature.id)) {
      const nextMastered = [...masteredIds, feature.id];
      setMasteredIds(nextMastered);

      setDiscoveryToast({
        title: feature.title,
        category: feature.category,
        xp: feature.xpReward
      });
      setTimeout(() => setDiscoveryToast(null), 2400);

      if (onClaimExplorationXP) {
        onClaimExplorationXP(feature.xpReward);
      }

      if (nextMastered.length === FEATURES_DATA.length && !hasAwardedMastery) {
        setHasAwardedMastery(true);
        try {
          localStorage.setItem(MASTERY_KEY, 'true');
        } catch {
          // localStorage fallback
        }
        setTimeout(() => {
          sound.playVictoryFanfare();
          setShowCelebration(true);
          if (onCompleteRanisarLake) {
            onCompleteRanisarLake({ xpAward: 80 });
          }
        }, 500);
      }
    }
  };

  // Keyboard navigation & inspection shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedFeature || showPhotoModal || showCelebration) {
        if (e.key === 'Escape') {
          if (selectedFeature) setSelectedFeature(null);
          if (showPhotoModal) setShowPhotoModal(false);
          if (showCelebration) setShowCelebration(false);
        }
        return;
      }

      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      // E or Space to Inspect Nearby Feature
      if ((key === 'e' || key === ' ') && nearbyFeature) {
        e.preventDefault();
        sound.playChime();
        setSelectedFeature(nearbyFeature);
      }

      if (key === 'r') {
        handleResetCamera();
      }

      if (key === 'escape') {
        onReturnToFort();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedFeature, showPhotoModal, showCelebration, nearbyFeature, handleResetCamera, onReturnToFort]);

  // =========================================================================
  // THREE.JS PHOTO-BASED 3D ENVIRONMENT INITIALIZATION & GAME LOOP
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene Setup with Alpha Transparency for Realistic Photo Integration
    const scene = new THREE.Scene();

    // 2. Camera Setup (Higher viewpoint with forward gaze)
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 800);
    camera.position.set(0, 6.5, 26);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting for 3D Character, Markers & Shadows
    const ambientLight = new THREE.HemisphereLight(0xfff5e6, 0x1e3a5f, 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    sunLight.position.set(40, 70, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);

    const lakeGlowLight = new THREE.PointLight(0x38bdf8, 1.2, 80);
    lakeGlowLight.position.set(0, 4, -10);
    scene.add(lakeGlowLight);

    // 5. Authentic 3D Walkable Ghats & Shoreline Mesh
    const stageGroup = new THREE.Group();

    // Sandstone Ground & Steps Material
    const ghatStoneMat = new THREE.MeshStandardMaterial({
      color: 0xba8558,
      roughness: 0.85,
      metalness: 0.05,
      transparent: true,
      opacity: 0.72
    });

    // Walkable Promenade & Lower Landing
    const promenadeGeo = new THREE.BoxGeometry(80, 1.2, 16);
    const promenade = new THREE.Mesh(promenadeGeo, ghatStoneMat);
    promenade.position.set(0, 0.4, 4);
    promenade.receiveShadow = true;
    stageGroup.add(promenade);

    // Stepped Stone Ghats leading down to water
    for (let step = 0; step < 8; step++) {
      const stepWidth = 44 - step * 1.5;
      const stepGeo = new THREE.BoxGeometry(stepWidth, 0.5, 2.4);
      const stepMesh = new THREE.Mesh(stepGeo, ghatStoneMat);
      stepMesh.position.set(-12, step * 0.45, 8 + step * 2.0);
      stepMesh.receiveShadow = true;
      stepMesh.castShadow = true;
      stageGroup.add(stepMesh);
    }

    // Overlook Terrace (Feature 3 Location)
    const terraceGeo = new THREE.BoxGeometry(22, 3.8, 18);
    const terrace = new THREE.Mesh(terraceGeo, ghatStoneMat);
    terrace.position.set(24, 1.8, 2);
    terrace.receiveShadow = true;
    stageGroup.add(terrace);

    // Transparent Animated 3D Water Surface over the Lake Basin
    const waterGeo = new THREE.PlaneGeometry(120, 85, 48, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x056b78,
      roughness: 0.12,
      metalness: 0.75,
      transparent: true,
      opacity: 0.52
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, 0, -18);
    waterMesh.receiveShadow = true;
    stageGroup.add(waterMesh);

    scene.add(stageGroup);

    // Save initial water vertex positions for ripple dynamics
    const waterPosAttr = waterGeo.attributes.position;
    const waterBaseY = new Float32Array(waterPosAttr.count);
    for (let i = 0; i < waterPosAttr.count; i++) {
      waterBaseY[i] = waterPosAttr.getZ(i);
    }

    // 6. 3D Player Character Avatar (Stylized Royal Explorer)
    const playerGroup = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.4, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    playerGroup.add(body);

    // Royal Sash
    const sashGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.25, 12);
    const sashMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.4 });
    const sash = new THREE.Mesh(sashGeo, sashMat);
    sash.position.y = 0.85;
    playerGroup.add(sash);

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.7 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    head.castShadow = true;
    playerGroup.add(head);

    // Royal Turban (Pagri)
    const turbanGeo = new THREE.TorusGeometry(0.36, 0.16, 8, 16);
    const turbanMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
    const turban = new THREE.Mesh(turbanGeo, turbanMat);
    turban.rotation.x = Math.PI / 2;
    turban.position.y = 1.95;
    turban.castShadow = true;
    playerGroup.add(turban);

    // Explorer Lantern Glow
    const lanternGeo = new THREE.SphereGeometry(0.16, 8, 8);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0.6, 1.1, 0.4);
    playerGroup.add(lantern);

    const lanternLight = new THREE.PointLight(0xfef08a, 0.9, 14);
    lanternLight.position.set(0.6, 1.1, 0.4);
    playerGroup.add(lanternLight);

    // Dynamic Ground Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(0.75, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.02;
    playerGroup.add(shadowDisc);

    playerGroup.position.set(playerState.current.x, playerState.current.y, playerState.current.z);
    scene.add(playerGroup);

    // 7. 4 Clean 3D Clue Markers with 3D Floating Labels
    const beaconMeshes = [];

    FEATURES_DATA.forEach((feat) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(feat.pos.x, feat.pos.y, feat.pos.z);

      // Rotating Crystal Beacon
      const crystalGeo = new THREE.OctahedronGeometry(0.75, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: feat.colorHex,
        emissive: feat.colorHex,
        emissiveIntensity: 0.7,
        roughness: 0.18,
        metalness: 0.85
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = 1.6;
      crystal.castShadow = true;
      bGroup.add(crystal);

      // Orbiting Ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: feat.colorHex });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 1.6;
      ring.rotation.x = Math.PI / 3;
      bGroup.add(ring);

      // Ground Aura Disc
      const auraGeo = new THREE.RingGeometry(0.35, 1.8, 24);
      const auraMat = new THREE.MeshBasicMaterial({ 
        color: feat.colorHex, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.45 
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.y = 0.05;
      bGroup.add(aura);

      // 3D Floating Text Label (e.g. ◉ Ranisar Lake)
      const labelSprite = createTextSprite(`◉ ${feat.title}`, feat.color);
      labelSprite.position.set(0, 3.4, 0);
      bGroup.add(labelSprite);

      // Point light
      const bLight = new THREE.PointLight(feat.colorHex, 1.2, 10);
      bLight.position.y = 1.6;
      bGroup.add(bLight);

      scene.add(bGroup);

      beaconMeshes.push({
        id: feat.id,
        group: bGroup,
        crystal,
        ring,
        aura,
        data: feat
      });
    });

    // 8. Mouse / Touch Camera Orbit Listeners
    const onMouseDown = (e) => {
      isPointerDown.current = true;
      pointerStart.current = {
        x: e.clientX,
        y: e.clientY,
        orbitAngle: cameraOrbit.current.angle,
        orbitPitch: cameraOrbit.current.pitch
      };
    };

    const onMouseMove = (e) => {
      if (!isPointerDown.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      cameraOrbit.current.angle = pointerStart.current.orbitAngle - dx * 0.008;
      cameraOrbit.current.pitch = Math.max(0.04, Math.min(0.65, pointerStart.current.orbitPitch + dy * 0.006));
    };

    const onMouseUp = () => {
      isPointerDown.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraOrbit.current.distance = Math.max(6, Math.min(22, cameraOrbit.current.distance + e.deltaY * 0.015));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // Touch handlers for look & orbit
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = domElem.getBoundingClientRect();
        if (touch.clientX - rect.left > rect.width * 0.35) {
          isPointerDown.current = true;
          pointerStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            orbitAngle: cameraOrbit.current.angle,
            orbitPitch: cameraOrbit.current.pitch
          };
        }
      }
    };

    const onTouchMove = (e) => {
      if (isPointerDown.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - pointerStart.current.x;
        const dy = touch.clientY - pointerStart.current.y;
        cameraOrbit.current.angle = pointerStart.current.orbitAngle - dx * 0.01;
        cameraOrbit.current.pitch = Math.max(0.04, Math.min(0.65, pointerStart.current.orbitPitch + dy * 0.008));
      }
    };

    const onTouchEnd = () => {
      isPointerDown.current = false;
    };

    domElem.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Window resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 9. Main Animation & Game Physics Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // --- A. ANIMATE WATER RIPPLES ---
      const count = waterPosAttr.count;
      for (let i = 0; i < count; i++) {
        const u = waterPosAttr.getX(i);
        const v = waterPosAttr.getY(i);
        const wave = Math.sin(u * 0.18 + time * 1.6) * 0.22 +
                     Math.cos(v * 0.22 + time * 1.3) * 0.18;
        waterPosAttr.setZ(i, waterBaseY[i] + wave);
      }
      waterPosAttr.needsUpdate = true;
      waterGeo.computeVertexNormals();

      // --- B. ANIMATE 3D BEACONS ---
      beaconMeshes.forEach(({ crystal, ring, aura, data }) => {
        crystal.rotation.y = time * 1.4;
        crystal.rotation.x = Math.sin(time * 1.2) * 0.2;
        crystal.position.y = 1.6 + Math.sin(time * 2.5 + data.number) * 0.2;

        ring.rotation.z = -time * 1.6;
        ring.rotation.y = time * 0.8;

        const isM = masteredIds.includes(data.id);
        const pulse = 1.0 + Math.sin(time * 3.0 + data.number) * 0.18;
        aura.scale.set(pulse, pulse, pulse);
        aura.material.opacity = isM ? 0.8 : 0.45;
      });

      // --- C. PLAYER MOVEMENT & PHYSICS ---
      let moveForward = 0;
      let moveRight = 0;

      if (!selectedFeature && !showPhotoModal && !showCelebration) {
        const keys = keysRef.current;
        if (keys['w'] || keys['arrowup']) moveForward += 1;
        if (keys['s'] || keys['arrowdown']) moveForward -= 1;
        if (keys['d'] || keys['arrowright']) moveRight += 1;
        if (keys['a'] || keys['arrowleft']) moveRight -= 1;

        if (joystickVector.current.active) {
          moveForward -= joystickVector.current.y;
          moveRight += joystickVector.current.x;
        }
      }

      const inputMag = Math.hypot(moveForward, moveRight);
      const moveSpeed = 11.0;

      if (inputMag > 0.05) {
        const camAngle = cameraOrbit.current.angle;
        const forwardX = -Math.sin(camAngle);
        const forwardZ = -Math.cos(camAngle);
        const rightX = Math.cos(camAngle);
        const rightZ = -Math.sin(camAngle);

        const normF = moveForward / (inputMag > 1 ? inputMag : 1);
        const normR = moveRight / (inputMag > 1 ? inputMag : 1);

        const dx = (forwardX * normF + rightX * normR) * moveSpeed * delta;
        const dz = (forwardZ * normF + rightZ * normR) * moveSpeed * delta;

        playerState.current.vx = dx;
        playerState.current.vz = dz;
        playerState.current.x += dx;
        playerState.current.z += dz;
        playerState.current.angle = Math.atan2(dx, dz);

        playerGroup.position.y = playerState.current.y + Math.abs(Math.sin(time * 12)) * 0.15;
      } else {
        playerState.current.vx *= 0.8;
        playerState.current.vz *= 0.8;
        playerGroup.position.y = playerState.current.y;
      }

      // Clamp Player inside walkable Ranisar Lake perimeter
      playerState.current.x = Math.max(-44, Math.min(44, playerState.current.x));
      playerState.current.z = Math.max(-38, Math.min(32, playerState.current.z));

      // Calculate terrain height under player
      let targetY = 0.5;
      if (playerState.current.z > 0 && playerState.current.x > 14) {
        // High overlook terrace (Feature 3)
        targetY = 3.5;
      } else if (playerState.current.z > 6 && playerState.current.x < 10) {
        // Stepped ghats slope (Feature 4)
        targetY = 0.4 + (playerState.current.z - 6) * 0.18;
      } else if (playerState.current.z < -10 && playerState.current.x < -14) {
        // Central tower access (Feature 2)
        targetY = 1.8;
      }
      playerState.current.y = THREE.MathUtils.lerp(playerState.current.y, targetY, 0.15);

      playerGroup.position.x = playerState.current.x;
      playerGroup.position.z = playerState.current.z;
      playerGroup.rotation.y = playerState.current.angle;

      // --- D. 3D FOLLOW CAMERA ---
      const orbit = cameraOrbit.current;
      const camTargetX = playerState.current.x;
      const camTargetY = playerState.current.y + 1.8;
      const camTargetZ = playerState.current.z;

      const camX = camTargetX + Math.sin(orbit.angle) * orbit.distance * Math.cos(orbit.pitch);
      const camY = camTargetY + Math.sin(orbit.pitch) * orbit.distance + 1.0;
      const camZ = camTargetZ + Math.cos(orbit.angle) * orbit.distance * Math.cos(orbit.pitch);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(camTargetX, camTargetY, camTargetZ);

      // --- E. PROXIMITY DETECTION TO 4 3D FEATURES (PRECISE RADIUS) ---
      let foundNearby = null;
      FEATURES_DATA.forEach((feat) => {
        const dist = Math.hypot(
          playerState.current.x - feat.pos.x,
          playerState.current.z - feat.pos.z
        );
        if (dist <= 6.5) {
          foundNearby = feat;
        }
      });
      setNearbyFeature(foundNearby);

      // Render 3D Scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      domElem.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [masteredIds, selectedFeature, showPhotoModal, showCelebration]);

  // Mobile Virtual Joystick Touch Handlers
  const handleJoystickTouchStart = (e) => {
    if (selectedFeature || showPhotoModal || showCelebration) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxR = rect.width / 2;
    const normX = dx / (dist > maxR ? dist : maxR);
    const normY = dy / (dist > maxR ? dist : maxR);

    joystickVector.current = { x: normX, y: normY, active: true };
    setJoystickUI({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchMove = (e) => {
    if (!joystickVector.current.active) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxR = rect.width / 2;
    const normX = dx / (dist > maxR ? dist : maxR);
    const normY = dy / (dist > maxR ? dist : maxR);

    joystickVector.current = { x: normX, y: normY, active: true };
    setJoystickUI({ x: normX, y: normY, active: true });
  };

  const handleJoystickTouchEnd = () => {
    joystickVector.current = { x: 0, y: 0, active: false };
    setJoystickUI({ x: 0, y: 0, active: false });
  };

  const masteredCount = masteredIds.length;
  const progressPercent = Math.round((masteredCount / FEATURES_DATA.length) * 100);
  const isAllMastered = masteredCount === FEATURES_DATA.length;

  return (
    <div className="sheesh-mahal-master-screen ranisar-lake-3d-screen" role="region" aria-label="Ranisar Lake 3D Exploration">
      {/* ===================================================================== */}
      {/* 1. TOP 3D EXPLORATION HUD BAR                                         */}
      {/* ===================================================================== */}
      <div className="sheesh-hud-bar ranisar-lake-hud-bar">
        <div className="sheesh-hud-left">
          <button 
            className="sheesh-back-btn ranisar-lake-back-btn"
            onClick={() => {
              sound.playClick();
              onReturnToFort();
            }}
            title="Return to Mehrangarh Courtyard"
          >
            <ArrowLeft size={16} />
            <span>&larr; Courtyard</span>
          </button>

          <div className="sheesh-title-pill">
            <span className="sheesh-state-prefix" style={{ color: '#00d2ff' }}>MEHRANGARH FORT &bull; 3D REALM</span>
            <h1 className="sheesh-location-title" style={{ color: '#f0f9ff' }}>RANISAR LAKE 3D EXPLORATION</h1>
          </div>
        </div>

        <div className="sheesh-hud-center">
          <div className="sheesh-progress-capsule" role="status" aria-label={`3D Exploration progress ${masteredCount} of 4 features mastered`}>
            <div className="progress-info-row">
              <span className="progress-title" style={{ color: '#bae6fd' }}>3D HISTORIC FEATURE MASTERY</span>
              <span className="progress-score" style={{ color: isAllMastered ? '#10b981' : '#00d2ff' }}>
                {masteredCount} / {FEATURES_DATA.length} MASTERED
              </span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${progressPercent}%`,
                  background: isAllMastered 
                    ? 'linear-gradient(90deg, #10b981, #34d399)' 
                    : 'linear-gradient(90deg, #0284c7, #00d2ff)'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="sheesh-hud-right">
          <button 
            className="sheesh-hud-action-chip"
            onClick={() => {
              sound.playClick();
              setShowPhotoModal(true);
            }}
            title="View Official Reference Photograph"
            style={{ background: 'rgba(0, 210, 255, 0.15)', borderColor: 'rgba(0, 210, 255, 0.45)', color: '#7dd3fc' }}
          >
            <Camera size={15} />
            <span>Reference Photo</span>
          </button>

          <button 
            className="sheesh-hud-action-chip"
            onClick={handleResetCamera}
            title="Reset Camera & Player Position (R)"
          >
            <RotateCcw size={15} />
            <span>Reset Cam</span>
          </button>

          <div className="sheesh-xp-pill-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#7dd3fc' }}>
            <Sparkles size={14} />
            <span>{playerStats?.xp || 0} XP</span>
          </div>

          {onOpenCodex && (
            <button 
              className="sheesh-hud-action-chip"
              onClick={() => {
                sound.playClick();
                onOpenCodex();
              }}
              title="Open Heritage Codex"
            >
              <BookOpen size={15} />
              <span>Codex</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN PHOTO-BASED 3D WEBGL VIEWPORT                                 */}
      {/* ===================================================================== */}
      <div 
        className="ranisar-3d-viewport-container" 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: 'calc(100% - 62px)', 
          overflow: 'hidden', 
          background: '#0a1726' 
        }}
      >
        {/* Authentic Ranisar Lake Full-Color Photograph Backdrop (Focal view framing Mehrangarh Fort & Lake) */}
        <div 
          className="ranisar-photo-backdrop-layer"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/assets/monuments/mehrangarh-fort/ranisar-lake.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.98) contrast(1.04)',
            zIndex: 1
          }}
        />

        {/* 3D WebGL Canvas Layer overlaying the realistic photograph */}
        <div 
          ref={mountRef} 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 2, 
            cursor: 'grab' 
          }} 
        />

        {/* 3D Location Badge Overlay */}
        <div style={{ position: 'absolute', top: '16px', left: '20px', zIndex: 10, background: 'rgba(10, 20, 35, 0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0, 210, 255, 0.35)', borderRadius: '8px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass size={18} className="text-cyan-400" style={{ color: '#00d2ff' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e0f2fe', letterSpacing: '0.05em' }}>
            PHOTO-REALISTIC 3D REALM
          </span>
        </div>

        {/* 4 Features Checklist Mini-Dock (Top-Right) */}
        <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 10, background: 'rgba(10, 20, 35, 0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0, 210, 255, 0.35)', borderRadius: '8px', padding: '0.6rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00d2ff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            3D DISCOVERIES ({masteredCount}/4)
          </span>
          {FEATURES_DATA.map((feat) => {
            const isM = masteredIds.includes(feat.id);
            return (
              <div 
                key={feat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedFeature(feat);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.78rem',
                  color: isM ? '#34d399' : '#cbd5e1',
                  cursor: 'pointer'
                }}
                role="button"
                tabIndex={0}
              >
                {isM ? <CheckCircle2 size={13} className="text-emerald-400" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: feat.color }}></div>}
                <span>{feat.number}. {feat.category}</span>
              </div>
            );
          })}
        </div>

        {/* Proximity Interaction Prompt (Bottom Center - Only appears when within range) */}
        {nearbyFeature && !selectedFeature && (
          <div className="proximity-interact-prompt animate-bounce" style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <Hand size={18} className="text-gold" />
            <div className="prompt-text">
              <strong>{nearbyFeature.category}</strong>
              <span>Press <strong>E</strong> or Tap to Inspect ({nearbyFeature.title})</span>
            </div>
            <button 
              className="btn-interact-action"
              onClick={() => {
                sound.playChime();
                setSelectedFeature(nearbyFeature);
              }}
              style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', borderColor: '#00d2ff' }}
            >
              INSPECT 3D FEATURE
            </button>
          </div>
        )}

        {/* Desktop Controls Hint Bar (Bottom Left) */}
        <div style={{ position: 'absolute', bottom: '16px', left: '20px', zIndex: 10, background: 'rgba(5, 12, 22, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '0.35rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span><strong style={{ color: '#f8fafc' }}>WASD / Arrows</strong> Walk</span>
          <span>&bull;</span>
          <span><strong style={{ color: '#f8fafc' }}>Drag Mouse</strong> Look Around</span>
          <span>&bull;</span>
          <span><strong style={{ color: '#00d2ff' }}>E / Space</strong> Inspect</span>
        </div>

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
          aria-label="3D Movement Joystick"
          style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 25 }}
        >
          <div className="joystick-base-circle">
            <div 
              className="joystick-stick-knob"
              style={{
                transform: `translate(${joystickUI.x * 26}px, ${joystickUI.y * 26}px)`
              }}
            ></div>
          </div>
          <span className="joystick-label">TOUCH TO WALK</span>
        </div>

        {/* Mobile Action Button (Lower-Right) */}
        <div className="mobile-action-touchzone" style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 25 }}>
          <button
            className={`btn-mobile-action-interact ${nearbyFeature ? 'interact-active pulse-gold' : 'interact-idle'}`}
            onClick={() => {
              if (nearbyFeature) {
                sound.playChime();
                setSelectedFeature(nearbyFeature);
              }
            }}
            disabled={!nearbyFeature}
            aria-label="Interact Button"
            style={{ borderColor: nearbyFeature ? '#00d2ff' : 'rgba(255,255,255,0.2)' }}
          >
            <Hand size={22} />
            <span>{nearbyFeature ? 'INSPECT' : 'MOVE NEAR'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. FEATURE KNOWLEDGE PANEL WITH RELEVANT REAL PHOTO AT TOP            */}
      {/* ===================================================================== */}
      {selectedFeature && (
        <div 
          className="modal-overlay sheesh-feature-modal-overlay"
          onClick={() => setSelectedFeature(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feature-modal-title"
        >
          <div 
            className="modal-content sheesh-feature-modal-card animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: selectedFeature.color, maxWidth: '620px' }}
          >
            {/* Modal Header */}
            <div className="sheesh-modal-header" style={{ borderBottomColor: selectedFeature.color }}>
              <div className="sheesh-modal-header-left">
                <span 
                  className="modal-feature-category-pill"
                  style={{ 
                    background: selectedFeature.tagColor,
                    color: selectedFeature.color,
                    borderColor: selectedFeature.color
                  }}
                >
                  3D FEATURE #{selectedFeature.number} &bull; {selectedFeature.category}
                </span>
                <h2 id="feature-modal-title" className="modal-feature-title">{selectedFeature.title}</h2>
              </div>
              <button 
                className="sheesh-modal-close-btn"
                onClick={() => setSelectedFeature(null)}
                aria-label="Close feature details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body with Relevant Photo at Top + Clean Hierarchy */}
            <div className="sheesh-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {/* Relevant Authentic Photograph at the Top of the Knowledge Panel */}
              <div 
                className="modal-feature-photo-container" 
                style={{ 
                  marginBottom: '1.25rem', 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  border: `1px solid ${selectedFeature.color}`, 
                  background: '#050c17' 
                }}
              >
                <img 
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  style={{
                    width: '100%',
                    height: '210px',
                    objectFit: 'cover',
                    objectPosition: selectedFeature.imageObjectPosition || 'center center',
                    display: 'block'
                  }}
                />
                <div 
                  style={{ 
                    padding: '0.45rem 0.85rem', 
                    background: 'rgba(5, 12, 22, 0.92)', 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                    fontSize: '0.78rem', 
                    color: '#94a3b8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem' 
                  }}
                >
                  <Camera size={13} style={{ color: selectedFeature.color, flexShrink: 0 }} />
                  <span>{selectedFeature.imageCaption}</span>
                </div>
              </div>

              {/* Short Summary Lead */}
              <p className="feature-short-lead" style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#e2e8f0', marginBottom: '1rem' }}>
                {selectedFeature.shortDesc}
              </p>

              {/* WHY IT MATTERS */}
              <div className="feature-importance-card" style={{ borderColor: selectedFeature.color, marginBottom: '1rem' }}>
                <strong style={{ color: selectedFeature.color, display: 'block', marginBottom: '0.25rem' }}>
                  WHY IT MATTERS:
                </strong>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.45 }}>{selectedFeature.importance}</p>
              </div>

              {/* KEY FACTS & HISTORICAL LORE */}
              <div className="feature-lore-block" style={{ marginBottom: '1rem' }}>
                <h4 className="feature-lore-heading" style={{ color: selectedFeature.color, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  KEY FACTS & HISTORICAL LORE:
                </h4>
                <p style={{ fontSize: '0.86rem', lineHeight: 1.5, color: '#cbd5e1' }}>{selectedFeature.lore}</p>
              </div>

              {/* Did You Know? */}
              <div className="feature-did-you-know-card" style={{ borderColor: 'rgba(0, 210, 255, 0.35)' }}>
                <div className="dyk-icon-frame" style={{ background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff' }}>
                  <Sparkles size={16} />
                </div>
                <div className="dyk-content">
                  <strong style={{ color: '#7dd3fc' }}>Did You Know?</strong>
                  <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.4 }}>{selectedFeature.didYouKnow}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer (Explicit "MARK AS MASTERED" Button) */}
            <div className="sheesh-modal-footer">
              <button 
                className="btn-heritage-secondary"
                onClick={() => setSelectedFeature(null)}
              >
                Close
              </button>

              {masteredIds.includes(selectedFeature.id) ? (
                <div className="feature-already-mastered-pill">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span>✓ FEATURE MASTERED (+{selectedFeature.xpReward} XP EARNED)</span>
                </div>
              ) : (
                <button 
                  className="btn-heritage-primary btn-large-cta pulse-gold"
                  onClick={() => {
                    handleMasterFeature(selectedFeature);
                  }}
                  id="mark-ranisar-3d-feature-mastered-btn"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', borderColor: '#00d2ff' }}
                >
                  <Check size={18} />
                  <span>MARK AS MASTERED (+{selectedFeature.xpReward} XP)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. REFERENCE PHOTOGRAPH LIGHTBOX MODAL                                */}
      {/* ===================================================================== */}
      {showPhotoModal && (
        <div 
          className="modal-overlay sheesh-gallery-lightbox-overlay"
          onClick={() => setShowPhotoModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="sheesh-gallery-lightbox-card animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px' }}
          >
            <div className="lightbox-header">
              <div className="lightbox-title-wrap">
                <h3>Ranisar Lake & Mehrangarh Fort</h3>
                <span>Authentic Full-Color Photograph &bull; Jodhpur</span>
              </div>
              <button 
                className="sheesh-modal-close-btn"
                onClick={() => setShowPhotoModal(false)}
                aria-label="Close reference photo"
              >
                <X size={20} />
              </button>
            </div>

            <div className="lightbox-image-container" style={{ padding: '0.75rem', background: '#050c17' }}>
              <img 
                src="/assets/monuments/mehrangarh-fort/ranisar-lake.jpg" 
                alt="Authentic Ranisar Lake Photograph"
                className="lightbox-full-image"
                style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', borderRadius: '6px' }}
              />
            </div>

            <div className="lightbox-footer">
              <p>
                The authentic 15th-century Ranisar Lake reservoir situated directly below the soaring sandstone fortifications of Mehrangarh Fort in Jodhpur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. FLOATING DISCOVERY REWARD TOAST                                    */}
      {/* ===================================================================== */}
      {discoveryToast && (
        <div className="sheesh-discovery-toast animate-slide-up" role="status">
          <div className="discovery-toast-icon">
            <CheckCircle2 size={22} className="text-emerald-400" />
          </div>
          <div className="discovery-toast-text">
            <span className="toast-headline">3D FEATURE MASTERED!</span>
            <strong className="toast-title">{discoveryToast.title}</strong>
          </div>
          <span className="toast-xp-tag">+{discoveryToast.xp} XP</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MASTERY CELEBRATION MODAL (TRIGGERED WHEN 4/4 MASTERED)           */}
      {/* ===================================================================== */}
      {showCelebration && (
        <div 
          className="modal-overlay sheesh-mastery-celebration-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowCelebration(false)}
        >
          <div 
            className="sheesh-mastery-celebration-card ranisar-mastery-card animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="celebration-badge-frame pulse-gold" style={{ background: 'rgba(0, 210, 255, 0.2)', borderColor: '#00d2ff' }}>
              <Waves size={40} style={{ color: '#00d2ff' }} />
            </div>

            <span className="celebration-pre-title" style={{ color: '#00d2ff' }}>3D LOCATION MASTERED</span>
            <h2 className="celebration-hero-title">RANISAR LAKE COMPLETE!</h2>
            <p className="celebration-hero-desc">
              You have thoroughly explored the 3D realm and mastered all 4 historic features of Ranisar Lake at Mehrangarh Fort!
            </p>

            <div className="celebration-stats-strip">
              <div className="stat-box" style={{ background: 'rgba(0, 210, 255, 0.1)', borderColor: 'rgba(0, 210, 255, 0.3)' }}>
                <span className="stat-label">FEATURES MASTERED</span>
                <strong className="stat-value" style={{ color: '#00d2ff' }}>4 / 4</strong>
              </div>
              <div className="stat-box" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <span className="stat-label">LOCATION BONUS</span>
                <strong className="stat-value text-emerald-400">+80 XP</strong>
              </div>
            </div>

            <div className="celebration-action-buttons">
              <button 
                className="btn-heritage-secondary"
                onClick={() => setShowCelebration(false)}
              >
                Continue Walking Around Lake
              </button>
              <button 
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playClick();
                  setShowCelebration(false);
                  onReturnToFort();
                }}
                style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', borderColor: '#00d2ff' }}
              >
                <span>Return to Mehrangarh Courtyard</span>
                <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
