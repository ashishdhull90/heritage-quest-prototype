import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Compass, 
  Camera, 
  Sun, 
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
  DoorOpen,
  Crown
} from 'lucide-react';
import { sound } from '../data/soundEffects';

/*
  Authentic Ganesh Pol Knowledge Hotspots
  The 4 Independent Features:
  1. Royal Gateway (Hotspot 1: Ganesh Pol)
  2. Auspicious Symbolism (Hotspot 2: Ganesha Motif)
  3. Floral Arabesques & Craft (Hotspot 3: Painted Ornamentation)
  4. Courtyard to Palace (Hotspot 4: Royal Transition)
*/
const HOTSPOTS_DATA = [
  {
    id: 'hotspot_ganesh_pol',
    number: 1,
    title: 'Ganesh Pol',
    category: 'Royal Gateway',
    icon: DoorOpen,
    color: '#e6b325',
    tagColor: 'rgba(230, 179, 37, 0.2)',
    shortDesc: 'The grand ornate gateway leading into the private palace sanctums of Amer Fort.',
    lore: 'Constructed between 1611 and 1667 CE during the reign of Mirza Raja Jai Singh, Ganesh Pol (The Elephant-Headed God Gateway) stands as one of the most celebrated entrance portals in Indian architectural history. Blending Rajput stonecraft with Mughal symmetry, this three-tiered gateway served as the ceremonial threshold through which royalty entered the private palatial quarters.',
    importance: 'Ganesh Pol represents the peak of 17th-century Rajasthani portal architecture, ingeniously balancing defensive stone fortification with opulent royal dignity.',
    didYouKnow: 'The gateway was deliberately designed with high defensive battlements and heavy brass-studded wooden doors that could be sealed instantly during an attack!',
    xpReward: 20,
    preferredViewId: 'view_central_portal'
  },
  {
    id: 'hotspot_ganesha_motif',
    number: 2,
    title: 'Ganesha Motif',
    category: 'Auspicious Symbolism',
    icon: Sun,
    color: '#f97316',
    tagColor: 'rgba(249, 115, 22, 0.2)',
    shortDesc: 'The sacred painted image of Lord Ganesha blessing every royal entry and exit.',
    lore: 'Painted in the central arched tympanum directly above the main gateway portal is an exquisite fresco of Lord Ganesha (the remover of obstacles and deity of auspicious beginnings). In Rajasthani royal tradition, the Maharaja and his victorious generals would pause beneath the gaze of Ganesha to offer prayers upon departing for battle or returning triumphant to the citadel.',
    importance: 'The Ganesha fresco established the gateway as a sacred threshold, invoking divine protection and ensuring prosperity for all entering the palace sanctum.',
    didYouKnow: 'The fresco was hand-painted with natural mineral pigments and burnished with agate stone, keeping the gold and vermilion hues vibrant after more than 350 years!',
    xpReward: 20,
    preferredViewId: 'view_ganesha_fresco'
  },
  {
    id: 'hotspot_ornamentation',
    number: 3,
    title: 'Painted Ornamentation',
    category: 'Floral Arabesques & Craft',
    icon: Palette,
    color: '#ec4899',
    tagColor: 'rgba(236, 72, 153, 0.2)',
    shortDesc: 'Intricate vegetable-dye frescoes, floral arabesques, and carved marble lattices.',
    lore: 'The gateway facade is renowned for its mesmerizing fresco-buono ornamentation. Master artisans layered ground semi-precious lapis lazuli, saffron, malachite, and powdered terracotta into wet lime plaster. Above the arch, the Suhag Mandir pavilion features pierced marble jali lattice screens that allowed royal women to observe courtyard ceremonies in privacy while enjoying desert breezes.',
    importance: 'These frescoes showcase master craftsmanship using rare organic and mineral pigments sealed under lime butter glaze, enduring centuries of weathering without fading.',
    didYouKnow: 'The vegetable pigments were sealed with egg-white glaze and pure lime butter, creating a durable waterproof glaze that has resisted harsh monsoon rains and desert sun!',
    xpReward: 20,
    preferredViewId: 'view_upper_balconies'
  },
  {
    id: 'hotspot_royal_transition',
    number: 4,
    title: 'Royal Transition',
    category: 'Courtyard to Palace',
    icon: Crown,
    color: '#10b981',
    tagColor: 'rgba(16, 185, 129, 0.2)',
    shortDesc: 'The threshold dividing the public Jaleb Chowk courtyard from private royal sanctums.',
    lore: 'Ganesh Pol marks the monumental architectural boundary between the outer public world and the private royal sanctum. Beyond this portal lies the Diwan-i-Khas (Hall of Private Audience), the Aram Bagh Mughal gardens, and the Sheesh Mahal mirror palace. Only royal family members, royal guests, and trusted ministers were permitted to pass through its sacred threshold.',
    importance: 'The gateway functioned as an optical and spatial boundary, preserving absolute royal privacy and shielding palace gardens from external courtyard view.',
    didYouKnow: 'The angled corridor behind the gateway was built as a defensive optical baffle: anyone standing in the public courtyard could not see directly into the private royal gardens!',
    xpReward: 20,
    preferredViewId: 'view_overview'
  }
];

