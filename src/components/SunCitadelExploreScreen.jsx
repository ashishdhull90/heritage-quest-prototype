import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Compass, 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Info, 
  ArrowLeft, 
  Maximize2,
  Check,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Sun,
  Crown,
  Columns
} from 'lucide-react';
import { sound } from '../data/soundEffects';

/*
  Authentic Sun Citadel (Rao Jodha's Royal Chamber) Hotspots
  The 4 Independent Masterable Features:
  1. ORNATE CEILING (Gilded Coffered Ceiling & Royal Portrait Medallions)
  2. DECORATIVE WALL ART (Miniature Murals, Gold Leaf & Stained Glass)
  3. ROYAL INTERIOR (Throne Diwan, Velvet Bolsters & Royal Canopy)
  4. ARCHITECTURAL CRAFTSMANSHIP (Carved Cusped Arches & Fluted Columns)
*/
const HOTSPOTS_DATA = [
  {
    id: 'hotspot_ornate_ceiling',
    number: 1,
    title: 'Gilded Coffered Ceiling & Royal Medallions',
    category: 'ORNATE CEILING',
    icon: Sun,
    color: '#e6b325',
    tagColor: 'rgba(230, 179, 37, 0.2)',
    shortDesc: 'Pure gold-leaf coffered ceiling panels, intricate lacquered filigree, and royal portrait friezes.',
    lore: 'The soaring ceiling of the Sun Citadel chamber represents the pinnacle of Marwar court craftsmanship. Finished with thousands of leaves of pure hammered gold and fine vegetable pigments, the coffered panels display intricate arabesque mandalas framed by an upper frieze of painted medallions depicting historic Rathore sovereigns and celestial guardians.',
    importance: 'This opulent ceiling turned the chamber into a shimmering golden sky that reflected flickering candlelight during evening durbars, symbolizing the Sun Dynasty (Suryavansha) lineage of the Jodhpur rulers.',
    didYouKnow: 'Master artisans applied gold leaf (vark) over raised plaster reliefs and sealed it with natural resins, preserving its lustrous golden brilliance without tarnishing for over two centuries.',
    xpReward: 20,
    preferredViewId: 'view_ornate_ceiling'
  },
  {
    id: 'hotspot_wall_art',
    number: 2,
    title: 'Miniature Murals & Stained-Glass Arches',
    category: 'DECORATIVE WALL ART',
    icon: Palette,
    color: '#ec4899',
    tagColor: 'rgba(236, 72, 153, 0.2)',
    shortDesc: 'Hand-painted Marwar miniature frescoes, floral gold tracery, and jewel-toned stained glass.',
    lore: 'Every expanse of the chamber walls is adorned with exquisite polychrome murals executed in the distinctive Jodhpur miniature painting style. Intricate gold arabesques frame scenes of court celebrations and mythological epics, while vibrant stained-glass lunettes in ruby, emerald, and cobalt hues cast dancing light across the royal hall.',
    importance: 'The murals seamlessly combine indigenous Marwar miniature traditions with European imported stained glass, illustrating the cosmopolitan artistic patronage of the Mehrangarh royal court.',
    didYouKnow: 'The stained-glass windowpanes were positioned so that shifting desert sunlight would animate the gold murals throughout the day, eliminating the need for torches during daytime conferences.',
    xpReward: 20,
    preferredViewId: 'view_wall_art'
  },
  {
    id: 'hotspot_royal_interior',
    number: 3,
    title: 'Rao Jodha Royal Diwan & Ceremonial Hall',
    category: 'ROYAL INTERIOR',
    icon: Crown,
    color: '#10b981',
    tagColor: 'rgba(16, 185, 129, 0.2)',
    shortDesc: 'Traditional cushioned gaddi, embroidered velvet bolsters, ceremonial canopy, and low audience seating.',
    lore: 'Serving as the private audience chamber and sanctum for the Maharaja, the room is arranged according to ancient Rajput court protocol. At its heart rests the royal gaddi (throne cushion) shaded by an embroidered velvet canopy (chhatri), surrounded by silk masnad bolsters where state ministers and noble guests were received in private audience.',
    importance: 'The floor-level seating arrangement fostered intimate strategic deliberations and musical soirées, embodying the ethos of Rajput fellowship between the king and his clan chiefs.',
    didYouKnow: 'Renowned court musicians and poets (charans) would perform classical ragas while seated upon the rich carpets, singing songs that celebrated Rao Jodha and the founding of the citadel.',
    xpReward: 20,
    preferredViewId: 'view_royal_interior'
  },
  {
    id: 'hotspot_arch_craft',
    number: 4,
    title: 'Carved Cusped Arches & Fluted Columns',
    category: 'ARCHITECTURAL CRAFTSMANSHIP',
    icon: Columns,
    color: '#f97316',
    tagColor: 'rgba(249, 115, 22, 0.2)',
    shortDesc: 'Finely sculpted multifoil sandstone arches, fluted pillars, and gilded lotus capitals.',
    lore: 'Graceful multifoil arches and fluted columns delineate the interior bays of the chamber. Master stonemasons sculpted each arch with delicate lotus-bud cusps and decorative spandrels, combining structural strength with sculptural lightness to support the heavy upper palace storeys while framing panoramic interior perspectives.',
    importance: 'The arcade design facilitated natural cooling cross-ventilation from the fort ridge while creating a dignified rhythm of light and shadow across the royal audience space.',
    didYouKnow: 'The column plaster was hand-burnished with crushed sea-shells and agate stones in the traditional "ghotai" technique to produce a mirror-like finish that stays naturally cool to the touch.',
    xpReward: 20,
    preferredViewId: 'view_arch_craft'
  }
];

