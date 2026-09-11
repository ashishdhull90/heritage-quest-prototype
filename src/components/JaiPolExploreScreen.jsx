import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Compass, 
  Camera, 
  Shield, 
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
  Authentic Jai Pol Knowledge Hotspots
  The 4 Independent Masterable Features:
  1. GRAND FORT GATEWAY (Hotspot 1: Grand Gateway)
  2. DEFENSIVE ARCHITECTURE (Hotspot 2: Fortified Bastions & Steep Ramp)
  3. STONE CRAFTSMANSHIP (Hotspot 3: Jodhpur Red Sandstone & Parapets)
  4. ROYAL ENTRANCE (Hotspot 4: Threshold to the Citadel)
*/
const HOTSPOTS_DATA = [
  {
    id: 'hotspot_grand_gateway',
    number: 1,
    title: 'Victory Gate & Main Citadel Portal',
    category: 'GRAND FORT GATEWAY',
    icon: DoorOpen,
    color: '#e6b325',
    tagColor: 'rgba(230, 179, 37, 0.2)',
    shortDesc: 'The massive victory portal built by Maharaja Man Singh in 1806, serving as the main public entrance to Mehrangarh Fort.',
    lore: 'Erected in 1806 CE by Maharaja Man Singh of Marwar, Jai Pol (The Gate of Victory) was built to celebrate his historic triumph over the invading allied armies of Jaipur and Bikaner. Soaring prominently above the approach ramp on the northern ridge of the fort, this massive gatehouse serves as the principal grand portal welcoming visitors and dignitaries into the majestic citadel.',
    importance: 'As the foremost of the seven monumental gates guarding Mehrangarh, Jai Pol stands as an enduring symbol of Marwar resilience and architectural power.',
    didYouKnow: 'The name "Jai Pol" directly translates to "Gate of Victory" in the Marwari language, marking the triumph that preserved Jodhpur\'s independence in the early 19th century.',
    xpReward: 20,
    preferredViewId: 'view_grand_gateway'
  },
  {
    id: 'hotspot_defensive_arch',
    number: 2,
    title: 'Fortified Bastions & Steep Defensive Ramp',
    category: 'DEFENSIVE ARCHITECTURE',
    icon: Shield,
    color: '#f97316',
    tagColor: 'rgba(249, 115, 22, 0.2)',
    shortDesc: 'Steeply inclined approach road, towering curtain walls, and narrow angles designed to prevent elephant rams and siege charges.',
    lore: 'Rajput military architects designed the approach to Jai Pol with an extreme upward gradient and sharp switchbacks to rob enemy cavalry and armored war elephants of charging momentum. Towering red sandstone ramparts and bastions flank the gateway, providing multiple overlapping lines of defense where defenders could unleash arrows and matchlock musketry.',
    importance: 'The defensive gateway demonstrates medieval siege defense principles, where narrow ascents and towering battlements rendered frontal assaults nearly impossible.',
    didYouKnow: 'The approach ramp was deliberately paved with rough-hewn stone so that charging war elephants and cavalry horses would lose their footing on the steep incline.',
    xpReward: 20,
    preferredViewId: 'view_defensive_arch'
  },
  {
    id: 'hotspot_stone_craft',
    number: 3,
    title: 'Jodhpur Red Sandstone & Carved Parapets',
    category: 'STONE CRAFTSMANSHIP',
    icon: Palette,
    color: '#ec4899',
    tagColor: 'rgba(236, 72, 153, 0.2)',
    shortDesc: 'Hand-carved Marwar sandstone arches, decorative brackets, and crenellated battlements crafted by master masons.',
    lore: 'Constructed from locally quarried Jodhpur red and buff sandstone, Jai Pol reflects the extraordinary skill of Marwar stonemasons. The facade features finely carved corbelled brackets (todas), multi-foil arches, projecting jharokhas (balcony pavilions), and decorative crenellations that seamlessly merge military strength with exquisite artistic grace.',
    importance: 'The stone masonry exemplifies the distinctive Marwar architectural style, sculpting tough desert sandstone into intricate motifs that have endured centuries of desert sun and wind.',
    didYouKnow: 'Master artisans assembled the massive sandstone blocks using precision interlocking mortise-and-tenon joints and lime mortar, creating an earthquake-resilient structure without iron reinforcement.',
    xpReward: 20,
    preferredViewId: 'view_stone_craft'
  },
  {
    id: 'hotspot_royal_entrance',
    number: 4,
    title: 'Citadel Threshold & Royal Ascent',
    category: 'ROYAL ENTRANCE',
    icon: Crown,
    color: '#10b981',
    tagColor: 'rgba(16, 185, 129, 0.2)',
    shortDesc: 'The ceremonial threshold leading travelers from the exterior approach into the inner courtyards and royal palaces.',
    lore: 'Passing beneath the arched portal of Jai Pol marks the dramatic spatial transition from the rugged exterior of Bhakurcheeria hill into the royal fort complex. Beyond Jai Pol, the paved causeway winds through subsequent fortified gates—including Fateh Pol, Dedh Kangra Pol, and Loha Pol—eventually reaching the royal courtyards of Shringar Chowk.',
    importance: 'The gateway served as a ceremonial entrance where visiting royalty, state envoys, and victory processions were received with traditional fanfare before ascending to the private palaces.',
    didYouKnow: 'Royal processions with drums and caparisoned elephants would halt at Jai Pol for ceremonial greetings before continuing their ascent into the inner palaces.',
    xpReward: 20,
    preferredViewId: 'view_royal_entrance'
  }
];