/*
  Exploration Views mapped to the official photograph:
  /assets/monuments/amer-fort/ganesh-pol.jpg
*/
const EXPLORATION_VIEWS = [
  {
    id: 'view_overview',
    title: 'Ganesh Pol & Royal Courtyard Panorama',
    subtitle: 'Wide perspective of the ornate gateway standing in the grand courtyard',
    image: '/assets/monuments/amer-fort/ganesh-pol.jpg',
    zoom: 1.0,
    panX: 0,
    panY: 0,
    hotspotPositions: {
      hotspot_ganesh_pol: { x: 49, y: 58 },
      hotspot_ganesha_motif: { x: 49, y: 52 },
      hotspot_ornamentation: { x: 57, y: 45 },
      hotspot_royal_transition: { x: 30, y: 62 }
    }
  },
  {
    id: 'view_central_portal',
    title: '1. Royal Gateway (Ganesh Pol)',
    subtitle: 'Ceremonial entrance archway and massive fortified threshold',
    image: '/assets/monuments/amer-fort/ganesh-pol.jpg',
    zoom: 1.85,
    panX: 2,
    panY: -16,
    hotspotPositions: {
      hotspot_ganesh_pol: { x: 49, y: 58 },
      hotspot_ganesha_motif: { x: 49, y: 52 }
    }
  },
  {
    id: 'view_ganesha_fresco',
    title: '2. Auspicious Ganesha Fresco Motif',
    subtitle: 'Sacred stone-burnished tympanum fresco blessing the royal threshold',
    image: '/assets/monuments/amer-fort/ganesh-pol.jpg',
    zoom: 2.35,
    panX: 2,
    panY: -10,
    hotspotPositions: {
      hotspot_ganesha_motif: { x: 49, y: 52 },
      hotspot_ornamentation: { x: 57, y: 45 }
    }
  },
  {
    id: 'view_upper_balconies',
    title: '3. Floral Arabesques & Suhag Mandir',
    subtitle: 'Upper pavilion marble lattice jali and vegetable-dye frescoes',
    image: '/assets/monuments/amer-fort/ganesh-pol.jpg',
    zoom: 1.95,
    panX: -14,
    panY: 8,
    hotspotPositions: {
      hotspot_ornamentation: { x: 57, y: 45 },
      hotspot_royal_transition: { x: 30, y: 62 }
    }
  }
];

/*
  Authentic Gallery Assets for Ganesh Pol
  Uses the official uploaded photograph as the verified authentic asset.
*/
const GALLERY_ITEMS = [
  {
    id: 'gal_ganesh_main',
    title: 'Ganesh Pol Gateway Facade & Jaleb Chowk',
    subtitle: 'Official Documentary Photograph • 1611–1667 CE Gateway',
    url: '/assets/monuments/amer-fort/ganesh-pol.jpg',
    caption: 'The majestic three-tiered Ganesh Pol gateway facade captured under open desert skies in the ceremonial Jaleb Chowk courtyard of Amer Fort.'
  },
  {
    id: 'gal_amer_panorama',
    title: 'Amer Fort Citadel & Maota Lake Panorama',
    subtitle: 'UNESCO World Heritage Hilltop Complex • Jaipur, Rajasthan',
    url: '/assets/monuments/amer-fort/amer-fort-panorama.jpg',
    caption: 'Wide-angle archival photograph of Amer Fort crowned high upon the rugged Aravalli crest overlooking Maota Lake and the saffron garden island in Jaipur.'
  },
  {
    id: 'gal_sheesh_interior',
    title: 'Sheesh Mahal (Hall of Mirrors) - Inner Sanctum',
    subtitle: 'Royal Mirror Palace Accessible via Ganesh Pol',
    url: '/assets/monuments/amer-fort/sheesh-mahal-interior.jpg',
    caption: 'Archival view of the famed Sheesh Mahal palace located directly past the Ganesh Pol threshold inside the private royal quarters.'
  }
];