/*
  Exploration Views mapped to the official photograph:
  /assets/monuments/mehrangarh-fort/sun-citadel.jpg
*/
const EXPLORATION_VIEWS = [
  {
    id: 'view_overview',
    title: 'Sun Citadel Royal Chamber Panorama',
    subtitle: 'Complete perspective of Rao Jodha’s royal hall, gilded ceiling and ornate colonnade',
    image: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    zoom: 1.0,
    panX: 0,
    panY: 0,
    hotspotPositions: {
      hotspot_ornate_ceiling: { x: 38, y: 15 },
      hotspot_wall_art: { x: 24, y: 58 },
      hotspot_royal_interior: { x: 48, y: 72 },
      hotspot_arch_craft: { x: 78, y: 38 }
    }
  },
  {
    id: 'view_ornate_ceiling',
    title: '1. Ornate Ceiling & Gilded Filigree',
    subtitle: 'Pure gold-leaf coffered ceiling, arabesque reliefs and royal portrait friezes',
    image: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    zoom: 1.85,
    panX: 12,
    panY: 28,
    hotspotPositions: {
      hotspot_ornate_ceiling: { x: 38, y: 15 },
      hotspot_arch_craft: { x: 78, y: 38 }
    }
  },
  {
    id: 'view_wall_art',
    title: '2. Decorative Wall Art & Stained Glass',
    subtitle: 'Marwar miniature murals, jewel-toned glass windows and floral plasterwork',
    image: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    zoom: 1.9,
    panX: 28,
    panY: -8,
    hotspotPositions: {
      hotspot_wall_art: { x: 24, y: 58 },
      hotspot_royal_interior: { x: 48, y: 72 }
    }
  },
  {
    id: 'view_royal_interior',
    title: '3. Royal Interior & Throne Diwan',
    subtitle: 'Ceremonial velvet gaddi, masnad bolsters, royal canopy and carpeted audience hall',
    image: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    zoom: 1.95,
    panX: 4,
    panY: -26,
    hotspotPositions: {
      hotspot_royal_interior: { x: 48, y: 72 },
      hotspot_wall_art: { x: 24, y: 58 }
    }
  },
  {
    id: 'view_arch_craft',
    title: '4. Architectural Craftsmanship & Arches',
    subtitle: 'Carved multifoil arches, fluted colonnade pillars and gilded lotus capitals',
    image: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    zoom: 1.85,
    panX: -24,
    panY: 10,
    hotspotPositions: {
      hotspot_arch_craft: { x: 78, y: 38 },
      hotspot_ornate_ceiling: { x: 38, y: 15 }
    }
  }
];

/*
  Authentic Gallery Assets for Sun Citadel
*/
const GALLERY_ITEMS = [
  {
    id: 'gal_suncitadel_main',
    title: 'Sun Citadel Royal Interior & Gilded Ceiling',
    subtitle: 'Authentic Documentary Photograph • Mehrangarh Fort • Jodhpur',
    url: '/assets/monuments/mehrangarh-fort/sun-citadel.jpg',
    caption: 'The richly decorated royal audience hall with gilded coffered ceiling, stained-glass arches, and traditional low diwan seating.'
  },
  {
    id: 'gal_mehrangarh_home',
    title: 'Mehrangarh Fort Exterior & Volcanic Cliffs',
    subtitle: 'UNESCO Tentative Heritage Complex • Jodhpur, Rajasthan',
    url: '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg',
    caption: 'Towering 15th-century sandstone fortress walls of Mehrangarh perched high atop Bhakurcheeria hill.'
  }
];

const SUN_CITADEL_STORAGE_KEY = 'heritage_sun_citadel_mastered_features';
const SUN_CITADEL_MASTERY_KEY = 'heritage_sun_citadel_mastery_awarded';