/*
  Exploration Views mapped to the official photograph:
  /assets/monuments/mehrangarh-fort/jai-pol.jpg
*/
const EXPLORATION_VIEWS = [
  {
    id: 'view_overview',
    title: 'Jai Pol Grand Gateway & Twin Towers Panorama',
    subtitle: 'Monumental 1806 CE portal with flanking rounded bastions, carved relief arches and battlements',
    image: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    zoom: 1.0,
    panX: 0,
    panY: 0,
    hotspotPositions: {
      hotspot_grand_gateway: { x: 50, y: 72 },
      hotspot_defensive_arch: { x: 20, y: 32 },
      hotspot_stone_craft: { x: 50, y: 52 },
      hotspot_royal_entrance: { x: 50, y: 88 }
    }
  },
  {
    id: 'view_grand_gateway',
    title: '1. Grand Fort Gateway (Jai Pol Portal)',
    subtitle: 'Arched gateway frame with floral medallions, corbels and carved victory lintels',
    image: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    zoom: 1.8,
    panX: 0,
    panY: -20,
    hotspotPositions: {
      hotspot_grand_gateway: { x: 50, y: 72 },
      hotspot_stone_craft: { x: 50, y: 52 }
    }
  },
  {
    id: 'view_defensive_arch',
    title: '2. Defensive Architecture & Twin Bastions',
    subtitle: 'Soaring curved sandstone towers engineered to repel elephant rams and siege engines',
    image: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    zoom: 1.75,
    panX: 20,
    panY: 15,
    hotspotPositions: {
      hotspot_defensive_arch: { x: 20, y: 32 }
    }
  },
  {
    id: 'view_stone_craft',
    title: '3. Stone Craftsmanship & Carved Medallions',
    subtitle: 'Detailed Marwar sandstone relief panels, multi-tiered brackets and crenellations',
    image: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    zoom: 2.1,
    panX: 0,
    panY: 0,
    hotspotPositions: {
      hotspot_stone_craft: { x: 50, y: 52 },
      hotspot_grand_gateway: { x: 50, y: 72 }
    }
  },
  {
    id: 'view_royal_entrance',
    title: '4. Royal Entrance & Citadel Threshold',
    subtitle: 'Main arched passageway through which royalty, armies and visitors ascend into Mehrangarh',
    image: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    zoom: 1.9,
    panX: 0,
    panY: -30,
    hotspotPositions: {
      hotspot_royal_entrance: { x: 50, y: 88 },
      hotspot_grand_gateway: { x: 50, y: 72 }
    }
  }
];

/*
  Authentic Gallery Assets for Jai Pol
  Uses the official uploaded photograph as the verified authentic asset.
*/
const GALLERY_ITEMS = [
  {
    id: 'gal_jaipol_main',
    title: 'Jai Pol Victory Gateway & Approach Ramp',
    subtitle: 'Official Documentary Photograph • 1806 CE Portal • Mehrangarh Fort',
    url: '/assets/monuments/mehrangarh-fort/jai-pol.jpg',
    caption: 'The monumental Jai Pol gatehouse captured along the ascending stone ramparts of Mehrangarh Fort in Jodhpur.'
  },
  {
    id: 'gal_mehrangarh_home',
    title: 'Mehrangarh Fort Exterior & Volcanic Cliffs',
    subtitle: 'UNESCO Tentative Heritage Complex • Jodhpur, Rajasthan',
    url: '/assets/monuments/mehrangarh-fort/mehrangarh-home.jpg',
    caption: 'Archival view of the towering 15th-century sandstone fortress perched atop the sheer cliffs of Bhakurcheeria overlooking Jodhpur.'
  }
];

