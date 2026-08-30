import { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Award, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  MapPin, 
  Play, 
  RotateCcw, 
  Shield, 
  Clock, 
  Unlock,
  X,
  Construction
} from 'lucide-react';
import { sound } from '../data/soundEffects';
import { getLocationProgressionState, getCompletedRajasthanCount } from '../data/statesData';

export default function RajasthanJourneyHub({ 
  onEnterAmerFort, 
  onSelectLocation,
  onOpenMap, 
  onOpenCodex, 
  playerStats 
}) {
  const isAmerCompleted = playerStats.completedLocations?.includes('amer-fort') ||
                          playerStats.completedExplorations?.includes('amer-fort') ||
                          playerStats.unlockedRelics?.some(r => r.id === 'relic_amer_mirror');

  const isMehrangarhCompleted = playerStats.completedLocations?.includes('mehrangarh-fort') ||
                                playerStats.completedExplorations?.includes('mehrangarh-fort') ||
                                playerStats.unlockedRelics?.some(r => r.id === 'relic_mehrangarh_inscription');

  const isJaisalmerCompleted = playerStats.completedLocations?.includes('jaisalmer-fort') ||
                               playerStats.completedExplorations?.includes('jaisalmer-fort') ||
                               playerStats.unlockedRelics?.some(r => r.id === 'relic_jaisalmer_route');

  const isChittorgarhCompleted = playerStats.completedLocations?.includes('chittorgarh-fort') ||
                                playerStats.completedExplorations?.includes('chittorgarh-fort') ||
                                playerStats.unlockedRelics?.some(r => r.id === 'relic_chittorgarh_crest');

  const [hoveredWaypoint, setHoveredWaypoint] = useState(null);
  const [comingNextModalDest, setComingNextModalDest] = useState(null);
  const [showUnlockToast, setShowUnlockToast] = useState(() => {
    try {
      if (isChittorgarhCompleted) {
        return null;
      } else if (isJaisalmerCompleted) {
        const toastKey = 'heritage_seen_chittorgarh_unlock';
        const hasSeenToast = sessionStorage.getItem(toastKey);
        if (!hasSeenToast) {
          sessionStorage.setItem(toastKey, 'true');
          return {
            title: 'CHITTORGARH FORT (Mewar)',
            subtitle: 'The supreme bastion of Rajput valor is now unlocked!'
          };
        }
      } else if (isMehrangarhCompleted) {
        const toastKey = 'heritage_seen_jaisalmer_unlock';
        const hasSeenToast = sessionStorage.getItem(toastKey);
        if (!hasSeenToast) {
          sessionStorage.setItem(toastKey, 'true');
          return {
            title: 'JAISALMER FORT (Sonar Qila)',
            subtitle: 'The golden desert citadel is now unlocked on your journey!'
          };
        }
      } else if (isAmerCompleted) {
        const toastKey = 'heritage_seen_mehrangarh_unlock';
        const hasSeenToast = sessionStorage.getItem(toastKey);
        if (!hasSeenToast) {
          sessionStorage.setItem(toastKey, 'true');
          return {
            title: 'MEHRANGARH FORT (Jodhpur)',
            subtitle: 'Your next Rajasthan heritage chapter awaits!'
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Auto-dismiss transient unlock toast after 3.6s
  useEffect(() => {
    if (showUnlockToast) {
      const timer = setTimeout(() => {
        setShowUnlockToast(null);
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [showUnlockToast]);

  // The 4 Rajasthan Heritage Destinations
  const DESTINATIONS = [
    {
      id: 'amer-fort',
      name: 'AMER FORT',
      city: 'Jaipur',
      region: 'Dhundhar Region',
      era: '1592 CE (Raja Man Singh I)',
      shortDesc: 'A hilltop fortress blending Rajput stonecraft and Mughal mirror elegance overlooking Maota Lake.',
      image: '/assets/monuments/amer-fort/amer-fort-panorama.jpg',
      relicName: 'Sun Mirror of Amer',
      features: ['Scalloped Lotus Arches', 'Sheesh Mahal Mirror Stars', 'Persian Wheel Water Lift']
    },
    {
      id: 'mehrangarh-fort',
      name: 'MEHRANGARH FORT',
      city: 'Jodhpur',
      region: 'Marwar Region',
      era: '1459 CE (Rao Jodha)',
      shortDesc: 'Perched 400 feet above the blue city of Jodhpur on sheer volcanic cliffs.',
      image: '/assets/monuments/mehrangarh-fort/mehrangarh-fort.jpg',
      relicName: 'Mehrangarh Inscription Relic',
      features: ['1459 CE Foundation Inscription', 'Seven Defensive Gates (Jayapol)', 'Ranisar Stepwell Waterworks']
    },
    {
      id: 'jaisalmer-fort',
      name: 'JAISALMER FORT',
      city: 'Jaisalmer',
      region: 'Thar Desert',
      era: '1156 CE (Rawal Jaisal)',
      shortDesc: 'The living Golden Fortress (Sonar Qila) sculpted from golden yellow sandstone.',
      image: '/assets/monuments/jaisalmer-fort/jaisalmer-fort-panorama.jpg',
      relicName: 'Golden Route Relic',
      features: ['Caravan Silk Road Crossroads', 'Sonar Qila Living Citadel', 'Patwon Ki Haveli Stone Filigree']
    },
    {
      id: 'chittorgarh-fort',
      name: 'CHITTORGARH FORT',
      city: 'Chittorgarh',
      region: 'Mewar Region',
      era: '7th Century CE (Mori Dynasty)',
      shortDesc: 'The monumental hill bastion spanning 700 acres, famed for the Vijay Stambha (Tower of Victory).',
      image: '/assets/monuments/chittorgarh-fort/chittorgarh-fort-panorama.jpg',
      relicName: 'Guardian of Chittorgarh',
      features: ['Vijay Stambha (Victory Tower)', 'Preservation Stewardship', 'Gaumukh Reservoir']
    }
  ];

  const completedCount = getCompletedRajasthanCount(playerStats);
  const progressPercent = Math.round((completedCount / DESTINATIONS.length) * 100);

  const handleDestinationAction = (dest, progressionState) => {
    if (dest.id === 'amer-fort') {
      sound.playChime();
      onEnterAmerFort();
    } else if (
      (dest.id === 'mehrangarh-fort' || dest.id === 'jaisalmer-fort' || dest.id === 'chittorgarh-fort') &&
      (progressionState === 'UNLOCKED' || progressionState === 'COMPLETED')
    ) {
      sound.playChime();
      if (onSelectLocation) onSelectLocation(dest);
    } else if (progressionState === 'UNLOCKED') {
      sound.playClick();
      setComingNextModalDest(dest);
    }
  };

  return (
    <div className="journey-hub-container">
      {/* Transient New Destination Unlock Banner (auto-dismisses) */}
      {showUnlockToast && (
        <div className="transient-unlock-banner animate-fade-in" role="status" aria-live="polite">
          <div className="unlock-banner-content">
            <div className="unlock-banner-icon pulse-gold">
              <Unlock size={20} className="text-gold" />
            </div>
            <div className="unlock-banner-text">
              <span className="unlock-banner-label">NEW DESTINATION UNLOCKED</span>
              <strong className="unlock-banner-title">{showUnlockToast.title}</strong>
              <p className="unlock-banner-sub">{showUnlockToast.subtitle}</p>
            </div>
            <button 
              className="unlock-banner-close"
              onClick={() => setShowUnlockToast(null)}
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. TOP HERO & REALM BANNER                                             */}
      {/* ===================================================================== */}
      <section className="journey-hero-banner">
        <div className="hero-top-meta-row">
          <div className="realm-indicator-badge">
            <span className="pulse-indicator-dot"></span>
            <span>REALM OF RAJASTHAN &bull; PADHARO MHARE DES</span>
          </div>

          <div className="hero-quick-access-tray">
            <button 
              className="btn-heritage-secondary btn-sm"
              onClick={() => {
                sound.playClick();
                onOpenCodex();
              }}
              title="Open Heritage Codex & Relic Vault"
            >
              <BookOpen size={15} />
              <span>Heritage Codex</span>
              {playerStats.unlockedRelics.length > 0 && (
                <span className="quick-badge-count">{playerStats.unlockedRelics.length}</span>
              )}
            </button>

            <button 
              className="btn-heritage-secondary btn-sm"
              onClick={() => {
                sound.playClick();
                onOpenMap();
              }}
              title="Open Interactive State Map"
            >
              <Compass size={15} />
              <span>Interactive Realm Map</span>
            </button>
          </div>
        </div>

        <div className="journey-title-group">
          <h1 className="journey-main-title">RAJASTHAN</h1>
          <p className="journey-subtitle">&ldquo;Your Heritage Journey&rdquo;</p>
        </div>

        {/* Player Progress Stats Ribbon */}
        <div className="journey-progress-ribbon">
          <div className="progress-ribbon-item">
            <div className="ribbon-icon-frame icon-rank">
              <Shield size={18} className="text-gold" />
            </div>
            <div className="ribbon-text-block">
              <span className="ribbon-label">EXPLORER LEVEL</span>
              <strong className="ribbon-value text-gold">{playerStats.rankTitle || 'Apprentice Explorer'}</strong>
            </div>
          </div>

          <div className="progress-ribbon-item">
            <div className="ribbon-icon-frame icon-xp">
              <Sparkles size={18} className="text-gold" />
            </div>
            <div className="ribbon-text-block">
              <span className="ribbon-label">LORE XP</span>
              <strong className="ribbon-value text-gold">{playerStats.xp} XP</strong>
            </div>
          </div>

          <div className="progress-ribbon-item">
            <div className="ribbon-icon-frame icon-relic">
              <Award size={18} className="text-emerald" />
            </div>
            <div className="ribbon-text-block">
              <span className="ribbon-label">SACRED RELICS</span>
              <strong className="ribbon-value text-emerald">{playerStats.unlockedRelics.length} / 4 Collected</strong>
            </div>
          </div>

          <div className="progress-ribbon-item progress-summary-cell">
            <div className="summary-text-row">
              <span className="ribbon-label">RAJASTHAN PROGRESS</span>
              <strong className="summary-percent text-sky">{completedCount} / 4 Completed ({progressPercent}%)</strong>
            </div>
            <div className="journey-progress-track">
              <div 
                className="journey-progress-fill" 
                style={{ width: `${Math.max(progressPercent, completedCount > 0 ? 25 : 8)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. VISUAL JOURNEY PATH & DESTINATIONS                                 */}
      {/* ===================================================================== */}
      <section className="journey-path-section" aria-label="Rajasthan Journey Trail">
        <div className="path-section-header">
          <div className="section-title-left">
            <Compass size={20} className="text-gold" />
            <h2 className="path-section-title">RAJASTHAN EXPEDITION TRAIL</h2>
          </div>
          <span className="path-guide-hint">
            Progress through the royal citadels sequentially to unlock new chapters
          </span>
        </div>

        {/* Desktop Journey Path Graphic Connector */}
        <div className="journey-map-path-connector" aria-hidden="true">
          <div className="path-connector-line"></div>
          <div 
            className="path-progress-glow-line" 
            style={{ 
              width: completedCount >= 3 ? '100%' : completedCount >= 2 ? '66%' : completedCount >= 1 ? '33%' : '8%' 
            }}
          ></div>
        </div>

        {/* 4 Destinations Cards Grid */}
        <div className="journey-destinations-grid">
          {DESTINATIONS.map((dest, idx) => {
            const isAmer = dest.id === 'amer-fort';
            const progressionState = getLocationProgressionState(dest.id, playerStats);
            const isCompleted = progressionState === 'COMPLETED';
            const isUnlocked = progressionState === 'UNLOCKED';
            const isLocked = progressionState === 'LOCKED';
            const isHovered = hoveredWaypoint === dest.id;

            return (
              <div 
                key={dest.id}
                className={`destination-journey-card ${isUnlocked ? 'card-unlocked' : ''} ${isCompleted ? 'card-completed' : ''} ${isLocked ? 'card-locked' : ''} ${isHovered ? 'card-hovered' : ''}`}
                onMouseEnter={() => setHoveredWaypoint(dest.id)}
                onMouseLeave={() => setHoveredWaypoint(null)}
              >
                {/* Waypoint Number Pill */}
                <div className="waypoint-sequence-badge">
                  {isCompleted ? (
                    <div className="waypoint-number waypoint-done" title="Location Completed">
                      <CheckCircle2 size={16} />
                    </div>
                  ) : isUnlocked ? (
                    <div className="waypoint-number waypoint-active" title="Location Unlocked">
                      0{idx + 1}
                    </div>
                  ) : (
                    <div className="waypoint-number waypoint-locked" title="Location Locked">
                      <Lock size={14} />
                    </div>
                  )}
                  <span className="waypoint-label-text">
                    {isCompleted ? `WAYPOINT 0${idx + 1} • COMPLETED` : isUnlocked ? `WAYPOINT 0${idx + 1} • ACTIVE` : `WAYPOINT 0${idx + 1} • LOCKED`}
                  </span>
                </div>

                {/* Destination Visual / Photo Area */}
                <div className="destination-preview-frame">
                  {dest.image ? (
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="destination-photo-img" 
                      onError={(e) => {
                        if (dest.id === 'mehrangarh-fort') {
                          e.currentTarget.src = '/assets/monuments/mehrangarh-fort/mehrangarh-fort-panorama.jpg';
                        }
                      }}
                    />
                  ) : (
                    <div className="destination-placeholder-artwork">
                      <div className="placeholder-sandstone-pattern"></div>
                      {isUnlocked ? (
                        <Unlock size={32} className="text-gold pulse-gold" />
                      ) : (
                        <Lock size={32} className="text-muted" />
                      )}
                    </div>
                  )}

                  <div className="destination-photo-scrim"></div>

                  <div className="destination-status-chip-row">
                    {isCompleted ? (
                      <span className="status-pill pill-completed">
                        <CheckCircle2 size={12} />
                        <span>COMPLETED</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="status-pill pill-active pulse-gold">
                        <Unlock size={12} />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="status-pill pill-locked">
                        <Lock size={12} />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  <div className="destination-meta-overlay">
                    <span className="dest-city-tag">
                      <MapPin size={12} />
                      <span>{dest.city}, Rajasthan</span>
                    </span>
                    <h3 className="dest-monument-name">{dest.name}</h3>
                  </div>
                </div>

                {/* Destination Body Content */}
                <div className="destination-card-body">
                  <div className="dest-era-row">
                    <span className="dest-era-tag">
                      <Clock size={12} />
                      <span>{dest.era}</span>
                    </span>
                    <span className="dest-region-tag">{dest.region}</span>
                  </div>

                  <p className="dest-description-text">{dest.shortDesc}</p>

                  {/* If Amer Fort: Show 4 Milestones */}
                  {isAmer && (
                    <div className="amer-milestones-checklist">
                      <div className={`milestone-row ${isCompleted ? 'checked' : 'pending'}`}>
                        <CheckCircle2 size={14} className={isCompleted ? 'text-emerald' : 'text-muted'} />
                        <span>{isCompleted ? '✓ Location Discovered' : 'Location Exploration'}</span>
                      </div>
                      <div className={`milestone-row ${isCompleted ? 'checked' : 'pending'}`}>
                        <CheckCircle2 size={14} className={isCompleted ? 'text-emerald' : 'text-muted'} />
                        <span>{isCompleted ? '✓ Heritage Clues Found (3/3)' : '3 Heritage Clues'}</span>
                      </div>
                      <div className={`milestone-row ${isCompleted ? 'checked' : 'pending'}`}>
                        <CheckCircle2 size={14} className={isCompleted ? 'text-emerald' : 'text-muted'} />
                        <span>{isCompleted ? '✓ Restoration Completed' : 'Architectural Restoration'}</span>
                      </div>
                      <div className={`milestone-row ${isCompleted ? 'checked' : 'pending'}`}>
                        <CheckCircle2 size={14} className={isCompleted ? 'text-emerald' : 'text-muted'} />
                        <span>{isCompleted ? '✓ Relic Collected (Sun Mirror)' : 'Heritage Relic Reward'}</span>
                      </div>
                    </div>
                  )}

                  {/* If Mehrangarh Fort: Show 4 Milestones */}
                  {dest.id === 'mehrangarh-fort' && isCompleted && (
                    <div className="amer-milestones-checklist">
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Location Discovered</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ 3 Inscription Fragments Found</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Inscription Decoded</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Relic Collected (Inscription Tablet)</span>
                      </div>
                    </div>
                  )}

                  {/* If Jaisalmer Fort: Show 4 Milestones */}
                  {dest.id === 'jaisalmer-fort' && isCompleted && (
                    <div className="amer-milestones-checklist">
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Location Discovered</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ 3 Trade-Route Clues Found</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Golden Route Reconstructed</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Relic Collected (Golden Route Relic)</span>
                      </div>
                    </div>
                  )}

                  {/* If Chittorgarh Fort: Show 4 Milestones */}
                  {dest.id === 'chittorgarh-fort' && isCompleted && (
                    <div className="amer-milestones-checklist">
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ 700-Acre Bastion Discovered</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ 3 Preservation Challenges Resolved</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Heritage Stewardship Mastered</span>
                      </div>
                      <div className="milestone-row checked">
                        <CheckCircle2 size={14} className="text-emerald" />
                        <span>✓ Relic Collected (Guardian of Chittorgarh)</span>
                      </div>
                    </div>
                  )}

                  {/* Other destinations / Not Completed: Features or Unlocked prompt */}
                  {(!isAmer && 
                    !(dest.id === 'mehrangarh-fort' && isCompleted) && 
                    !(dest.id === 'jaisalmer-fort' && isCompleted) &&
                    !(dest.id === 'chittorgarh-fort' && isCompleted)) && (
                    <div className="locked-destination-lore-box">
                      <div className="locked-features-list">
                        {dest.features.map((feat, fIdx) => (
                          <span key={fIdx} className="locked-feature-chip">
                            &bull; {feat}
                          </span>
                        ))}
                      </div>
                      <p className="locked-expedition-prompt">
                        {isUnlocked 
                          ? '“Your next heritage journey awaits.”' 
                          : '“Complete the preceding fort to unlock this destination.”'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="destination-card-footer">
                  {isAmer ? (
                    <button
                      className={`btn-heritage-primary btn-destination-cta ${isCompleted ? '' : 'pulse-gold'}`}
                      onClick={() => handleDestinationAction(dest, progressionState)}
                      id="amer-fort-journey-btn"
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw size={16} />
                          <span>REPLAY AMER FORT</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} fill="currentColor" />
                          <span>BEGIN JOURNEY</span>
                        </>
                      )}
                    </button>
                  ) : dest.id === 'mehrangarh-fort' ? (
                    <button
                      className={`btn-heritage-primary btn-destination-cta ${isCompleted ? '' : isUnlocked ? 'pulse-gold' : 'btn-locked-destination'}`}
                      onClick={() => handleDestinationAction(dest, progressionState)}
                      disabled={isLocked}
                      id="mehrangarh-fort-journey-btn"
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw size={16} />
                          <span>REPLAY MEHRANGARH</span>
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Unlock size={15} />
                          <span>ENTER MEHRANGARH</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>LOCKED</span>
                        </>
                      )}
                    </button>
                  ) : dest.id === 'jaisalmer-fort' ? (
                    <button
                      className={`btn-heritage-primary btn-destination-cta ${isCompleted ? '' : isUnlocked ? 'pulse-gold' : 'btn-locked-destination'}`}
                      onClick={() => handleDestinationAction(dest, progressionState)}
                      disabled={isLocked}
                      id="jaisalmer-fort-journey-btn"
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw size={16} />
                          <span>REPLAY JAISALMER FORT</span>
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Unlock size={15} />
                          <span>ENTER JAISALMER</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>LOCKED</span>
                        </>
                      )}
                    </button>
                  ) : dest.id === 'chittorgarh-fort' ? (
                    <button
                      className={`btn-heritage-primary btn-destination-cta ${isCompleted ? '' : isUnlocked ? 'pulse-gold' : 'btn-locked-destination'}`}
                      onClick={() => handleDestinationAction(dest, progressionState)}
                      disabled={isLocked}
                      id="chittorgarh-fort-journey-btn"
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw size={16} />
                          <span>REPLAY CHITTORGARH</span>
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Unlock size={15} />
                          <span>ENTER CHITTORGARH</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>LOCKED</span>
                        </>
                      )}
                    </button>
                  ) : isUnlocked ? (
                    <button
                      className="btn-heritage-primary btn-destination-cta pulse-gold"
                      onClick={() => handleDestinationAction(dest, progressionState)}
                    >
                      <Unlock size={15} />
                      <span>ENTER {dest.name.replace(' FORT', '')}</span>
                    </button>
                  ) : (
                    <button 
                      className="btn-heritage-secondary btn-destination-cta btn-locked-destination" 
                      disabled
                    >
                      <Lock size={15} />
                      <span>LOCKED</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. COMING NEXT MODAL (FOR UNLOCKED, UNBUILT CHAPTERS)                  */}
      {/* ===================================================================== */}
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
              <p className="coming-next-region">{comingNextModalDest.city} &bull; {comingNextModalDest.region} ({comingNextModalDest.era})</p>

              <p className="coming-next-desc">
                {comingNextModalDest.shortDesc}
              </p>

              <div className="coming-next-notice-box">
                <Sparkles size={18} className="text-gold" />
                <div>
                  <strong>Congratulations, Explorer!</strong>
                  <p>
                    You have unlocked <strong>{comingNextModalDest.name}</strong> by completing the prior heritage quest. 
                    The interactive 360° walk, historical restoration workbench, and knowledge trial for this citadel are currently under development.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button 
                className="btn-heritage-secondary" 
                onClick={() => {
                  setComingNextModalDest(null);
                  onOpenCodex();
                }}
              >
                <BookOpen size={16} />
                <span>View in Heritage Codex</span>
              </button>

              <button 
                className="btn-heritage-primary" 
                onClick={() => setComingNextModalDest(null)}
              >
                <span>Return to Journey Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. QUICK EXPLORATION ACTIONS FOOTER                                   */}
      {/* ===================================================================== */}
      <section className="journey-bottom-actions-bar">
        <div className="actions-bar-left">
          <div className="action-guide-avatar">
            <span>AV</span>
          </div>
          <div className="action-guide-text">
            <strong>Acharya Vikram says:</strong>
            <p>
              {completedCount === 4
                ? '“Congratulations, Rajasthan Master Explorer! You have mastered all 4 monumental heritage citadels of Rajasthan!”'
                : isJaisalmerCompleted
                ? '“Magnificent! Chittorgarh Fort is unlocked. Explore the hill bastion and champion heritage preservation.”'
                : isMehrangarhCompleted
                ? '“Superb work! Jaisalmer Fort awaits on your expedition trail across the Thar Desert.”'
                : isAmerCompleted
                ? '“Brilliant work completing Amer Fort! You have unlocked Mehrangarh Fort on your expedition trail.”'
                : '“Amer Fort is ready for your expedition. Unravel its mysteries and record your discoveries in the Codex.”'}
            </p>
          </div>
        </div>

        <div className="actions-bar-buttons">
          <button 
            className="btn-heritage-primary"
            onClick={() => {
              sound.playChime();
              onEnterAmerFort();
            }}
          >
            <span>{isAmerCompleted ? 'Enter Amer Fort' : 'Start Amer Fort'}</span>
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn-heritage-secondary"
            onClick={() => {
              sound.playClick();
              onOpenCodex();
            }}
          >
            <BookOpen size={16} />
            <span>Open Heritage Codex</span>
          </button>

          <button 
            className="btn-heritage-secondary"
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
          >
            <Compass size={16} />
            <span>Interactive Map</span>
          </button>
        </div>
      </section>
    </div>
  );
}