export default function SunCitadelExploreScreen({
  location: _location,
  playerStats,
  onCompleteSunCitadel,
  onReturnToFort,
  onOpenCodex,
  onClaimExplorationXP
}) {
  // Navigation & Interactive Mode State
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'overview' | 'facts' | 'gallery'
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [galleryViewerIndex, setGalleryViewerIndex] = useState(null);

  // Feature Discovery & Mastery State (Independent Persistence)
  const [discoveredHotspots, setDiscoveredHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem(SUN_CITADEL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read Sun Citadel discoveries from localStorage', e);
    }
    return [];
  });

  const [hasAwardedMastery, setHasAwardedMastery] = useState(() => {
    try {
      return localStorage.getItem(SUN_CITADEL_MASTERY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Save discovered hotspots to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(SUN_CITADEL_STORAGE_KEY, JSON.stringify(discoveredHotspots));
    } catch (err) {
      console.warn('Could not save Sun Citadel discoveries', err);
    }
  }, [discoveredHotspots]);

  // Inspect & Zoom System State
  const [userZoom, setUserZoom] = useState(1.0);
  const [userPan, setUserPan] = useState({ x: 0, y: 0 });
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  // Floating notifications & modal state
  const [discoveryToast, setDiscoveryToast] = useState(null);
  const [showMasteryCelebration, setShowMasteryCelebration] = useState(false);

  // References for gesture handling
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasDraggedRef = useRef(false);
  const pinchStartDistRef = useRef(null);
  const pinchStartZoomRef = useRef(1.0);

  const currentView = EXPLORATION_VIEWS[activeViewIndex] || EXPLORATION_VIEWS[0];

  // Zoom Controls
  const handleZoomIn = useCallback(() => {
    sound.playClick();
    setUserZoom((prev) => {
      const next = Math.min(3.0, +(prev + 0.35).toFixed(2));
      if (next > 1.0) setIsInspectMode(true);
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    sound.playClick();
    setUserZoom((prev) => {
      const next = Math.max(1.0, +(prev - 0.35).toFixed(2));
      if (next === 1.0) {
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
      }
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    sound.playClick();
    setUserZoom(1.0);
    setUserPan({ x: 0, y: 0 });
    setIsInspectMode(false);
    setMouseParallax({ x: 0, y: 0 });
  }, []);

  const handleToggleInspect = useCallback(() => {
    sound.playClick();
    if (userZoom > 1.0 || isInspectMode) {
      handleResetZoom();
    } else {
      setUserZoom(1.85);
      setIsInspectMode(true);
    }
  }, [userZoom, isInspectMode, handleResetZoom]);

  const handleSelectView = useCallback((index) => {
    sound.playClick();
    setActiveViewIndex(index);
    setUserZoom(1.0);
    setUserPan({ x: 0, y: 0 });
    setIsInspectMode(false);
  }, []);

  const handlePrevView = useCallback(() => {
    sound.playClick();
    setActiveViewIndex((prev) => (prev > 0 ? prev - 1 : EXPLORATION_VIEWS.length - 1));
    setUserZoom(1.0);
    setUserPan({ x: 0, y: 0 });
    setIsInspectMode(false);
  }, []);

  const handleNextView = useCallback(() => {
    sound.playClick();
    setActiveViewIndex((prev) => (prev < EXPLORATION_VIEWS.length - 1 ? prev + 1 : 0));
    setUserZoom(1.0);
    setUserPan({ x: 0, y: 0 });
    setIsInspectMode(false);
  }, []);

  // Keyboard Shortcuts (Inspect, Reset, Navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if modal is open
      if (selectedHotspot || galleryViewerIndex !== null || showMasteryCelebration) {
        if (e.key === 'Escape') {
          if (selectedHotspot) setSelectedHotspot(null);
          if (galleryViewerIndex !== null) setGalleryViewerIndex(null);
          if (showMasteryCelebration) setShowMasteryCelebration(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (userZoom > 1.0) {
          handleResetZoom();
        } else {
          onReturnToFort();
        }
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0' || e.key === 'r' || e.key === 'R') {
        handleResetZoom();
      } else if (e.key === 'i' || e.key === 'I' || e.key === 'z' || e.key === 'Z') {
        handleToggleInspect();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePrevView();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleNextView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedHotspot, 
    galleryViewerIndex, 
    showMasteryCelebration, 
    userZoom, 
    onReturnToFort, 
    handleResetZoom, 
    handleZoomIn, 
    handleZoomOut, 
    handleToggleInspect, 
    handlePrevView, 
    handleNextView
  ]);

  // Mouse Handlers for Desktop Drag-to-Pan & Mouse Parallax
  const handleMouseDown = (e) => {
    if (userZoom <= 1.0) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: userPan.x,
      panY: userPan.y
    };
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current && userZoom > 1.0) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 5) {
        hasDraggedRef.current = true;
      }

      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        const factor = 100 / (currentView.zoom * userZoom);
        const panDeltaX = (dx / rect.width) * factor * 1.25;
        const panDeltaY = (dy / rect.height) * factor * 1.25;

        const maxPan = 40 * (userZoom - 1 + 0.3);
        const newPanX = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panX + panDeltaX));
        const newPanY = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panY + panDeltaY));

        setUserPan({ x: newPanX, y: newPanY });
      }
    } else if (userZoom === 1.0 && viewportRef.current) {
      // Subtle 3D mouse parallax tilt
      const rect = viewportRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseParallax({ x: nx * 10, y: ny * 8 });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    if (userZoom === 1.0) {
      setMouseParallax({ x: 0, y: 0 });
    }
  };

  // Touch Handlers for Mobile (Pinch-to-zoom & drag-pan)
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      pinchStartDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchStartZoomRef.current = userZoom;
      setIsDragging(false);
      isDraggingRef.current = false;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsDragging(true);
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      dragStartRef.current = {
        x: t.clientX,
        y: t.clientY,
        panX: userPan.x,
        panY: userPan.y
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = currDist / pinchStartDistRef.current;
      const newZoom = Math.max(1.0, Math.min(3.0, +(pinchStartZoomRef.current * scale).toFixed(2)));
      setUserZoom(newZoom);
      if (newZoom > 1.0) setIsInspectMode(true);
      if (newZoom === 1.0) {
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
      }
    } else if (e.touches.length === 1 && isDraggingRef.current && userZoom > 1.0) {
      const t = e.touches[0];
      const dx = t.clientX - dragStartRef.current.x;
      const dy = t.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 5) {
        hasDraggedRef.current = true;
      }

      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        const factor = 100 / (currentView.zoom * userZoom);
        const panDeltaX = (dx / rect.width) * factor * 1.3;
        const panDeltaY = (dy / rect.height) * factor * 1.3;

        const maxPan = 40 * (userZoom - 1 + 0.3);
        const newPanX = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panX + panDeltaX));
        const newPanY = Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.panY + panDeltaY));

        setUserPan({ x: newPanX, y: newPanY });
      }
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  // EXPLICIT ACTION: Mark Feature as Mastered
  const handleMasterFeature = (hotspot) => {
    sound.playSuccess();
    if (!discoveredHotspots.includes(hotspot.id)) {
      const nextDiscovered = [...discoveredHotspots, hotspot.id];
      setDiscoveredHotspots(nextDiscovered);
      
      // Floating feedback toast
      setDiscoveryToast({
        title: hotspot.title,
        category: hotspot.category,
        xp: hotspot.xpReward
      });
      setTimeout(() => setDiscoveryToast(null), 2400);

      // Claim intermediate exploration XP (+20 XP)
      if (onClaimExplorationXP) {
        onClaimExplorationXP(hotspot.xpReward);
      }

      // Check if all 4 discoveries are now mastered
      if (nextDiscovered.length === HOTSPOTS_DATA.length && !hasAwardedMastery) {
        setHasAwardedMastery(true);
        try {
          localStorage.setItem(SUN_CITADEL_MASTERY_KEY, 'true');
        } catch {
          // localStorage save fallback
        }
        setTimeout(() => {
          sound.playVictoryFanfare();
          setShowMasteryCelebration(true);
          if (onCompleteSunCitadel) {
            onCompleteSunCitadel({ xpAward: 80 });
          }
        }, 500);
      }
    }
  };

  const discoveriesCount = discoveredHotspots.length;
  const progressPercent = Math.round((discoveriesCount / HOTSPOTS_DATA.length) * 100);
  const isAllMastered = discoveriesCount === HOTSPOTS_DATA.length;

  const isZoomed = userZoom > 1.0;
  const totalScale = (currentView.zoom * userZoom).toFixed(3);
  const totalPanX = (currentView.panX + userPan.x + (userZoom === 1.0 ? mouseParallax.x * 0.3 : 0)).toFixed(2);
  const totalPanY = (currentView.panY + userPan.y + (userZoom === 1.0 ? mouseParallax.y * 0.3 : 0)).toFixed(2);

  return (
    <div className="sheesh-mahal-master-screen sun-citadel-master-screen" role="region" aria-label="Sun Citadel Interactive Exploration">
      {/* ===================================================================== */}
      {/* 1. TOP HUD BAR                                                        */}
      {/* ===================================================================== */}
      <div className="sheesh-hud-bar sun-citadel-hud-bar">
        <div className="sheesh-hud-left">
          <button 
            className="sheesh-back-btn sun-citadel-back-btn"
            onClick={() => {
              sound.playClick();
              onReturnToFort();
            }}
            title="Return to Mehrangarh Fort Courtyard"
          >
            <ArrowLeft size={16} />
            <span className="btn-label-desktop">← Return to Mehrangarh Courtyard</span>
          </button>

          <div className="sheesh-title-pill">
            <span className="sheesh-state-prefix">MEHRANGARH FORT &bull; JODHPUR</span>
            <h1 className="sheesh-location-title">Sun Citadel &bull; Rao Jodha Chamber</h1>
          </div>
        </div>

        {/* Center Progress HUD Chip */}
        <div className="sheesh-hud-center">
          <div className="sheesh-discovery-counter-chip">
            <div className="counter-icon-wrap">
              {isAllMastered ? (
                <CheckCircle2 size={16} className="text-emerald" />
              ) : (
                <Sun size={16} className="text-gold" />
              )}
            </div>
            <div className="counter-text-block">
              <span className="counter-label">FEATURES MASTERED</span>
              <strong className="counter-numbers">
                <span className={isAllMastered ? 'text-emerald' : 'text-gold'}>
                  {discoveriesCount}
                </span>
                <span className="counter-slash"> / </span>
                <span>{HOTSPOTS_DATA.length}</span>
              </strong>
            </div>
            <div className="counter-bar-mini">
              <div 
                className={`counter-bar-fill ${isAllMastered ? 'complete' : ''}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Stats & Action Chips */}
        <div className="sheesh-hud-right">
          <div className="sheesh-stat-chip" title="Current Explorer XP">
            <Sparkles size={14} className="text-gold" />
            <span>{playerStats?.xp || 0} XP</span>
          </div>

          <div className="sheesh-stat-chip relics-chip" title="Sacred Relics">
            <Award size={14} className="text-emerald" />
            <span>{playerStats?.unlockedRelics?.length || 0}/4</span>
          </div>

          {onOpenCodex && (
            <button 
              className="sheesh-codex-btn"
              onClick={() => {
                sound.playChime();
                onOpenCodex();
              }}
              title="Open Heritage Codex Archive"
            >
              <BookOpen size={15} />
              <span>Codex</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN INTERACTIVE CONTENT STAGE                                    */}
      {/* ===================================================================== */}
      <div className="sheesh-workspace-layout">
        {/* Left Vertical Dock / Navigation Bar */}
        <aside className="sheesh-nav-dock sun-citadel-nav-dock" aria-label="Exploration Navigation">
          <div className="sheesh-dock-brand">
            <Sun size={20} className="text-gold" />
            <div className="brand-text">
              <strong>MEHRANGARH</strong>
              <span>Sun Citadel</span>
            </div>
          </div>

          <nav className="sheesh-dock-menu">
            <button 
              className={`dock-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('explore');
              }}
              title="Interactive Photo Exploration"
            >
              <Compass size={18} />
              <span>EXPLORE</span>
              {isAllMastered && <Check size={14} className="dock-check text-emerald" />}
            </button>

            <button 
              className={`dock-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('overview');
              }}
              title="History & Royal Chamber Context"
            >
              <Info size={18} />
              <span>OVERVIEW</span>
            </button>

            <button 
              className={`dock-nav-item ${activeTab === 'facts' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('facts');
              }}
              title="4 Key Features"
            >
              <Layers size={18} />
              <span>KEY FACTS</span>
              <span className="dock-badge">{discoveriesCount}/4</span>
            </button>

            <button 
              className={`dock-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('gallery');
              }}
              title="Archival Photographs"
            >
              <Camera size={18} />
              <span>GALLERY</span>
              <span className="dock-badge">{GALLERY_ITEMS.length}</span>
            </button>

            <button 
              className="dock-nav-item"
              onClick={() => {
                sound.playChime();
                if (onOpenCodex) onOpenCodex();
              }}
              title="Heritage Codex & Relics"
            >
              <BookOpen size={18} />
              <span>CODEX</span>
            </button>
          </nav>

          {/* Guide Speech Card */}
          <div className="dock-guide-card">
            <div className="guide-avatar-wrap">
              <img 
                src="/assets/characters/acharya-vikram-portrait.jpg" 
                alt="Acharya Vikram" 
                className="guide-mini-avatar"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="guide-card-content">
              <span className="guide-tag">Acharya Vikram</span>
              <p className="guide-tip-text">
                {isAllMastered 
                  ? 'Splendid scholarship! You have explored and mastered all 4 architectural features of the Sun Citadel chamber.'
                  : `Examine the royal chamber and master all 4 architectural features (${discoveriesCount}/4 completed).`}
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Exploration Workspace */}
        <section className="sheesh-main-stage">
          {/* --------------------------------------------------------------- */}
          {/* TAB 1: INTERACTIVE PHOTOGRAPHIC EXPLORATION                    */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'explore' && (
            <div 
              className={`sheesh-viewport-container sun-citadel-viewport-container ${isZoomed ? 'inspecting-active' : ''}`}
              ref={viewportRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {/* Dynamic Camera Perspective Transform Layer */}
              <div 
                className={`sheesh-photo-transform-layer ${isZoomed ? 'zoomed-layer' : ''}`}
                style={{
                  transform: `scale(${totalScale}) translate(${totalPanX}%, ${totalPanY}%)`,
                  transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
              >
                {/* 1. Real Official Uploaded Photograph in 100% Original Full Color */}
                <img 
                  src={currentView.image} 
                  alt={currentView.title} 
                  className="sun-citadel-real-photo-backdrop"
                  style={{ filter: 'none', WebkitFilter: 'none' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/sun-citadel.jpg';
                  }}
                />

                {/* 2. Interactive Knowledge Hotspots for Current View */}
                <div className="sheesh-hotspots-overlay-plane">
                  {Object.entries(currentView.hotspotPositions).map(([hotspotId, pos]) => {
                    const hotspot = HOTSPOTS_DATA.find(h => h.id === hotspotId);
                    if (!hotspot) return null;

                    const isMastered = discoveredHotspots.includes(hotspot.id);
                    const isProminent = userZoom >= 1.5;
                    const IconComponent = hotspot.icon;

                    return (
                      <div 
                        key={hotspot.id}
                        className={`sheesh-hotspot-pin ${isMastered ? 'discovered' : 'undiscovered'} ${isProminent ? 'zoom-prominent' : ''}`}
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`
                        }}
                        onClick={(e) => {
                          if (hasDraggedRef.current) return;
                          e.stopPropagation();
                          sound.playChime();
                          setSelectedHotspot(hotspot);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Feature ${hotspot.number}: ${hotspot.title} - ${isMastered ? 'Mastered ✓' : 'Not Mastered'}`}
                      >
                        {/* Glowing Aura Rings */}
                        <div 
                          className="hotspot-pulse-ring-outer" 
                          style={{ borderColor: isMastered ? '#10b981' : hotspot.color }}
                        ></div>
                        <div 
                          className="hotspot-pulse-ring-inner" 
                          style={{ borderColor: isMastered ? '#10b981' : hotspot.color }}
                        ></div>

                        {/* Central Crest Marker */}
                        <div 
                          className="hotspot-marker-core" 
                          style={{ backgroundColor: isMastered ? '#10b981' : hotspot.color }}
                        >
                          {isMastered ? (
                            <Check size={16} className="text-black font-bold" />
                          ) : (
                            <IconComponent size={15} className="text-black" />
                          )}
                        </div>

                        {/* Hover Tooltip Card */}
                        <div className="hotspot-hover-card">
                          <div className="hover-card-header">
                            <span className="hover-category-tag" style={{ color: isMastered ? '#10b981' : hotspot.color }}>
                              {hotspot.number}. {hotspot.category}
                            </span>
                            {isMastered ? (
                              <span className="hover-status-badge found">✓ Mastered</span>
                            ) : (
                              <span className="hover-status-badge xp">○ Not mastered (+{hotspot.xpReward} XP)</span>
                            )}
                          </div>
                          <strong className="hover-title">{hotspot.title}</strong>
                          <span className="hover-action-hint">Click to open & master</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Viewport Top Overlay: Current Photographic View Angle & Controls */}
              <div className="sheesh-viewport-top-strip">
                <div className="view-angle-pill">
                  <Camera size={14} className="text-gold" />
                  <span>VIEW: <strong>{currentView.title}</strong></span>
                  <span className="view-subtitle-sep">&bull;</span>
                  <span className="view-subtitle">{currentView.subtitle}</span>
                </div>

                {/* Floating Inspect & Zoom Toolbar */}
                <div className="sheesh-inspect-toolbar" role="toolbar" aria-label="Inspect and Zoom Controls">
                  <button
                    className={`btn-inspect-toggle ${isZoomed || isInspectMode ? 'active pulse-gold' : ''}`}
                    onClick={handleToggleInspect}
                    title="Toggle Detail Inspection [I / Z]"
                    aria-label="Toggle Detail Inspection"
                  >
                    <Search size={14} className="text-gold" />
                    <span className="inspect-btn-label">{isZoomed ? 'Inspecting' : 'Inspect'}</span>
                  </button>

                  <div className="zoom-stepper-group">
                    <button
                      className="btn-zoom-step"
                      onClick={handleZoomOut}
                      disabled={userZoom <= 1.0}
                      title="Zoom Out [-]"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>

                    <span className="zoom-level-badge" title="Current Zoom Level">
                      {userZoom.toFixed(1)}x
                    </span>

                    <button
                      className="btn-zoom-step"
                      onClick={handleZoomIn}
                      disabled={userZoom >= 3.0}
                      title="Zoom In [+]"
                      aria-label="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>

                  <button
                    className="btn-reset-zoom"
                    onClick={handleResetZoom}
                    disabled={userZoom === 1.0 && userPan.x === 0 && userPan.y === 0}
                    title="Reset View [0 / R]"
                    aria-label="Reset View"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Viewport Bottom Overlay: View Switching Buttons & Feature Indicators */}
              <div className="sheesh-viewport-bottom-strip">
                {/* View Angle Selector Buttons */}
                <div className="view-angles-selector-bar">
                  <button 
                    className="view-arrow-btn"
                    onClick={handlePrevView}
                    title="Previous View [A / ←]"
                    aria-label="Previous View"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="view-pills-list">
                    {EXPLORATION_VIEWS.map((v, idx) => (
                      <button
                        key={v.id}
                        className={`view-pill-btn ${activeViewIndex === idx ? 'active' : ''}`}
                        onClick={() => handleSelectView(idx)}
                      >
                        <span className="pill-dot"></span>
                        <span className="pill-text">{v.title.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  <button 
                    className="view-arrow-btn"
                    onClick={handleNextView}
                    title="Next View [D / →]"
                    aria-label="Next View"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Hotspots Quick Chips */}
                <div className="hotspots-quick-dock">
                  {HOTSPOTS_DATA.map((h) => {
                    const isMastered = discoveredHotspots.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        className={`hotspot-chip-btn ${isMastered ? 'found' : 'missing'}`}
                        onClick={() => {
                          sound.playChime();
                          setSelectedHotspot(h);
                        }}
                        title={`${h.number}. ${h.category} (${isMastered ? 'Mastered ✓' : '○ Not mastered - Click to read & master'})`}
                      >
                        <span className="chip-num">{h.number}</span>
                        <span className="chip-name">{h.category}</span>
                        {isMastered ? (
                          <span className="chip-status-badge-found" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#10b981', fontWeight: 'bold' }}>
                            <Check size={12} /> ✓
                          </span>
                        ) : (
                          <span className="chip-status-badge-missing" style={{ opacity: 0.8, fontSize: '0.74rem' }}>
                            ○ Not mastered
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: OVERVIEW & HISTORICAL CONTEXT                            */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="sheesh-tab-scroll-container">
              <div className="sheesh-overview-hero-card">
                <div className="overview-hero-header">
                  <span className="badge-gold-outline">1459 CE • RAO JODHA • SUN CITADEL CHAMBER</span>
                  <h2>Sun Citadel (Mihirgarh) — Rao Jodha’s Throne Sanctum</h2>
                  <p className="hero-lead-text">
                    Founded in 1459 CE by Rao Jodha upon the volcanic cliff of Bhakurcheeria, the Sun Citadel (originally Mihirgarh) served as the impregnable heart of Marwar. Within its royal apartments, the palace interior features opulent gold filigree ceilings, stained glass arches, and painted miniature murals dedicated to the solar deity and Rathore royalty.
                  </p>
                </div>

                <div className="overview-featured-photo-row">
                  <div className="overview-photo-frame">
                    <img 
                      src="/assets/monuments/mehrangarh-fort/sun-citadel.jpg" 
                      alt="Sun Citadel Interior" 
                      className="overview-real-photo"
                      style={{ filter: 'none', WebkitFilter: 'none' }}
                    />
                    <div className="photo-tag-strip">
                      <Camera size={13} className="text-gold" />
                      <span>Sun Citadel Royal Chamber & Gilded Ceilings</span>
                    </div>
                  </div>

                  <div className="overview-photo-frame">
                    <img 
                      src="/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg" 
                      alt="Mehrangarh Fort Exterior" 
                      className="overview-real-photo"
                      style={{ filter: 'none', WebkitFilter: 'none' }}
                    />
                    <div className="photo-tag-strip">
                      <Camera size={13} className="text-gold" />
                      <span>Mehrangarh Fort Sandstone Ramparts</span>
                    </div>
                  </div>
                </div>

                <div className="overview-sections-grid">
                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Sun size={20} className="text-gold" /></div>
                    <h3>1. Ornate Ceiling</h3>
                    <p>
                      Pure gold-leaf coffered panels and floral arabesques with continuous portrait medallions of solar deities and Rathore rulers.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Palette size={20} className="text-pink" /></div>
                    <h3>2. Decorative Wall Art</h3>
                    <p>
                      Marwar school miniature tempera paintings and jewel-toned stained glass windows casting vivid patterns across the interior.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Crown size={20} className="text-emerald" /></div>
                    <h3>3. Royal Interior</h3>
                    <p>
                      Traditional floor-level royal diwan seating, silk masnad bolsters, and velvet parasol canopy for intimate courtly councils.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Columns size={20} className="text-amber" /></div>
                    <h3>4. Architectural Craftsmanship</h3>
                    <p>
                      Polished marble stucco columns and delicate cusped arches framing the royal chamber with natural cross-ventilation.
                    </p>
                  </div>
                </div>

                <div className="overview-action-cta">
                  <button 
                    className="btn-heritage-primary pulse-gold"
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('explore');
                    }}
                  >
                    <Compass size={18} />
                    <span>LAUNCH INTERACTIVE EXPLORATION</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: KEY FACTS & ARCHITECTURAL HIGHLIGHTS                     */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'facts' && (
            <div className="sheesh-tab-scroll-container">
              <div className="sheesh-facts-header">
                <h2>4 Architectural Features of the Sun Citadel</h2>
                <p className="text-secondary">
                  Investigate and master each royal interior and craft feature to learn how Marwar artisans transformed desert sandstone into one of India’s most opulent throne chambers.
                </p>
              </div>

              <div className="facts-cards-vertical-list">
                {HOTSPOTS_DATA.map((hotspot) => {
                  const isMastered = discoveredHotspots.includes(hotspot.id);
                  const IconComp = hotspot.icon;

                  return (
                    <div 
                      key={hotspot.id} 
                      className={`fact-feature-card ${isMastered ? 'found-card' : ''}`}
                    >
                      <div className="fact-card-left">
                        <div 
                          className="fact-badge-number" 
                          style={{ 
                            backgroundColor: isMastered ? 'rgba(16, 185, 129, 0.2)' : hotspot.tagColor, 
                            color: isMastered ? '#10b981' : hotspot.color 
                          }}
                        >
                          0{hotspot.number}
                        </div>
                        <div 
                          className="fact-icon-wrapper" 
                          style={{ borderColor: isMastered ? '#10b981' : hotspot.color }}
                        >
                          {isMastered ? (
                            <Check size={24} className="text-emerald" />
                          ) : (
                            <IconComp size={24} style={{ color: hotspot.color }} />
                          )}
                        </div>
                      </div>

                      <div className="fact-card-content">
                        <div className="fact-top-meta">
                          <span 
                            className="fact-category-pill" 
                            style={{ 
                              color: isMastered ? '#10b981' : hotspot.color, 
                              backgroundColor: isMastered ? 'rgba(16, 185, 129, 0.2)' : hotspot.tagColor 
                            }}
                          >
                            {hotspot.category}
                          </span>
                          {isMastered ? (
                            <span className="fact-completed-badge">
                              <CheckCircle2 size={14} className="text-emerald" />
                              <span>Mastered ✓</span>
                            </span>
                          ) : (
                            <span 
                              className="fact-xp-reward-pill" 
                              style={{ 
                                color: '#fbbf24', 
                                background: 'rgba(245, 158, 11, 0.15)', 
                                border: '1px solid rgba(245, 158, 11, 0.3)' 
                              }}
                            >
                              ○ Not mastered (+{hotspot.xpReward} XP)
                            </span>
                          )}
                        </div>

                        <h3 className="fact-title">{hotspot.title}</h3>
                        <p className="fact-desc">{hotspot.lore}</p>

                        {hotspot.importance && (
                          <div className="fact-importance-strip" style={{ marginTop: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                            <strong className="text-gold">Why It Matters: </strong>
                            <span>{hotspot.importance}</span>
                          </div>
                        )}

                        <div className="fact-did-you-know-strip" style={{ marginTop: '0.5rem' }}>
                          <strong className="text-gold">Did You Know?</strong>
                          <span>{hotspot.didYouKnow}</span>
                        </div>

                        <div className="fact-card-actions" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <button
                            className="btn-inspect-feature-jump"
                            onClick={() => {
                              sound.playClick();
                              const viewIdx = EXPLORATION_VIEWS.findIndex(v => v.id === hotspot.preferredViewId);
                              if (viewIdx !== -1) setActiveViewIndex(viewIdx);
                              setActiveTab('explore');
                              setSelectedHotspot(hotspot);
                            }}
                          >
                            <Search size={14} />
                            <span>Inspect & Master This Feature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 4: ARCHIVAL PHOTO GALLERY                                   */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'gallery' && (
            <div className="sheesh-tab-scroll-container">
              <div className="sheesh-gallery-header">
                <h2>Sun Citadel Archival Photography</h2>
                <p className="text-secondary">
                  High-resolution documentary photographs capturing the gilded ceiling, painted miniatures, and royal interior architecture of Mehrangarh Fort.
                </p>
              </div>

              <div className="sheesh-gallery-grid">
                {GALLERY_ITEMS.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="gallery-photo-card"
                    onClick={() => {
                      sound.playClick();
                      setGalleryViewerIndex(idx);
                    }}
                  >
                    <div className="gallery-thumbnail-frame">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="gallery-thumbnail-img"
                        style={{ filter: 'none', WebkitFilter: 'none' }}
                      />
                      <div className="gallery-hover-overlay">
                        <Maximize2 size={24} className="text-gold" />
                        <span>View Full Photograph</span>
                      </div>
                    </div>
                    <div className="gallery-photo-meta">
                      <span className="gallery-photo-subtitle">{item.subtitle}</span>
                      <h4 className="gallery-photo-title">{item.title}</h4>
                      <p className="gallery-photo-caption">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ===================================================================== */}
      {/* 3. KNOWLEDGE MODAL (TRIGGERED BY HOTSPOT CLICK)                      */}
      {/* ===================================================================== */}
      {selectedHotspot && (
        <div 
          className="modal-overlay sheesh-knowledge-modal-overlay" 
          onClick={() => setSelectedHotspot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedHotspot.title}
        >
          <div 
            className="sheesh-knowledge-modal-card animate-scale-up" 
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: selectedHotspot.color }}
          >
            {/* Modal Header */}
            <div className="knowledge-modal-header" style={{ borderBottomColor: selectedHotspot.tagColor }}>
              <div className="knowledge-modal-title-group">
                <span 
                  className="knowledge-category-badge" 
                  style={{ color: selectedHotspot.color, backgroundColor: selectedHotspot.tagColor }}
                >
                  0{selectedHotspot.number} &bull; {selectedHotspot.category}
                </span>
                <h2 className="knowledge-modal-title">{selectedHotspot.title}</h2>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedHotspot(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="knowledge-modal-body">
              {/* Highlighted Archival Snapshot Thumbnail */}
              <div className="knowledge-visual-snapshot-frame">
                <img 
                  src="/assets/monuments/mehrangarh-fort/sun-citadel.jpg" 
                  alt={selectedHotspot.title} 
                  className="knowledge-snapshot-img"
                  style={{ filter: 'none', WebkitFilter: 'none' }}
                />
                <div className="snapshot-caption-tag">
                  <Camera size={13} />
                  <span>Authentic Documentary Photograph &bull; Mehrangarh Fort, Jodhpur</span>
                </div>
              </div>

              {/* Main Historical Lore & Significance */}
              <div className="knowledge-lore-block">
                <p className="knowledge-lore-text">{selectedHotspot.lore}</p>
              </div>

              {/* Architectural Importance Callout */}
              {selectedHotspot.importance && (
                <div className="knowledge-importance-card" style={{ borderLeftColor: selectedHotspot.color }}>
                  <strong className="importance-title" style={{ color: selectedHotspot.color }}>
                    Why This Feature Matters:
                  </strong>
                  <p className="importance-text">{selectedHotspot.importance}</p>
                </div>
              )}

              {/* Fun Fact / Did You Know Callout */}
              {selectedHotspot.didYouKnow && (
                <div className="knowledge-fact-callout">
                  <div className="fact-callout-crest">
                    <Sparkles size={18} className="text-gold" />
                  </div>
                  <div className="fact-callout-text">
                    <strong>Did You Know?</strong>
                    <p>{selectedHotspot.didYouKnow}</p>
                  </div>
                </div>
              )}

              {/* Acharya Vikram Context */}
              <div className="knowledge-vikram-guide-card">
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="vikram-modal-avatar"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="vikram-modal-quote">
                  <strong>Acharya Vikram explains:</strong>
                  <p>&ldquo;Behold the artistry of the Sun Citadel. The golden ceiling and jewel-like frescoes transformed this fortress hall into a radiant reflection of Rathore royal majesty.&rdquo;</p>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="knowledge-modal-footer">
              {discoveredHotspots.includes(selectedHotspot.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                    <CheckCircle2 size={18} />
                    <span>Feature Mastered (✓ Completed)</span>
                  </div>
                  <button
                    className="btn-heritage-primary"
                    onClick={() => setSelectedHotspot(null)}
                  >
                    <span>CLOSE & CONTINUE EXPLORING</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <button
                    className="btn-heritage-secondary"
                    onClick={() => setSelectedHotspot(null)}
                    style={{ minWidth: '110px' }}
                  >
                    <span>Keep Reading</span>
                  </button>
                  <button
                    className="btn-heritage-primary btn-large-cta pulse-gold"
                    onClick={() => {
                      handleMasterFeature(selectedHotspot);
                    }}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderColor: '#34d399', color: '#ffffff' }}
                  >
                    <CheckCircle2 size={18} />
                    <span>MARK AS MASTERED (+{selectedHotspot.xpReward} XP)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. FLOATING DISCOVERY TOAST NOTIFICATION                             */}
      {/* ===================================================================== */}
      {discoveryToast && (
        <div className="sheesh-discovery-toast-pill" role="status">
          <div className="toast-sparkle-crest">
            <Sparkles size={18} className="text-gold" />
          </div>
          <div className="toast-text-wrap">
            <span className="toast-tag">FEATURE MASTERED</span>
            <strong>{discoveryToast.title}</strong>
          </div>
          <span className="toast-xp-pill">+{discoveryToast.xp} XP</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUN CITADEL MASTERED CELEBRATION MODAL                            */}
      {/* ===================================================================== */}
      {showMasteryCelebration && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Sun Citadel Mastered">
          <div className="sheesh-mastery-celebration-card ganesh-mastery-card sun-citadel-mastery-card">
            <div className="mastery-trophy-crest">
              <Award size={48} className="text-gold" />
            </div>

            <div className="mastery-badge-pill" style={{ backgroundColor: 'rgba(230, 179, 37, 0.2)', borderColor: '#e6b325', color: '#fef08a' }}>
              <Sparkles size={15} className="text-gold" />
              <span>SUN CITADEL MASTERED • 4/4 FEATURES MASTERED</span>
            </div>

            <h2 className="mastery-main-heading">SUN CITADEL MASTERED</h2>
            <p className="mastery-subtext" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <strong className="text-gold" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.25rem' }}>+80 XP</strong>
              Heritage knowledge unlocked. You have thoroughly explored and mastered all 4 architectural features of the Sun Citadel chamber: the Ornate Ceiling, Decorative Wall Art, Royal Interior, and Architectural Craftsmanship.
            </p>

            <div className="mastery-reward-box">
              <div className="reward-box-item">
                <span className="reward-item-label">Mehrangarh Clue</span>
                <strong className="reward-item-val text-emerald">
                  <CheckCircle2 size={16} />
                  <span>Sun Citadel (Rao Jodha) Completed</span>
                </strong>
              </div>
              <div className="reward-box-item">
                <span className="reward-item-label">Exploration Mastery</span>
                <strong className="reward-item-val text-gold">+80 XP</strong>
              </div>
            </div>

            <div className="mastery-card-actions">
              <button
                className="btn-heritage-primary btn-large-cta pulse-gold"
                onClick={() => {
                  sound.playClick();
                  setShowMasteryCelebration(false);
                  onReturnToFort();
                }}
              >
                <ArrowLeft size={18} />
                <span>RETURN TO MEHRANGARH COURTYARD</span>
              </button>

              <button
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  setShowMasteryCelebration(false);
                }}
              >
                <span>CONTINUE EXPLORING SUN CITADEL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. FULLSCREEN PHOTO VIEWER MODAL                                     */}
      {/* ===================================================================== */}
      {galleryViewerIndex !== null && (
        <div className="fullscreen-photo-modal-overlay" onClick={() => setGalleryViewerIndex(null)}>
          <div className="fullscreen-photo-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="fullscreen-close-btn"
              onClick={() => setGalleryViewerIndex(null)}
              aria-label="Close Fullscreen View"
            >
              <X size={24} />
            </button>

            {/* Prev / Next controls in Gallery Viewer */}
            <button 
              className="fullscreen-nav-btn prev"
              onClick={() => setGalleryViewerIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_ITEMS.length - 1))}
              aria-label="Previous Photograph"
            >
              <ChevronLeft size={28} />
            </button>

            <button 
              className="fullscreen-nav-btn next"
              onClick={() => setGalleryViewerIndex((prev) => (prev < GALLERY_ITEMS.length - 1 ? prev + 1 : 0))}
              aria-label="Next Photograph"
            >
              <ChevronRight size={28} />
            </button>

            <img 
              src={GALLERY_ITEMS[galleryViewerIndex].url} 
              alt={GALLERY_ITEMS[galleryViewerIndex].title} 
              className="fullscreen-full-img"
              style={{ filter: 'none', WebkitFilter: 'none' }}
            />

            <div className="fullscreen-caption-bar">
              <strong>{GALLERY_ITEMS[galleryViewerIndex].title}</strong>
              <span className="fullscreen-subtag">{GALLERY_ITEMS[galleryViewerIndex].subtitle}</span>
              <p>{GALLERY_ITEMS[galleryViewerIndex].caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