const JAI_POL_STORAGE_KEY = 'heritage_jai_pol_mastered_features';
const JAI_POL_MASTERY_KEY = 'heritage_jai_pol_mastery_awarded';

export default function JaiPolExploreScreen({
  location: _location,
  playerStats,
  onCompleteJaiPol,
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
      const saved = localStorage.getItem(JAI_POL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter to only valid hotspot IDs
          const validIds = HOTSPOTS_DATA.map(h => h.id);
          return parsed.filter(id => validIds.includes(id));
        }
      }
    } catch (e) {
      console.warn('Could not read saved Jai Pol progress', e);
    }
    return [];
  });

  // Selected Hotspot for Knowledge Modal (Opening NEVER auto-masters!)
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Floating Toast Notification
  const [discoveryToast, setDiscoveryToast] = useState(null);

  // Jai Pol Mastery Celebration State
  const [showMasteryCelebration, setShowMasteryCelebration] = useState(false);
  const [hasAwardedMastery, setHasAwardedMastery] = useState(() => {
    try {
      return localStorage.getItem(JAI_POL_MASTERY_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Persist mastered hotspots to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(JAI_POL_STORAGE_KEY, JSON.stringify(discoveredHotspots));
    } catch (e) {
      console.warn('Could not persist Jai Pol progress', e);
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
          localStorage.setItem(JAI_POL_MASTERY_KEY, 'true');
        } catch (e) {
          console.warn('Could not save mastery state', e);
        }
        setTimeout(() => {
          sound.playVictoryFanfare();
          setShowMasteryCelebration(true);
          if (onCompleteJaiPol) {
            onCompleteJaiPol({ xpAward: 80 });
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
    <div className="sheesh-mahal-master-screen ganesh-pol-master-screen jai-pol-master-screen" role="region" aria-label="Jai Pol Interactive Exploration">
      {/* ===================================================================== */}
      {/* 1. TOP HUD BAR                                                        */}
      {/* ===================================================================== */}
      <div className="sheesh-hud-bar ganesh-hud-bar jai-hud-bar">
        <div className="sheesh-hud-left">
          <button 
            className="sheesh-back-btn ganesh-back-btn jai-back-btn"
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
            <h1 className="sheesh-location-title">Jai Pol &bull; Victory Gateway</h1>
          </div>
        </div>

        {/* Center Progress HUD Chip */}
        <div className="sheesh-hud-center">
          <div className="sheesh-discovery-counter-chip">
            <div className="counter-icon-wrap">
              {isAllMastered ? (
                <CheckCircle2 size={16} className="text-emerald" />
              ) : (
                <DoorOpen size={16} className="text-gold" />
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
        <aside className="sheesh-nav-dock jai-nav-dock" aria-label="Exploration Navigation">
          <div className="sheesh-dock-brand">
            <DoorOpen size={20} className="text-gold" />
            <div className="brand-text">
              <strong>MEHRANGARH</strong>
              <span>Jai Pol</span>
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
              title="History & Overview"
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
                  ? 'Outstanding scholarship! You have explored and mastered all 4 architectural features of Jai Pol.'
                  : `Inspect the victory gateway and master all 4 architectural features (${discoveriesCount}/4 completed).`}
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
                {/* 1. Real Official Uploaded Photograph in 100% Original Full Color */}
                <img 
                  src={currentView.image} 
                  alt={currentView.title} 
                  className="jai-real-photo-backdrop"
                  style={{ filter: 'none', WebkitFilter: 'none' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/monuments/mehrangarh-fort/jai-pol.jpg';
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
                  <span className="badge-gold-outline">1806 CE • MAHARAJA MAN SINGH • VICTORY GATEWAY</span>
                  <h2>Jai Pol — Grand Entrance to the Sun Citadel</h2>
                  <p className="hero-lead-text">
                    Commissioned in 1806 CE by Maharaja Man Singh of Marwar, Jai Pol (The Victory Gate) stands as a monumental celebration of Rathore triumph against invading forces. Guarding the northern ascent of Mehrangarh Fort, it serves as the foremost of seven fortified portals leading from the desert slopes of Jodhpur into the royal fort complex.
                  </p>
                </div>

                <div className="overview-featured-photo-row">
                  <div className="overview-photo-frame">
                    <img 
                      src="/assets/monuments/mehrangarh-fort/jai-pol.jpg" 
                      alt="Jai Pol Gateway Facade" 
                      className="overview-real-photo"
                      style={{ filter: 'none', WebkitFilter: 'none' }}
                    />
                    <div className="photo-tag-strip">
                      <Camera size={13} className="text-gold" />
                      <span>Jai Pol Gateway Facade & Ascending Stone Ramparts</span>
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
                      <span>Mehrangarh Fort Cliff & Palace Complex</span>
                    </div>
                  </div>
                </div>

                <div className="overview-sections-grid">
                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><DoorOpen size={20} className="text-gold" /></div>
                    <h3>1. Grand Fort Gateway</h3>
                    <p>
                      Built from massive blocks of local Jodhpur red sandstone, Jai Pol features an imposing central portal flanked by multi-tiered decorative niches and soaring parapets.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Shield size={20} className="text-amber" /></div>
                    <h3>2. Defensive Architecture</h3>
                    <p>
                      The steeply inclined approach ramp, sharp switchbacks, and towering curtain walls were engineered to neutralize elephant rams and break enemy siege momentum.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Palette size={20} className="text-pink" /></div>
                    <h3>3. Stone Craftsmanship</h3>
                    <p>
                      The gate showcases the mastery of Marwar masons with carved sandstone brackets (todas), multi-foil arches, projecting jharokhas, and crenellated battlements.
                    </p>
                  </div>

                  <div className="overview-card-tile">
                    <div className="tile-icon-circle"><Crown size={20} className="text-emerald" /></div>
                    <h3>4. Royal Entrance</h3>
                    <p>
                      As the primary ceremonial entrance into the citadel, Jai Pol marks the majestic transition from the desert city of Jodhpur to the palatial quarters of Mehrangarh.
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
                <h2>4 Architectural Features of Jai Pol</h2>
                <p className="text-secondary">
                  Investigate and master each architectural and military feature to understand how ancient Rajasthani master masons merged structural defense, monumental commemoration, and royal gateway architecture.
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
                <h2>Jai Pol Archival Photography</h2>
                <p className="text-secondary">
                  High-resolution documentary photographs capturing the red sandstone gatehouse, steep defensive ramps, and panoramic views of Mehrangarh Fort.
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
                  src="/assets/monuments/mehrangarh-fort/jai-pol.jpg" 
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
                  <p>&ldquo;Look closely at Jai Pol. Notice how the steep incline and imposing red sandstone masonry created an impregnable defense while proudly asserting the victory of Marwar.&rdquo;</p>
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
      {/* 5. JAI POL MASTERED CELEBRATION MODAL                                */}
      {/* ===================================================================== */}
      {showMasteryCelebration && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Jai Pol Mastered">
          <div className="sheesh-mastery-celebration-card ganesh-mastery-card jai-mastery-card">
            <div className="mastery-trophy-crest">
              <Award size={48} className="text-gold" />
            </div>

            <div className="mastery-badge-pill" style={{ backgroundColor: 'rgba(230, 179, 37, 0.2)', borderColor: '#e6b325', color: '#fef08a' }}>
              <Sparkles size={15} className="text-gold" />
              <span>JAI POL MASTERED • 4/4 FEATURES MASTERED</span>
            </div>

            <h2 className="mastery-main-heading">JAI POL MASTERED</h2>
            <p className="mastery-subtext" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <strong className="text-gold" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.25rem' }}>+80 XP</strong>
              Heritage knowledge unlocked. You have thoroughly explored and mastered all 4 architectural features of Jai Pol: the Grand Fort Gateway, Defensive Architecture, Stone Craftsmanship, and the Royal Entrance into the citadel.
            </p>

            <div className="mastery-reward-box">
              <div className="reward-box-item">
                <span className="reward-item-label">Mehrangarh Clue</span>
                <strong className="reward-item-val text-emerald">
                  <CheckCircle2 size={16} />
                  <span>Jai Pol Gateway Completed</span>
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
                <span>CONTINUE EXPLORING JAI POL</span>
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