const GANESH_POL_STORAGE_KEY = 'heritage_ganesh_pol_mastered_features';
const GANESH_POL_MASTERY_KEY = 'heritage_ganesh_pol_mastery_awarded';

export default function GaneshPolExploreScreen({
  location: _location,
  playerStats,
  onCompleteGaneshPol,
  onReturnToFort,
  onOpenCodex,
  onClaimExplorationXP
}) {
  // Navigation Sidebar Active Tab: 'explore' | 'overview' | 'facts' | 'gallery' | 'codex'
  const [activeTab, setActiveTab] = useState('explore');

  // Active Exploration View Index
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const currentView = EXPLORATION_VIEWS[activeViewIndex];

  // Discovered / Mastered Hotspots State
  // Initial state is ALWAYS 0/4 unless previously mastered and saved in localStorage
  const [discoveredHotspots, setDiscoveredHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem(GANESH_POL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter to only valid hotspot IDs
          const validIds = HOTSPOTS_DATA.map(h => h.id);
          return parsed.filter(id => validIds.includes(id));
        }
      }
    } catch (e) {
      console.warn('Could not read saved Ganesh Pol progress', e);
    }
    return [];
  });

  // Selected Hotspot for Knowledge Modal (Opening NEVER auto-masters!)
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Floating Toast Notification
  const [discoveryToast, setDiscoveryToast] = useState(null);

  // Ganesh Pol Mastery Celebration State
  const [showMasteryCelebration, setShowMasteryCelebration] = useState(false);
  const [hasAwardedMastery, setHasAwardedMastery] = useState(() => {
    try {
      return localStorage.getItem(GANESH_POL_MASTERY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Persist mastered hotspots to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(GANESH_POL_STORAGE_KEY, JSON.stringify(discoveredHotspots));
    } catch (e) {
      console.warn('Could not persist Ganesh Pol progress', e);
    }
  }, [discoveredHotspots]);

  // Fullscreen Photo Viewer in Gallery
  const [galleryViewerIndex, setGalleryViewerIndex] = useState(null);

  // Mouse Parallax for Spatial Depth Feel
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  // Inspect & Zoom State
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [userZoom, setUserZoom] = useState(1.0); // 1.0x to 3.0x
  const [userPan, setUserPan] = useState({ x: 0, y: 0 }); // % offset
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const hasDraggedRef = useRef(false);
  const pinchStartDistRef = useRef(null);
  const pinchStartZoomRef = useRef(1.0);

  // Zoom In / Out / Reset / Toggle Handlers
  const handleZoomIn = () => {
    sound.playClick();
    setIsInspectMode(true);
    setUserZoom((prev) => Math.min(3.0, +(prev + 0.35).toFixed(2)));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setUserZoom((prev) => {
      const next = Math.max(1.0, +(prev - 0.35).toFixed(2));
      if (next === 1.0) {
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    sound.playClick();
    setUserZoom(1.0);
    setUserPan({ x: 0, y: 0 });
    setIsInspectMode(false);
  };

  const handleToggleInspect = () => {
    sound.playClick();
    if (userZoom > 1.0) {
      handleResetZoom();
    } else {
      setIsInspectMode(true);
      setUserZoom(1.8);
      setUserPan({ x: 0, y: 0 });
    }
  };

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedHotspot) {
        if (e.key === 'Escape') setSelectedHotspot(null);
        return;
      }
      if (galleryViewerIndex !== null) {
        if (e.key === 'Escape') setGalleryViewerIndex(null);
        if (e.key === 'ArrowLeft') {
          setGalleryViewerIndex((prev) => (prev > 0 ? prev - 1 : GALLERY_ITEMS.length - 1));
        }
        if (e.key === 'ArrowRight') {
          setGalleryViewerIndex((prev) => (prev < GALLERY_ITEMS.length - 1 ? prev + 1 : 0));
        }
        return;
      }

      const key = e.key.toLowerCase();

      // Zoom Shortcuts: + / = -> Zoom in, - / _ -> Zoom out, 0 / R -> Reset, I / Z -> Toggle Inspect
      if (key === '+' || key === '=' || key === 'add') {
        e.preventDefault();
        sound.playClick();
        setIsInspectMode(true);
        setUserZoom((prev) => Math.min(3.0, +(prev + 0.35).toFixed(2)));
        return;
      }
      if (key === '-' || key === '_' || key === 'subtract') {
        e.preventDefault();
        sound.playClick();
        setUserZoom((prev) => {
          const next = Math.max(1.0, +(prev - 0.35).toFixed(2));
          if (next === 1.0) {
            setUserPan({ x: 0, y: 0 });
            setIsInspectMode(false);
          }
          return next;
        });
        return;
      }
      if (key === '0' || key === 'r') {
        e.preventDefault();
        sound.playClick();
        setUserZoom(1.0);
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
        return;
      }
      if (key === 'i' || key === 'z') {
        e.preventDefault();
        sound.playClick();
        setUserZoom((prev) => {
          if (prev > 1.0) {
            setUserPan({ x: 0, y: 0 });
            setIsInspectMode(false);
            return 1.0;
          } else {
            setIsInspectMode(true);
            setUserPan({ x: 0, y: 0 });
            return 1.8;
          }
        });
        return;
      }

      // Navigation: A / ArrowLeft -> Prev View, D / ArrowRight -> Next View
      if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        sound.playClick();
        setActiveViewIndex((prev) => (prev > 0 ? prev - 1 : EXPLORATION_VIEWS.length - 1));
        setUserZoom(1.0);
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        sound.playClick();
        setActiveViewIndex((prev) => (prev < EXPLORATION_VIEWS.length - 1 ? prev + 1 : 0));
        setUserZoom(1.0);
        setUserPan({ x: 0, y: 0 });
        setIsInspectMode(false);
      }

      // Hotspot shortcuts: 1 to 4 (Opens the information panel WITHOUT auto-mastering)
      if (['1', '2', '3', '4'].includes(key)) {
        const num = parseInt(key, 10);
        const targetSpot = HOTSPOTS_DATA.find(h => h.number === num);
        if (targetSpot) {
          e.preventDefault();
          sound.playChime();
          setSelectedHotspot(targetSpot);
        }
      }

      // E or Space: Inspect first available hotspot
      if (key === 'e' || key === ' ') {
        e.preventDefault();
        const availableHotspotIds = Object.keys(currentView.hotspotPositions);
        if (availableHotspotIds.length > 0) {
          const targetId = availableHotspotIds.find(id => !discoveredHotspots.includes(id)) || availableHotspotIds[0];
          const spot = HOTSPOTS_DATA.find(h => h.id === targetId);
          if (spot) {
            sound.playChime();
            setSelectedHotspot(spot);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHotspot, galleryViewerIndex, activeViewIndex, currentView, discoveredHotspots]);

  // Desktop mouse wheel zoom on explore viewport
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
      setUserZoom((prev) => {
        const next = Math.max(1.0, Math.min(3.0, +(prev + zoomDelta).toFixed(2)));
        if (next > 1.0) setIsInspectMode(true);
        if (next === 1.0) {
          setUserPan({ x: 0, y: 0 });
          setIsInspectMode(false);
        }
        return next;
      });
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, []);

  // Mouse Drag / Pan Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
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
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 4) {
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
      return;
    }

    if (viewportRef.current && userZoom === 1.0) {
      const rect = viewportRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const normX = (clientX / rect.width - 0.5) * 2;
      const normY = (clientY / rect.height - 0.5) * 2;
      setMouseParallax({ x: normX * 8, y: normY * 6 });
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
  // Only called when user clicks the "MARK AS MASTERED" button inside the feature panel
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
          localStorage.setItem(GANESH_POL_MASTERY_KEY, 'true');
        } catch (e) {
          console.warn('Could not save mastery state', e);
        }
        setTimeout(() => {
          sound.playVictoryFanfare();
          setShowMasteryCelebration(true);
          if (onCompleteGaneshPol) {
            onCompleteGaneshPol({ xpAward: 80 });
          }
        }, 500);
      }
    }
  };

  const handleSelectView = (index) => {
    sound.playClick();
    setActiveViewIndex(index);
  };

  const handlePrevView = () => {
    sound.playClick();
    setActiveViewIndex((prev) => (prev > 0 ? prev - 1 : EXPLORATION_VIEWS.length - 1));
  };

  const handleNextView = () => {
    sound.playClick();
    setActiveViewIndex((prev) => (prev < EXPLORATION_VIEWS.length - 1 ? prev + 1 : 0));
  };

  const discoveriesCount = discoveredHotspots.length;
  const progressPercent = Math.round((discoveriesCount / HOTSPOTS_DATA.length) * 100);
  const isAllMastered = discoveriesCount === HOTSPOTS_DATA.length;

  const isZoomed = userZoom > 1.0;
  const totalScale = (currentView.zoom * userZoom).toFixed(3);
  const totalPanX = (currentView.panX + userPan.x + (userZoom === 1.0 ? mouseParallax.x * 0.3 : 0)).toFixed(2);
  const totalPanY = (currentView.panY + userPan.y + (userZoom === 1.0 ? mouseParallax.y * 0.3 : 0)).toFixed(2);

  return (
    <div className="sheesh-mahal-master-screen ganesh-pol-master-screen" role="region" aria-label="Ganesh Pol Interactive Exploration">
      {/* ===================================================================== */}
      {/* 1. TOP HUD BAR                                                        */}
      {/* ===================================================================== */}
      <div className="sheesh-hud-bar ganesh-hud-bar">
        <div className="sheesh-hud-left">
          <button 
            className="sheesh-back-btn ganesh-back-btn"
            onClick={() => {
              sound.playClick();
              onReturnToFort();
            }}
            title="Return to Amer Fort Courtyard"
          >
            <ArrowLeft size={16} />
            <span className="btn-label-desktop">← Return to Amer Fort Courtyard</span>
          </button>

          <div className="sheesh-title-pill">
            <span className="sheesh-state-prefix">GANESH POL</span>
            <span className="sheesh-location-title">Discover the gateway to the royal palace.</span>
          </div>
        </div>

        <div className="sheesh-hud-center">
          <div className="sheesh-progress-meter" title={`${discoveriesCount} of 4 Features Mastered`}>
            <div className="progress-meter-labels">
              <span className="progress-label-text">
                <Sparkles size={13} className="text-gold" />
                <span>Progress: {discoveriesCount}/4 discovered</span>
              </span>
              <strong className="progress-fraction text-gold">
                {progressPercent}%
              </strong>
            </div>
            <div className="progress-track-bar">
              <div 
                className="progress-fill-gold" 
                style={{ 
                  width: `${progressPercent}%`,
                  background: isAllMastered 
                    ? 'linear-gradient(90deg, #e6b325 0%, #10b981 100%)' 
                    : 'linear-gradient(90deg, #f59e0b 0%, #e6b325 50%, #10b981 100%)'
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="sheesh-hud-right">
          <div className="sheesh-stat-chip ganesh-stat-chip">
            <Sparkles size={14} className="text-gold" />
            <span className="stat-num">{playerStats?.xp || 0} XP</span>
          </div>

          <button 
            className="sheesh-codex-shortcut-btn"
            onClick={() => {
              sound.playChime();
              if (onOpenCodex) onOpenCodex();
            }}
            title="Open Heritage Codex"
          >
            <BookOpen size={15} />
            <span className="btn-label-desktop">Codex</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN WORKSPACE: LEFT NAV DOCK + RIGHT INTERACTIVE EXPLORATION     */}
      {/* ===================================================================== */}
      <div className="sheesh-workspace-layout">
        {/* Left Navigation Dock */}
        <aside className="sheesh-nav-dock ganesh-nav-dock" aria-label="Exploration Navigation">
          <div className="sheesh-dock-brand">
            <DoorOpen size={20} className="text-gold" />
            <div className="brand-text">
              <strong>AMER FORT</strong>
              <span>Ganesh Pol</span>
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
              title="Gateway History & Architecture"
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
              title="4 Gateway Key Facts"
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
                  ? 'Exemplary discovery! You have unlocked and mastered all 4 architectural features of Ganesh Pol.'
                  : `Inspect the sacred gateway and master all 4 architectural features (${discoveriesCount}/4 completed).`}
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
              className={`sheesh-viewport-container ganesh-viewport-container ${isZoomed ? 'inspecting-active' : ''}`}
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
                {/* 1. Real Official Uploaded Photograph */}
                <img 
                  src={currentView.image} 
                  alt={currentView.title} 
                  className="sheesh-real-photo-backdrop ganesh-real-photo-backdrop"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/amer-fort/ganesh-pol.png';
                  }}
                />

                {/* 2. Atmospheric Overlays (Desert sunlight & warm stone glow) */}
                <div className="sheesh-ambient-lighting-layer ganesh-warm-lighting-layer"></div>
                <div className="ganesh-sunbeam-shimmer-overlay"></div>

                {/* 3. Interactive Knowledge Hotspots for Current View */}
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

                    {(isZoomed || userPan.x !== 0 || userPan.y !== 0) && (
                      <button
                        className="btn-zoom-reset"
                        onClick={handleResetZoom}
                        title="Reset View to 1x [0 / R]"
                        aria-label="Reset View"
                      >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="keyboard-quick-shortcuts">
                  <span className="shortcut-cap">[A] / [D]</span>
                  <span className="shortcut-text">Views</span>
                  <span className="shortcut-divider">|</span>
                  <span className="shortcut-cap">[+] / [-]</span>
                  <span className="shortcut-text">Zoom</span>
                  <span className="shortcut-divider">|</span>
                  <span className="shortcut-cap">[1-4]</span>
                  <span className="shortcut-text">Features</span>
                </div>
              </div>

              {/* Inspection Mode Status / Helper Hint */}
              {isZoomed ? (
                <div className="inspect-mode-hint-pill animate-fade-in" role="status">
                  <span className="hint-icon">🔍</span>
                  <span>Drag to pan gateway &bull; Click hotspots &bull; Press <strong className="text-gold">[0]</strong> or Reset</span>
                </div>
              ) : isInspectMode ? (
                <div className="inspect-mode-hint-pill animate-fade-in" role="status">
                  <span className="hint-icon">🔍</span>
                  <span>Zoom in to inspect frescoes and craftsmanship &bull; Scroll / Pinch</span>
                </div>
              ) : null}

              {/* Viewport Bottom Floating Control Strip with Thumbnails */}
              <div className="sheesh-viewport-bottom-bar">
                {/* View Switcher Thumbnail Strip */}
                <div className="view-selector-tabs">
                  <button 
                    className="btn-view-nav prev"
                    onClick={handlePrevView}
                    title="Previous View (or press [A])"
                    aria-label="Previous View"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="view-pills-carousel">
                    {EXPLORATION_VIEWS.map((v, idx) => (
                      <button
                        key={v.id}
                        className={`view-thumbnail-btn ${activeViewIndex === idx ? 'active' : ''}`}
                        onClick={() => handleSelectView(idx)}
                        title={v.title}
                      >
                        <div className="view-thumb-preview-wrap">
                          <img src={v.image} alt={v.title} className="view-thumb-img" />
                        </div>
                        <div className="view-thumb-text-block">
                          <span className="view-thumb-num">0{idx + 1}</span>
                          <span className="view-thumb-title">{v.title.split(' ')[0]}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    className="btn-view-nav next"
                    onClick={handleNextView}
                    title="Next View (or press [D])"
                    aria-label="Next View"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* 4 Feature Discovery Status Chips */}
                <div className="discovery-chips-cluster">
                  {HOTSPOTS_DATA.map((h) => {
                    const isMastered = discoveredHotspots.includes(h.id);
                    return (
                      <button
                        key={h.id}
                        className={`discovery-status-chip ${isMastered ? 'found' : 'missing'}`}
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
                  <span className="badge-gold-outline">1611–1667 CE • MIRZA RAJA JAI SINGH • ROYAL PORTAL</span>
                  <h2>Ganesh Pol — Gateway to the Royal Palaces</h2>
                  <p className="hero-lead-text">
                    Commissioned during the height of the Amber Kingdom by Mirza Raja Jai Singh, Ganesh Pol stands as a crowning jewel of Indo-Islamic architecture. Combining monumental Rajput fortification with delicate Mughal fresco art, it marks the sacred threshold between the public Jaleb Chowk and the private inner palaces of Amer Fort.
                  </p>
                </div>

                <div className="overview-featured-photo-row">
                  <div className="overview-photo-frame">
                    <img 
                      src="/assets/monuments/amer-fort/ganesh-pol.jpg" 
                      alt="Ganesh Pol Gateway Facade" 
                      className="overview-real-photo"
                    />
                    <div className="photo-tag-strip">
                      <Camera size={13} className="text-gold" />
                      <span>Ganesh Pol Gateway Facade & Grand Sandstone Courtyard</span>
                    </div>
                  </div>

                  <div className="overview-photo-frame">
                    <img 
                      src="/assets/monuments/amer-fort/sheesh-mahal-interior.jpg" 
                      alt="Sheesh Mahal Interior" 
                      className="overview-real-photo"
                    />
                    <div className="photo-tag-strip">
                      <Camera size={13} className="text-gold" />
                      <span>Inner Palace Sanctuary Accessible via Ganesh Pol</span>
                    </div>
                  </div>
                </div>

                <div className="overview-sections-grid">
                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><DoorOpen size={20} className="text-gold" /></div>
                    <h3>1. Royal Gateway</h3>
                    <p>
                      Built from carved red and yellow sandstone layered with fine lime plaster, Ganesh Pol features a towering three-story central arch flanked by multi-tiered decorative niches and defensive parapets.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Sun size={20} className="text-amber" /></div>
                    <h3>2. Auspicious Symbolism</h3>
                    <p>
                      The central tympanum above the gate showcases a revered fresco of Lord Ganesha, placed to bestow divine protection and victory upon the Maharajas as they set out on royal campaigns.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Palette size={20} className="text-pink" /></div>
                    <h3>3. Floral Arabesques & Craft</h3>
                    <p>
                      The gateway surfaces are adorned with fresco-buono arabesques painted with ground lapis lazuli, saffron, turmeric, and malachite, hand-burnished with agate stones to maintain four centuries of brilliance.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Crown size={20} className="text-emerald" /></div>
                    <h3>4. Courtyard to Palace</h3>
                    <p>
                      The top tier houses the Suhag Mandir pavilion, where latticed marble jali windows allowed the royal women to witness grand ceremonial courtyard processions while remaining sheltered from public view.
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
                <h2>4 Architectural Features of Ganesh Pol</h2>
                <p className="text-secondary">
                  Investigate and master each architectural and artistic feature to understand how ancient Rajasthani master masons merged structural defense, spiritual symbolism, and palatial elegance.
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
                      </div>

                      <div className="fact-card-actions">
                        <button
                          className="btn-inspect-feature-jump"
                          onClick={() => {
                            sound.playChime();
                            const targetIdx = EXPLORATION_VIEWS.findIndex(v => v.id === hotspot.preferredViewId);
                            if (targetIdx !== -1) setActiveViewIndex(targetIdx);
                            setActiveTab('explore');
                            setSelectedHotspot(hotspot);
                          }}
                        >
                          <Maximize2 size={16} />
                          <span>{isMastered ? 'Review Feature' : 'Read & Master'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 4: ARCHIVAL PHOTOGRAPH GALLERY                              */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'gallery' && (
            <div className="sheesh-tab-scroll-container">
              <div className="sheesh-gallery-header">
                <h2>Amer Fort & Ganesh Pol Archival Photographic Vault</h2>
                <p className="text-secondary">
                  Documentary high-resolution photographs captured on-site at Amer Fort, Jaipur, Rajasthan.
                </p>
              </div>

              <div className="sheesh-gallery-grid">
                {GALLERY_ITEMS.map((item, index) => (
                  <div 
                    key={item.id}
                    className="gallery-photo-card"
                    onClick={() => setGalleryViewerIndex(index)}
                  >
                    <div className="gallery-photo-thumbnail-wrap">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="gallery-thumbnail-img"
                      />
                      <div className="gallery-hover-overlay">
                        <Maximize2 size={24} className="text-gold" />
                        <span>View Fullscreen</span>
                      </div>
                    </div>
                    <div className="gallery-photo-info">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ===================================================================== */}
      {/* 3. INTERACTIVE KNOWLEDGE PANEL MODAL                                  */}
      {/* Reading does NOT auto-master. Only "MARK AS MASTERED" completes it!  */}
      {/* ===================================================================== */}
      {selectedHotspot && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Knowledge: ${selectedHotspot.title}`}>
          <div className="sheesh-knowledge-modal-card">
            {/* Modal Header */}
            <div className="knowledge-modal-header" style={{ borderBottomColor: selectedHotspot.color }}>
              <div className="knowledge-badge-pill" style={{ backgroundColor: selectedHotspot.tagColor, color: selectedHotspot.color }}>
                <Sparkles size={14} />
                <span>FEATURE 0{selectedHotspot.number} • {selectedHotspot.category}</span>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedHotspot(null)}
                aria-label="Close Knowledge Panel"
              >
                <X size={20} />
              </button>
            </div>

            <div className="knowledge-modal-body">
              {/* Top Title & Icon */}
              <div className="knowledge-headline-row">
                <div className="knowledge-icon-crest" style={{ borderColor: selectedHotspot.color, backgroundColor: selectedHotspot.tagColor }}>
                  {(() => {
                    const IconC = selectedHotspot.icon;
                    return <IconC size={32} style={{ color: selectedHotspot.color }} />;
                  })()}
                </div>
                <div className="knowledge-title-wrap">
                  <span className="knowledge-pre-category">{selectedHotspot.category}</span>
                  <h3 className="knowledge-main-title">{selectedHotspot.title}</h3>
                </div>
              </div>

              {/* Status Pill Inside Modal */}
              <div style={{ marginBottom: '0.9rem' }}>
                {discoveredHotspots.includes(selectedHotspot.id) ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle2 size={14} />
                    <span>Mastered ✓</span>
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                    <span>○ Not Mastered</span>
                  </span>
                )}
              </div>

              {/* Main Educational Lore Text */}
              <div className="knowledge-lore-box">
                <p>{selectedHotspot.lore}</p>
              </div>

              {/* Why It Is Important */}
              {selectedHotspot.importance && (
                <div className="knowledge-importance-card" style={{ background: 'rgba(230, 179, 37, 0.08)', borderLeft: '3px solid var(--gold-primary)', padding: '0.75rem 1rem', borderRadius: '4px', margin: '0.8rem 0' }}>
                  <strong className="text-gold" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Why It Is Important
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {selectedHotspot.importance}
                  </p>
                </div>
              )}

              {/* "Did You Know?" Gold Highlight Box */}
              <div className="knowledge-did-you-know-card">
                <div className="dyk-crest">
                  <Sun size={24} className="text-gold" />
                </div>
                <div className="dyk-content">
                  <strong className="dyk-heading text-gold">Did You Know?</strong>
                  <p className="dyk-text">{selectedHotspot.didYouKnow}</p>
                </div>
              </div>

              {/* Spoken Heritage Guide Quote */}
              <div className="knowledge-vikram-voice-bar">
                <img 
                  src="/assets/characters/acharya-vikram-portrait.jpg" 
                  alt="Acharya Vikram" 
                  className="vikram-modal-avatar"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="vikram-modal-quote">
                  <strong>Acharya Vikram explains:</strong>
                  <p>&ldquo;Look closely at the Ganesh Pol. Notice how organic vegetable dyes and stone-burnished lime plaster have kept these sacred arabesques glowing for four centuries.&rdquo;</p>
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
      {/* 5. GANESH POL MASTERED CELEBRATION MODAL                             */}
      {/* ===================================================================== */}
      {showMasteryCelebration && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Ganesh Pol Mastered">
          <div className="sheesh-mastery-celebration-card ganesh-mastery-card">
            <div className="mastery-trophy-crest">
              <Award size={48} className="text-gold" />
            </div>

            <div className="mastery-badge-pill" style={{ backgroundColor: 'rgba(230, 179, 37, 0.2)', borderColor: '#e6b325', color: '#fef08a' }}>
              <Sparkles size={15} className="text-gold" />
              <span>GANESH POL MASTERED • 4/4 FEATURES MASTERED</span>
            </div>

            <h2 className="mastery-main-heading">GANESH POL MASTERED</h2>
            <p className="mastery-subtext" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <strong className="text-gold" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.25rem' }}>+80 XP</strong>
              Heritage knowledge unlocked. You have thoroughly explored and mastered all 4 architectural features of Ganesh Pol: the Royal Gateway, Auspicious Ganesha Symbolism, Painted Floral Ornamentation, and the Royal Transition into the inner palace.
            </p>

            <div className="mastery-reward-box">
              <div className="reward-box-item">
                <span className="reward-item-label">Amer Fort Clue</span>
                <strong className="reward-item-val text-emerald">
                  <CheckCircle2 size={16} />
                  <span>Ganesh Pol Gateway Completed</span>
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
                <span>RETURN TO AMER FORT COURTYARD</span>
              </button>

              <button
                className="btn-heritage-secondary"
                onClick={() => {
                  sound.playClick();
                  setShowMasteryCelebration(false);
                }}
              >
                <span>CONTINUE EXPLORING GANESH POL</span>
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
