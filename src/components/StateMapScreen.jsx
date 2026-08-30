import { useState } from 'react';
import { 
  Clock, 
  Award, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Camera,
  BookOpen,
  Lock,
  Unlock,
  Construction,
  Sparkles,
  X
} from 'lucide-react';
import { RAJASTHAN_STATE_DATA, getLocationProgressionState, getCompletedRajasthanCount } from '../data/statesData';
import { sound } from '../data/soundEffects';

export default function StateMapScreen({ onSelectLocation, playerStats, onOpenCodex }) {
  const [selectedLocationId, setSelectedLocationId] = useState('amer-fort');
  const [activeRegionFilter, setActiveRegionFilter] = useState('all');
  const [comingNextModalDest, setComingNextModalDest] = useState(null);

  const selectedLocation = RAJASTHAN_STATE_DATA.locations.find(
    (loc) => loc.id === selectedLocationId
  ) || RAJASTHAN_STATE_DATA.locations[0];

  const selectedProgState = getLocationProgressionState(selectedLocation.id, playerStats);
  const isCompleted = selectedProgState === 'COMPLETED';

  const filteredLocations = RAJASTHAN_STATE_DATA.locations.filter(loc => {
    if (activeRegionFilter === 'all') return true;
    return loc.region.toLowerCase().includes(activeRegionFilter.toLowerCase());
  });

  const completedCount = getCompletedRajasthanCount(playerStats);
  const totalCount = RAJASTHAN_STATE_DATA.locations.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handlePinClick = (location) => {
    sound.playClick();
    setSelectedLocationId(location.id);
  };

  const handleEnterLocation = (location) => {
    const progState = getLocationProgressionState(location.id, playerStats);
    if (
      location.id === 'amer-fort' || 
      location.id === 'mehrangarh-fort' || 
      location.id === 'jaisalmer-fort' || 
      location.id === 'chittorgarh-fort'
    ) {
      if (progState === 'UNLOCKED' || progState === 'COMPLETED') {
        sound.playChime();
        onSelectLocation(location);
        return;
      }
    }
    if (progState === 'UNLOCKED') {
      sound.playClick();
      setComingNextModalDest(location);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="state-map-screen">
      {/* Top Map Context Banner */}
      <div className="map-top-bar">
        <div className="map-title-block">
          <div className="state-badge-row">
            <span className="state-tag-pill">State Map</span>
            <span className="state-motto-pill">{RAJASTHAN_STATE_DATA.motto}</span>
          </div>
          <h2 className="map-state-name">{RAJASTHAN_STATE_DATA.fullName}</h2>
        </div>

        {/* Region Filter Buttons */}
        <div className="region-filter-strip" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`btn-sm ${activeRegionFilter === 'all' ? 'tab-btn-active' : 'btn-heritage-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={() => {
              sound.playClick();
              setActiveRegionFilter('all');
            }}
          >
            All Regions ({totalCount})
          </button>
          <button
            className={`btn-sm ${activeRegionFilter === 'dhundhar' ? 'tab-btn-active' : 'btn-heritage-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={() => {
              sound.playClick();
              setActiveRegionFilter('dhundhar');
            }}
          >
            Dhundhar (Jaipur)
          </button>
          <button
            className={`btn-sm ${activeRegionFilter === 'marwar' ? 'tab-btn-active' : 'btn-heritage-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={() => {
              sound.playClick();
              setActiveRegionFilter('marwar');
            }}
          >
            Marwar (Jodhpur)
          </button>
          <button
            className={`btn-sm ${activeRegionFilter === 'thar' ? 'tab-btn-active' : 'btn-heritage-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={() => {
              sound.playClick();
              setActiveRegionFilter('thar');
            }}
          >
            Thar (Jaisalmer)
          </button>
          <button
            className={`btn-sm ${activeRegionFilter === 'mewar' ? 'tab-btn-active' : 'btn-heritage-secondary'}`}
            style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={() => {
              sound.playClick();
              setActiveRegionFilter('mewar');
            }}
          >
            Mewar (Chittorgarh)
          </button>
        </div>

        {/* State Progress & Codex Access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="state-completion-stat">
            <div className="stat-row">
              <span>Rajasthan Mastery</span>
              <strong>{completedCount} / {totalCount} Mastered</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {onOpenCodex && (
            <button
              className="btn-heritage-secondary btn-sm"
              style={{ borderRadius: '9999px', padding: '0.45rem 0.85rem' }}
              onClick={() => {
                sound.playClick();
                onOpenCodex();
              }}
              title="Open Heritage Codex"
            >
              <BookOpen size={14} />
              <span>Codex</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="map-layout-grid">
        {/* Interactive SVG Map Container */}
        <div className="map-canvas-card">
          <div className="map-canvas-header">
            <div className="map-canvas-title">
              <Compass size={18} className="text-gold" />
              <span>Interactive Realm Map: Rajasthan</span>
            </div>
            <span className="map-hint">Tap any glowing pin to inspect location</span>
          </div>

          <div className="svg-map-wrapper">
            <svg 
              viewBox="0 0 800 600" 
              className="rajasthan-svg-map"
              role="img"
              aria-label="Interactive Map of Rajasthan"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2e1065" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#18181b" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="aravalliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c2593f" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#e6b325" stopOpacity="0.2" />
                </linearGradient>

                <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* State Geographic Contour Shape (Stylized Rajasthan Geometry) */}
              <path
                d="M 220,100 
                   L 420,60 
                   L 600,110 
                   L 730,220 
                   L 690,360 
                   L 750,460 
                   L 620,530 
                   L 460,570 
                   L 300,530 
                   L 200,430 
                   L 100,320 
                   L 120,190 
                   Z"
                fill="url(#desertGrad)"
                stroke="rgba(212, 163, 89, 0.45)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="state-boundary-path"
              />

              {/* Aravalli Mountain Spine Feature */}
              <path
                d="M 280,520 Q 420,380 620,130"
                fill="none"
                stroke="url(#aravalliGrad)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray="14 10"
                className="aravalli-ridge"
              />
              <text x="430" y="340" fill="rgba(255, 213, 107, 0.4)" fontSize="13" fontStyle="italic" letterSpacing="4">
                ARAVALLI RANGE
              </text>

              {/* Thar Desert Region Texture */}
              <text x="170" y="260" fill="rgba(245, 158, 11, 0.3)" fontSize="14" fontWeight="600" letterSpacing="5">
                GREAT THAR DESERT
              </text>

              {/* Geographic Grid Markings */}
              <line x1="100" y1="300" x2="700" y2="300" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 8" />
              <line x1="400" y1="80" x2="400" y2="550" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 8" />

              {/* Location Landmark Pins */}
              {filteredLocations.map((loc) => {
                const isSelected = loc.id === selectedLocationId;
                const isCompleted = playerStats.completedLocations.includes(loc.id);
                // Convert percentage coordinates to SVG viewBox (800 x 600)
                const pinX = (loc.coordinates.x / 100) * 800;
                const pinY = (loc.coordinates.y / 100) * 600;

                return (
                  <g 
                    key={loc.id}
                    transform={`translate(${pinX}, ${pinY})`}
                    onClick={() => handlePinClick(loc)}
                    className={`map-pin-group ${isSelected ? 'pin-selected' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Animated Pulsing Ring */}
                    <circle
                      r={isSelected ? "26" : "18"}
                      fill="none"
                      stroke={isCompleted ? "var(--emerald-accent)" : "var(--gold-primary)"}
                      strokeWidth="2"
                      opacity="0.6"
                      className="pin-pulse-ring"
                    />

                    {/* Outer Glow Halo */}
                    <circle
                      r={isSelected ? "20" : "14"}
                      fill={isCompleted ? "rgba(16, 185, 129, 0.25)" : "rgba(230, 179, 37, 0.25)"}
                      filter="url(#glowEffect)"
                    />

                    {/* Main Pin Core */}
                    <circle
                      r={isSelected ? "14" : "10"}
                      fill={isCompleted ? "var(--emerald-accent)" : "var(--gold-primary)"}
                      stroke="#0d1117"
                      strokeWidth="2.5"
                    />

                    {/* Completion Star or Central Dot */}
                    {isCompleted ? (
                      <path
                        d="M 0,-4 L 1.2,-1 L 4,-1 L 1.8,0.8 L 2.6,3.5 L 0,2 L -2.6,3.5 L -1.8,0.8 L -4,-1 L -1.2,-1 Z"
                        fill="#0d1117"
                        transform="scale(1.2)"
                      />
                    ) : (
                      <circle r="3.5" fill="#0d1117" />
                    )}

                    {/* Pin Label */}
                    <rect
                      x={pinX > 400 ? -125 : 18}
                      y="-14"
                      width="115"
                      height="26"
                      rx="13"
                      fill="rgba(13, 17, 23, 0.88)"
                      stroke={isSelected ? "var(--gold-primary)" : "rgba(212, 163, 89, 0.4)"}
                      strokeWidth="1.2"
                    />
                    <text
                      x={pinX > 400 ? -68 : 75}
                      y="4"
                      textAnchor="middle"
                      fill={isSelected ? "var(--gold-light)" : "var(--text-primary)"}
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Outfit, sans-serif"
                    >
                      {loc.name.split('&')[0].trim()}
                    </text>
                  </g>
                );
              })}

              {/* Decorative Compass Rose */}
              <g transform="translate(680, 110)">
                <circle r="32" fill="rgba(13, 17, 23, 0.6)" stroke="rgba(212, 163, 89, 0.3)" />
                <path d="M 0,-24 L 6,-6 L 24,0 L 6,6 L 0,24 L -6,6 L -24,0 L -6,-6 Z" fill="var(--gold-primary)" opacity="0.8" />
                <text x="0" y="-27" textAnchor="middle" fill="var(--gold-light)" fontSize="10" fontWeight="bold">N</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Location Preview Card (Active Selection Details) */}
        <div className="location-detail-panel">
          {selectedLocation.heroImage && (
            <div className="location-preview-photo-wrap">
              <img 
                src={selectedLocation.heroImage} 
                alt={selectedLocation.name}
                className="location-preview-photo"
                loading="eager"
              />
              <div className="photo-badge-overlay">
                <Camera size={12} />
                <span>Heritage Photography</span>
              </div>
            </div>
          )}

          <div className="panel-badge-row">
            <span className="badge-region">{selectedLocation.region}</span>
            <span className="badge-difficulty">{selectedLocation.difficulty}</span>
          </div>

          <h3 className="location-panel-title">{selectedLocation.name}</h3>
          <div className="location-panel-subtitle">{selectedLocation.subtitle}</div>
          <div className="location-era-tag">{selectedLocation.era}</div>

          <p className="location-panel-desc">{selectedLocation.shortDesc}</p>

          {/* Quick Stats Grid */}
          <div className="location-quick-stats">
            <div className="quick-stat-box">
              <Clock size={16} className="text-gold" />
              <div>
                <span className="stat-label">Duration</span>
                <span className="stat-value">{selectedLocation.estTime}</span>
              </div>
            </div>

            <div className="quick-stat-box">
              <Award size={16} className="text-gold" />
              <div>
                <span className="stat-label">Relic Reward</span>
                <span className="stat-value">{selectedLocation.relic.name}</span>
              </div>
            </div>
          </div>

          {/* Guide Preview */}
          <div className="guide-preview-box">
            <div className="guide-avatar-badge">{selectedLocation.guide.avatarText}</div>
            <div className="guide-preview-text">
              <strong>{selectedLocation.guide.name}</strong>
              <span>{selectedLocation.guide.role}</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="location-panel-actions">
            {isCompleted && (
              <div className="completion-status-chip">
                <CheckCircle2 size={16} color="var(--emerald-accent)" />
                <span>Monument Trial Mastered (+{selectedLocation.relic.xpReward} XP Earned)</span>
              </div>
            )}

            {selectedProgState === 'COMPLETED' ? (
              <button
                className="btn-heritage-primary btn-enter-location"
                onClick={() => handleEnterLocation(selectedLocation)}
                id={`enter-${selectedLocation.id}`}
              >
                <span>Replay {selectedLocation.name.split('&')[0].trim()}</span>
                <ArrowRight size={18} />
              </button>
            ) : selectedProgState === 'UNLOCKED' ? (
              <button
                className="btn-heritage-primary btn-enter-location pulse-gold"
                onClick={() => handleEnterLocation(selectedLocation)}
                id={`enter-${selectedLocation.id}`}
              >
                <Unlock size={16} />
                <span>Enter {selectedLocation.name.split('&')[0].trim()}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="btn-heritage-secondary btn-enter-location btn-locked-destination"
                disabled
              >
                <Lock size={16} />
                <span>Locked • Complete Prior Fort</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Locations Navigation Carousel / Cards */}
      <div className="locations-bottom-strip">
        <h4 className="strip-heading">Available Landmarks in Rajasthan ({completedCount}/{totalCount} Completed)</h4>
        <div className="locations-card-carousel">
          {filteredLocations.map((loc) => {
            const isSelected = loc.id === selectedLocationId;
            const locProgState = getLocationProgressionState(loc.id, playerStats);
            const isDone = locProgState === 'COMPLETED';
            const isLocUnlocked = locProgState === 'UNLOCKED';

            return (
              <div
                key={loc.id}
                className={`location-strip-card ${isSelected ? 'active-strip-card' : ''} ${isDone ? 'done-strip-card' : ''} ${locProgState === 'LOCKED' ? 'locked-strip-card' : ''}`}
                onClick={() => handlePinClick(loc)}
              >
                <div className="strip-card-top">
                  <span className="strip-loc-name">{loc.name}</span>
                  {isDone ? (
                    <CheckCircle2 size={14} color="var(--emerald-accent)" />
                  ) : isLocUnlocked ? (
                    <Unlock size={14} className="text-gold" />
                  ) : (
                    <Lock size={14} className="text-muted" />
                  )}
                </div>
                <div className="strip-loc-region">{loc.region}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming Next Modal */}
      {comingNextModalDest && (
        <div className="modal-overlay" onClick={() => setComingNextModalDest(null)} role="dialog" aria-modal="true">
          <div className="modal-content coming-next-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Construction size={22} className="text-gold" />
                <h3>EXPEDITION CHAPTER UNLOCKED</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setComingNextModalDest(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="coming-next-hero-badge">
                <Unlock size={16} className="text-emerald" />
                <span>UNLOCKED DESTINATION &bull; COMING NEXT</span>
              </div>

              <h2 className="coming-next-title">{comingNextModalDest.name}</h2>
              <p className="coming-next-region">{comingNextModalDest.region} ({comingNextModalDest.era})</p>

              <p className="coming-next-desc">
                {comingNextModalDest.shortDesc}
              </p>

              <div className="coming-next-notice-box">
                <Sparkles size={18} className="text-gold" />
                <div>
                  <strong>Congratulations, Explorer!</strong>
                  <p>
                    You have unlocked <strong>{comingNextModalDest.name}</strong> by completing the prior heritage quest. 
                    The interactive 360° walk and restoration workbench for this citadel are currently under development.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button 
                className="btn-heritage-secondary" 
                onClick={() => {
                  setComingNextModalDest(null);
                  if (onOpenCodex) onOpenCodex();
                }}
              >
                <BookOpen size={16} />
                <span>View in Heritage Codex</span>
              </button>

              <button 
                className="btn-heritage-primary" 
                onClick={() => setComingNextModalDest(null)}
              >
                <span>Back to Realm Map</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
