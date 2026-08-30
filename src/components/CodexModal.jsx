import { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Award, 
  Lock, 
  Unlock,
  Sparkles, 
  CheckCircle2, 
  Droplets, 
  Sun, 
  Hammer, 
  Shield,
  Compass, 
  ArrowLeft,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import { sound } from '../data/soundEffects';
import { getLocationProgressionState } from '../data/statesData';

export default function CodexModal({ isOpen, onClose, playerStats }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'locations' | 'relics'

  if (!isOpen) return null;

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

  const amerRelic = playerStats.unlockedRelics?.find(r => r.id === 'relic_amer_mirror') || {
    id: 'relic_amer_mirror',
    name: 'Sun Mirror of Amer',
    tier: 'Legendary Relic',
    lore: 'A masterfully engraved brass mirror prism bearing the solar crest of Amer. It symbolizes ancient India’s mastery of optical physics, convex reflection, and architectural luxury.'
  };

  const mehrangarhRelic = playerStats.unlockedRelics?.find(r => r.id === 'relic_mehrangarh_inscription') || {
    id: 'relic_mehrangarh_inscription',
    name: 'Mehrangarh Inscription Relic',
    tier: 'Legendary Relic',
    lore: 'An engraved red sandstone tablet bearing the founding seal of Rao Jodha and the solar crest of Marwar. It symbolizes the indomitable spirit of Rajasthan’s cliffside architecture.'
  };

  const jaisalmerRelic = playerStats.unlockedRelics?.find(r => r.id === 'relic_jaisalmer_route') || {
    id: 'relic_jaisalmer_route',
    name: 'Golden Route Relic',
    tier: 'Legendary Relic',
    lore: 'A masterfully sculpted golden sandstone merchant seal bearing the caravan compass of the Thar Desert and the royal crest of Rawal Jaisal.'
  };

  const chittorgarhRelic = playerStats.unlockedRelics?.find(r => r.id === 'relic_chittorgarh_crest') || {
    id: 'relic_chittorgarh_crest',
    name: 'Guardian of Chittorgarh',
    tier: 'Mythic Relic',
    lore: 'A sacred golden Mewari seal crowned with the Tower of Victory and the sunburst crest, awarded to true guardians of India’s living heritage.'
  };

  const isAmerRelicCollected = playerStats.unlockedRelics?.some(r => r.id === 'relic_amer_mirror');
  const isMehrangarhRelicCollected = playerStats.unlockedRelics?.some(r => r.id === 'relic_mehrangarh_inscription');
  const isJaisalmerRelicCollected = playerStats.unlockedRelics?.some(r => r.id === 'relic_jaisalmer_route');
  const isChittorgarhRelicCollected = playerStats.unlockedRelics?.some(r => r.id === 'relic_chittorgarh_crest');

  const discoveredCount = (isAmerCompleted ? 1 : 0) + 
                          (isMehrangarhCompleted ? 1 : 0) + 
                          (isJaisalmerCompleted ? 1 : 0) + 
                          (isChittorgarhCompleted ? 1 : 0);

  // Remaining Rajasthan Locations
  const REMAINING_LOCATIONS = [
    ...(isMehrangarhCompleted ? [] : [{
      id: 'mehrangarh-fort',
      name: 'Mehrangarh Fort',
      city: 'Jodhpur, Rajasthan',
      era: '1459 CE (Rao Jodha)',
      description: 'Perched 400 feet above the blue city of Jodhpur on sheer volcanic cliffs.',
      featureTag: 'Impregnable Bastion',
      relicName: 'Mehrangarh Inscription Relic'
    }]),
    ...(isJaisalmerCompleted ? [] : [{
      id: 'jaisalmer-fort',
      name: 'Jaisalmer Fort',
      city: 'Jaisalmer, Rajasthan',
      era: '1156 CE (Rawal Jaisal)',
      description: 'The living Golden Fortress (Sonar Qila) constructed from yellow sandstone in the Thar Desert.',
      featureTag: 'Desert Citadel',
      relicName: 'Golden Route Relic'
    }]),
    ...(isChittorgarhCompleted ? [] : [{
      id: 'chittorgarh-fort',
      name: 'Chittorgarh Fort',
      city: 'Chittorgarh, Rajasthan',
      era: '7th Century CE (Mori Dynasty)',
      description: 'The monumental hill bastion spanning 700 acres, famed for the Vijay Stambha (Tower of Victory).',
      featureTag: 'Tower of Victory',
      relicName: 'Guardian of Chittorgarh'
    }])
  ];

  return (
    <div className="modal-overlay codex-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Heritage Codex">
      <div className="codex-journal-card" onClick={(e) => e.stopPropagation()}>
        {/* =================================================================== */}
        {/* 1. CODEX HEADER & TITLE                                             */}
        {/* =================================================================== */}
        <header className="codex-journal-header">
          <div className="codex-header-left">
            <div className="codex-crest-emblem">
              <BookOpen size={24} className="text-gold" />
            </div>
            <div className="codex-header-text">
              <div className="codex-pretitle-pill">
                <Sparkles size={12} className="text-gold" />
                <span>Living Heritage Codex</span>
              </div>
              <h2 className="codex-title">HERITAGE CODEX</h2>
              <p className="codex-subtitle">&ldquo;Your journey through India&rsquo;s living heritage.&rdquo;</p>
            </div>
          </div>

          <div className="codex-header-actions">
            <button 
              className="codex-close-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              title="Close Codex (Esc)"
              aria-label="Close Codex"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* =================================================================== */}
        {/* 2. PLAYER PROFILE & STATS STRIP                                     */}
        {/* =================================================================== */}
        <div className="codex-player-profile-bar">
          <div className="profile-identity-group">
            <div className="profile-avatar-seal">
              <span>HQ</span>
            </div>
            <div className="profile-details">
              <span className="profile-category-tag">PLAYER PROFILE</span>
              <strong className="profile-rank-name">{playerStats.rankTitle || 'Apprentice Explorer'}</strong>
            </div>
          </div>

          <div className="profile-metrics-group">
            <div className="profile-metric-pill" title="Total Lore Experience">
              <Sparkles size={16} className="text-gold" />
              <div>
                <span className="metric-label">EXPLORER XP</span>
                <strong className="metric-value text-gold">{playerStats.xp} XP</strong>
              </div>
            </div>

            <div className="profile-metric-pill" title="Relics in Vault">
              <Award size={16} className="text-emerald" />
              <div>
                <span className="metric-label">RELICS COLLECTED</span>
                <strong className="metric-value text-emerald">{playerStats.unlockedRelics.length} / 4</strong>
              </div>
            </div>

            <div className="profile-metric-pill" title="Monuments Explored">
              <Compass size={16} className="text-sky" />
              <div>
                <span className="metric-label">LOCATIONS</span>
                <strong className="metric-value text-sky">
                  {discoveredCount} / 4 Discovered
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. CODEX TAB SELECTOR                                               */}
        {/* =================================================================== */}
        <div className="codex-tab-navigation">
          <button 
            className={`codex-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveTab('all');
            }}
          >
            <Layers size={15} />
            <span>Complete Journal</span>
          </button>

          <button 
            className={`codex-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveTab('locations');
            }}
          >
            <MapPin size={15} />
            <span>Monuments ({discoveredCount}/4)</span>
          </button>

          <button 
            className={`codex-tab-btn ${activeTab === 'relics' ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              setActiveTab('relics');
            }}
          >
            <Award size={15} />
            <span>Relics Vault ({playerStats.unlockedRelics.length}/4)</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* 4. SCROLLABLE JOURNAL BODY                                          */}
        {/* =================================================================== */}
        <div className="codex-scrollable-body">
          {/* RAJASTHAN JOURNEY SUMMARY SECTION */}
          <section className="codex-section-block">
            <div className="section-title-row">
              <div className="section-title-left">
                <Compass size={18} className="text-gold" />
                <h3 className="section-heading">RAJASTHAN JOURNEY</h3>
              </div>
              <span className="section-progress-tag">
                {discoveredCount} / 4 Locations Discovered
              </span>
            </div>

            <div className="rajasthan-overview-card">
              <div className="overview-stats-grid">
                <div className="overview-stat-cell">
                  <span className="ov-label">Realm</span>
                  <strong className="ov-value text-gold">Rajasthan</strong>
                </div>
                <div className="overview-stat-cell">
                  <span className="ov-label">Locations Discovered</span>
                  <strong className="ov-value text-emerald">{discoveredCount} / 4</strong>
                </div>
                <div className="overview-stat-cell">
                  <span className="ov-label">Relics Collected</span>
                  <strong className="ov-value text-emerald">{playerStats.unlockedRelics?.length || 0} / 4 Relics</strong>
                </div>
                <div className="overview-stat-cell">
                  <span className="ov-label">Knowledge Discoveries</span>
                  <strong className="ov-value text-gold">{discoveredCount * 3} / 12</strong>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* AMER FORT UNLOCKED ENTRY                                          */}
          {/* ================================================================= */}
          {(activeTab === 'all' || activeTab === 'locations') && (
            <section className="codex-section-block">
              <div className="section-title-row">
                <div className="section-title-left">
                  <MapPin size={18} className="text-emerald" />
                  <h3 className="section-heading">UNLOCKED MONUMENT ENTRY</h3>
                </div>
                <span className="status-badge-discovered">
                  <CheckCircle2 size={13} />
                  <span>DISCOVERED</span>
                </span>
              </div>

              <div className="monument-codex-entry-card">
                {/* Entry Top Header with Real Photo */}
                <div className="monument-entry-hero-banner">
                  <img 
                    src="/assets/monuments/amer-fort/amer-fort-panorama.jpg" 
                    alt="Amer Fort Panorama" 
                    className="monument-entry-bg-image" 
                  />
                  <div className="monument-hero-scrim"></div>
                  
                  <div className="monument-hero-info">
                    <div className="hero-tags-strip">
                      <span className="location-geo-tag">
                        <MapPin size={12} />
                        <span>Jaipur, Rajasthan</span>
                      </span>
                      <span className="location-era-tag">
                        <Clock size={12} />
                        <span>1592 CE (Raja Man Singh I)</span>
                      </span>
                    </div>
                    <h3 className="monument-entry-title">AMER FORT</h3>
                    <p className="monument-entry-tagline">
                      The Hilltop Citadel of Stonecraft, Water Engineering &amp; Mirror Pavilions
                    </p>
                  </div>

                  {/* Completion Milestones Checklist */}
                  <div className="monument-milestones-pill-group">
                    <div className={`milestone-chip ${isAmerCompleted ? 'done' : 'pending'}`}>
                      <CheckCircle2 size={13} className={isAmerCompleted ? 'text-emerald' : 'text-muted'} />
                      <span>Heritage Clues Found ({isAmerCompleted ? '3/3' : '0/3'})</span>
                    </div>
                    <div className={`milestone-chip ${playerStats.completedLocations?.includes('amer-fort') ? 'done' : 'pending'}`}>
                      <CheckCircle2 size={13} className={playerStats.completedLocations?.includes('amer-fort') ? 'text-emerald' : 'text-muted'} />
                      <span>Restoration Completed</span>
                    </div>
                    <div className={`milestone-chip ${isAmerRelicCollected ? 'done' : 'pending'}`}>
                      <CheckCircle2 size={13} className={isAmerRelicCollected ? 'text-emerald' : 'text-muted'} />
                      <span>Heritage Relic Earned</span>
                    </div>
                  </div>
                </div>

                {/* 3 Knowledge Discoveries Grid */}
                <div className="monument-discoveries-section">
                  <div className="discoveries-header">
                    <Sparkles size={16} className="text-gold" />
                    <h4>KNOWLEDGE DISCOVERIES &bull; AMER FORT</h4>
                  </div>

                  <div className="discoveries-cards-grid">
                    {/* Discovery 1 */}
                    <div className="discovery-codex-card">
                      <div className="discovery-card-top">
                        <div className="discovery-icon-circle icon-craft">
                          <Hammer size={18} className="text-gold" />
                        </div>
                        <span className="discovery-area-tag">Ganesh Pol Gateway</span>
                      </div>
                      <h5 className="discovery-card-title">Royal Architecture</h5>
                      <p className="discovery-card-fact">
                        Rajput and Mughal master masons blended carved red sandstone with fine lime plaster, creating intricate floral frescoes with vegetable dyes that have resisted four centuries of weathering.
                      </p>
                    </div>

                    {/* Discovery 2 */}
                    <div className="discovery-codex-card">
                      <div className="discovery-card-top">
                        <div className="discovery-icon-circle icon-mirror">
                          <Sun size={18} className="text-sky" />
                        </div>
                        <span className="discovery-area-tag">Hall of Mirrors</span>
                      </div>
                      <h5 className="discovery-card-title">Sheesh Mahal</h5>
                      <p className="discovery-card-fact">
                        Thousands of convex imported Belgian glass mirrors were set at precise angles into plaster, multiplying a single oil lamp&rsquo;s reflection into an entire constellation of stars.
                      </p>
                    </div>

                    {/* Discovery 3 */}
                    <div className="discovery-codex-card">
                      <div className="discovery-card-top">
                        <div className="discovery-icon-circle icon-water">
                          <Droplets size={18} className="text-teal" />
                        </div>
                        <span className="discovery-area-tag">Maota Lake Ramparts</span>
                      </div>
                      <h5 className="discovery-card-title">Water &amp; Engineering</h5>
                      <p className="discovery-card-fact">
                        A multi-tier Persian wheel (Rehat) pulley system hoisted water from Maota Lake over 400 feet up to royal hilltop reservoirs to feed palatial fountains and gardens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* MEHRANGARH FORT UNLOCKED ENTRY                                */}
              {/* ============================================================= */}
              {isMehrangarhCompleted && (
                <div className="monument-codex-entry-card" style={{ marginTop: '1.5rem' }}>
                  <div className="monument-entry-hero-banner mehrangarh-codex-banner">
                    <img 
                      src="/assets/monuments/mehrangarh-fort/mehrangarh-fort.jpg" 
                      alt="Mehrangarh Fort" 
                      className="monument-entry-bg-image" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="monument-hero-scrim"></div>
                    
                    <div className="monument-hero-info">
                      <div className="hero-tags-strip">
                        <span className="location-geo-tag">
                          <MapPin size={12} />
                          <span>Jodhpur, Rajasthan</span>
                        </span>
                        <span className="location-era-tag">
                          <Clock size={12} />
                          <span>1459 CE (Rao Jodha)</span>
                        </span>
                      </div>
                      <h3 className="monument-entry-title">MEHRANGARH FORT</h3>
                      <p className="monument-entry-tagline">
                        The Impregnable Citadel of the Sun &bull; Inscription Chronicles of Marwar
                      </p>
                    </div>

                    {/* Completion Milestones Checklist */}
                    <div className="monument-milestones-pill-group">
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Chapter Completed</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>3 Inscription Fragments Found</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Inscription Decoded</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Relic Collected (Mehrangarh Inscription)</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Mehrangarh Knowledge Discoveries Grid */}
                  <div className="monument-discoveries-section">
                    <div className="discoveries-header">
                      <Sparkles size={16} className="text-gold" />
                      <h4>KNOWLEDGE DISCOVERIES &bull; MEHRANGARH FORT</h4>
                    </div>

                    <div className="discoveries-cards-grid">
                      {/* Discovery 1 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-craft">
                            <Sun size={18} className="text-gold" />
                          </div>
                          <span className="discovery-area-tag">Foundation Bastion</span>
                        </div>
                        <h5 className="discovery-card-title">Foundation Inscription (1459 CE)</h5>
                        <p className="discovery-card-fact">
                          Rao Jodha laid the foundation of Mihirgarh upon the sheer 122-meter volcanic cliff of Bhakurcheeria, establishing a new impregnable capital for Marwar.
                        </p>
                      </div>

                      {/* Discovery 2 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-mirror">
                            <Shield size={18} className="text-emerald" />
                          </div>
                          <span className="discovery-area-tag">Great Ramparts</span>
                        </div>
                        <h5 className="discovery-card-title">Seven Gates &amp; Jayapol</h5>
                        <p className="discovery-card-fact">
                          Seven monumental gates guarded the ascending ramps, with 90-degree turns engineered to stop charging war elephants and siege towers from gathering momentum.
                        </p>
                      </div>

                      {/* Discovery 3 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-water">
                            <Droplets size={18} className="text-teal" />
                          </div>
                          <span className="discovery-area-tag">Deep Cistern Terrace</span>
                        </div>
                        <h5 className="discovery-card-title">Ranisar Stepwells</h5>
                        <p className="discovery-card-fact">
                          Built by Queen Jasmade Hadi in 1459 CE, subterranean stone stepwells harvested precious desert rainwater, securing centuries of uninterrupted survival.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* JAISALMER FORT UNLOCKED ENTRY                                 */}
              {/* ============================================================= */}
              {isJaisalmerCompleted && (
                <div className="monument-codex-entry-card" style={{ marginTop: '1.5rem' }}>
                  <div className="monument-entry-hero-banner jaisalmer-codex-banner">
                    <img 
                      src="/assets/monuments/jaisalmer-fort/jaisalmer-fort-panorama.jpg" 
                      alt="Jaisalmer Fort Panorama" 
                      className="monument-entry-bg-image" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="monument-hero-scrim"></div>
                    
                    <div className="monument-hero-info">
                      <div className="hero-tags-strip">
                        <span className="location-geo-tag">
                          <MapPin size={12} />
                          <span>Jaisalmer, Rajasthan</span>
                        </span>
                        <span className="location-era-tag">
                          <Clock size={12} />
                          <span>1156 CE (Rawal Jaisal)</span>
                        </span>
                      </div>
                      <h3 className="monument-entry-title">JAISALMER FORT (SONAR QILA)</h3>
                      <p className="monument-entry-tagline">
                        The Living Golden Citadel &bull; Ancient Thar Desert Trade Route
                      </p>
                    </div>

                    {/* Completion Milestones Checklist */}
                    <div className="monument-milestones-pill-group">
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Chapter Completed</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>3 Trade-Route Clues Found</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Golden Route Reconstructed</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Relic Collected (Golden Route Relic)</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Jaisalmer Knowledge Discoveries Grid */}
                  <div className="monument-discoveries-section">
                    <div className="discoveries-header">
                      <Sparkles size={16} className="text-gold" />
                      <h4>KNOWLEDGE DISCOVERIES &bull; JAISALMER FORT</h4>
                    </div>

                    <div className="discoveries-cards-grid">
                      {/* Discovery 1 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-craft">
                            <Compass size={18} className="text-gold" />
                          </div>
                          <span className="discovery-area-tag">Dune Gate (Akhai Pol)</span>
                        </div>
                        <h5 className="discovery-card-title">Caravan Silk &amp; Spice Route</h5>
                        <p className="discovery-card-fact">
                          Positioned strategically at the crossroads of the Great Thar Desert, Jaisalmer connected Indian inland trade to Persia, Arabia, and the Central Asian Silk Road.
                        </p>
                      </div>

                      {/* Discovery 2 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-mirror">
                            <Sun size={18} className="text-gold" />
                          </div>
                          <span className="discovery-area-tag">Manak Chowk Bazaar</span>
                        </div>
                        <h5 className="discovery-card-title">Desert Trade &amp; Haveli Jali</h5>
                        <p className="discovery-card-fact">
                          Customs duties from camel caravans funded mansions like Patwon Ki Haveli, where master stonemasons carved yellow Jurassic sandstone with woodcarving precision.
                        </p>
                      </div>

                      {/* Discovery 3 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-water">
                            <Shield size={18} className="text-emerald" />
                          </div>
                          <span className="discovery-area-tag">Living Citadel Courtyard</span>
                        </div>
                        <h5 className="discovery-card-title">Sonar Qila Living Heritage</h5>
                        <p className="discovery-card-fact">
                          Built in 1156 CE on Trikuta Hill, Sonar Qila remains one of the world&rsquo;s few functioning living forts, home to generations of craftsmen, priests, and merchant families.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* 4. CHITTORGARH FORT ENTRY (IF COMPLETED)                      */}
              {/* ============================================================= */}
              {isChittorgarhCompleted && (
                <div className="monument-codex-entry chittorgarh-entry animate-fade-in" style={{ marginTop: '2rem' }}>
                  <div className="monument-entry-header chittorgarh-codex-banner" style={{ position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src="/assets/monuments/chittorgarh-fort/chittorgarh-fort-panorama.jpg" 
                      alt="Chittorgarh Fort Panorama" 
                      className="monument-entry-bg-image" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="monument-hero-scrim"></div>
                    <div className="monument-header-titles" style={{ position: 'relative', zIndex: 2 }}>
                      <div className="monument-meta-badge">
                        <MapPin size={13} className="text-gold" />
                        <span>
                          Chittorgarh, Mewar Region &bull; 
                          <span>7th Century CE (Mori Dynasty / Bappa Rawal)</span>
                        </span>
                      </div>
                      <h3 className="monument-entry-title">CHITTORGARH FORT</h3>
                      <p className="monument-entry-tagline">
                        The Monumental Bastion of Rajput Valor &bull; 700-Acre Living Fortress
                      </p>
                    </div>

                    {/* Completion Milestones Checklist */}
                    <div className="monument-milestones-pill-group">
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Chapter Completed</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>3 Preservation Challenges Resolved</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Heritage Stewardship Mastered</span>
                      </div>
                      <div className="milestone-chip done">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Relic Collected (Guardian of Chittorgarh)</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Chittorgarh Knowledge Discoveries Grid */}
                  <div className="monument-discoveries-section">
                    <div className="discoveries-header">
                      <Sparkles size={16} className="text-gold" />
                      <h4>KNOWLEDGE DISCOVERIES &bull; CHITTORGARH FORT</h4>
                    </div>

                    <div className="discoveries-cards-grid">
                      {/* Discovery 1 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-mirror">
                            <Shield size={18} className="text-emerald" />
                          </div>
                          <span className="discovery-area-tag">Vijay Stambha Plinth</span>
                        </div>
                        <h5 className="discovery-card-title">Weathered Carvings Protection</h5>
                        <p className="discovery-card-fact">
                          Gentle protective perimeters shield delicate 15th-century stone friezes from physical touch and abrasion while maintaining open visual access and tactile replicas.
                        </p>
                      </div>

                      {/* Discovery 2 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-craft">
                            <Compass size={18} className="text-gold" />
                          </div>
                          <span className="discovery-area-tag">Ram Pol Ramparts</span>
                        </div>
                        <h5 className="discovery-card-title">Visitor Flow &amp; Trail Stewardship</h5>
                        <p className="discovery-card-fact">
                          Designated walking trails and timed group dispersal eliminate bottleneck congestion and prevent foundation erosion across centuries-old staircases and slopes.
                        </p>
                      </div>

                      {/* Discovery 3 */}
                      <div className="discovery-codex-card">
                        <div className="discovery-card-top">
                          <div className="discovery-icon-circle icon-water">
                            <Droplets size={18} className="text-teal" />
                          </div>
                          <span className="discovery-area-tag">Gaumukh Spring Reservoir</span>
                        </div>
                        <h5 className="discovery-card-title">Gaumukh Hydraulic Conservation</h5>
                        <p className="discovery-card-fact">
                          Eco-friendly stone channel maintenance preserves medieval masonry joints and restores subterranean natural spring water flow across the 700-acre hilltop.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ================================================================= */}
          {/* COLLECTIBLE RELIC CARDS SECTION                                   */}
          {/* ================================================================= */}
          {(activeTab === 'all' || activeTab === 'relics') && (
            <section className="codex-section-block">
              <div className="section-title-row">
                <div className="section-title-left">
                  <Award size={18} className="text-gold" />
                  <h3 className="section-heading">HERITAGE RELIC VAULT</h3>
                </div>
                <span className="section-progress-tag">
                  {playerStats.unlockedRelics.length} / 4 Relics Unlocked
                </span>
              </div>

              <div className="relics-showcase-grid">
                {/* Amer Fort Collectible Relic Card */}
                <div className={`collectible-relic-card ${isAmerRelicCollected ? 'relic-collected' : 'relic-uncollected'}`}>
                  <div className="relic-card-header">
                    <span className="relic-tier-badge">{amerRelic.tier || 'Legendary Relic'}</span>
                    <span className={`relic-status-badge ${isAmerRelicCollected ? 'collected' : 'locked'}`}>
                      {isAmerRelicCollected ? '✓ COLLECTED' : '🔒 LOCKED'}
                    </span>
                  </div>

                  <div className="relic-visual-stage">
                    <div className="relic-glow-halo"></div>
                    <svg viewBox="0 0 100 100" className="relic-svg-artwork">
                      <defs>
                        <radialGradient id="relicSunG" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="35%" stopColor="#fde047" />
                          <stop offset="70%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#854d0e" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="44" fill="rgba(230, 179, 37, 0.15)" stroke="#eab308" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="32" fill="url(#relicSunG)" />
                      {/* Sun Rays */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line 
                          key={deg} 
                          x1="50" 
                          y1="50" 
                          x2={50 + 42 * Math.cos((deg * Math.PI) / 180)} 
                          y2={50 + 42 * Math.sin((deg * Math.PI) / 180)} 
                          stroke="#fef08a" 
                          strokeWidth="2" 
                        />
                      ))}
                      <polygon points="50,30 55,42 68,42 58,50 62,62 50,55 38,62 42,50 32,42 45,42" fill="#ffffff" />
                      <circle cx="50" cy="50" r="6" fill="#38bdf8" />
                    </svg>
                  </div>

                  <div className="relic-text-content">
                    <h4 className="relic-display-name">AMER FORT HERITAGE RELIC</h4>
                    <span className="relic-lore-name">{amerRelic.name}</span>
                    <p className="relic-description-text">
                      {amerRelic.lore}
                    </p>
                  </div>

                  <div className="relic-card-footer">
                    <span className="relic-xp-reward">+350 Lore Points</span>
                    <span className="relic-origin-tag">Amer Fort &bull; Jaipur</span>
                  </div>
                </div>

                {/* Mehrangarh Inscription Relic Card */}
                <div className={`collectible-relic-card ${isMehrangarhRelicCollected ? 'relic-collected' : 'relic-uncollected'}`}>
                  <div className="relic-card-header">
                    <span className="relic-tier-badge">{mehrangarhRelic.tier || 'Legendary Relic'}</span>
                    <span className={`relic-status-badge ${isMehrangarhRelicCollected ? 'collected' : 'locked'}`}>
                      {isMehrangarhRelicCollected ? '✓ COLLECTED' : '🔒 LOCKED'}
                    </span>
                  </div>

                  <div className="relic-visual-stage">
                    <div className="relic-glow-halo"></div>
                    <svg viewBox="0 0 100 100" className="relic-svg-artwork">
                      <rect x="18" y="14" width="64" height="72" rx="8" fill="#2d3748" stroke="#eab308" strokeWidth="2.5" />
                      <circle cx="50" cy="38" r="16" fill="rgba(230, 179, 37, 0.25)" stroke="#eab308" strokeWidth="1.5" />
                      <line x1="28" y1="62" x2="72" y2="62" stroke="#fef08a" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="28" y1="70" x2="72" y2="70" stroke="#fef08a" strokeWidth="2" strokeDasharray="3,3" />
                      <line x1="36" y1="78" x2="64" y2="78" stroke="#fef08a" strokeWidth="2" strokeDasharray="3,3" />
                    </svg>
                  </div>

                  <div className="relic-text-content">
                    <h4 className="relic-display-name">MEHRANGARH RELIC</h4>
                    <span className="relic-lore-name">{mehrangarhRelic.name}</span>
                    <p className="relic-description-text">
                      {mehrangarhRelic.lore}
                    </p>
                  </div>

                  <div className="relic-card-footer">
                    <span className="relic-xp-reward">+150 Lore Points</span>
                    <span className="relic-origin-tag">Mehrangarh Fort &bull; Jodhpur</span>
                  </div>
                </div>

                {/* Jaisalmer Golden Route Relic Card */}
                <div className={`collectible-relic-card ${isJaisalmerRelicCollected ? 'relic-collected' : 'relic-uncollected'}`}>
                  <div className="relic-card-header">
                    <span className="relic-tier-badge">{jaisalmerRelic.tier || 'Legendary Relic'}</span>
                    <span className={`relic-status-badge ${isJaisalmerRelicCollected ? 'collected' : 'locked'}`}>
                      {isJaisalmerRelicCollected ? '✓ COLLECTED' : '🔒 LOCKED'}
                    </span>
                  </div>

                  <div className="relic-visual-stage">
                    <div className="relic-glow-halo"></div>
                    <svg viewBox="0 0 100 100" className="relic-svg-artwork">
                      <circle cx="50" cy="50" r="42" fill="#78350f" stroke="#fde047" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="32" fill="rgba(234, 179, 8, 0.25)" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3,3" />
                      {/* 8-point Compass Star */}
                      <polygon points="50,18 55,42 66,34 58,45 82,50 58,55 66,66 55,58 50,82 45,58 34,66 42,55 18,50 42,45 34,34 45,42" fill="#fde047" stroke="#eab308" strokeWidth="1" />
                      <circle cx="50" cy="50" r="6" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="relic-text-content">
                    <h4 className="relic-display-name">JAISALMER RELIC</h4>
                    <span className="relic-lore-name">{jaisalmerRelic.name}</span>
                    <p className="relic-description-text">
                      {jaisalmerRelic.lore}
                    </p>
                  </div>

                  <div className="relic-card-footer">
                    <span className="relic-xp-reward">+200 Lore Points</span>
                    <span className="relic-origin-tag">Jaisalmer Fort &bull; Thar Desert</span>
                  </div>
                </div>

                {/* Chittorgarh Guardian Relic Card */}
                <div className={`collectible-relic-card ${isChittorgarhRelicCollected ? 'relic-collected' : 'relic-uncollected'}`}>
                  <div className="relic-card-header">
                    <span className="relic-tier-badge">{chittorgarhRelic.tier || 'Mythic Relic'}</span>
                    <span className={`relic-status-badge ${isChittorgarhRelicCollected ? 'collected' : 'locked'}`}>
                      {isChittorgarhRelicCollected ? '✓ COLLECTED' : '🔒 LOCKED'}
                    </span>
                  </div>

                  <div className="relic-visual-stage">
                    <div className="relic-glow-halo"></div>
                    <svg viewBox="0 0 100 100" className="relic-svg-artwork">
                      <polygon points="50,14 84,28 84,62 50,88 16,62 16,28" fill="#1e1b4b" stroke="#ef4444" strokeWidth="3" />
                      {/* Inner Gold Shield */}
                      <polygon points="50,22 76,34 76,58 50,78 24,58 24,34" fill="rgba(239, 68, 68, 0.25)" stroke="#fbbf24" strokeWidth="2" />
                      {/* Tower Silhouette */}
                      <rect x="44" y="32" width="12" height="34" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                      <polygon points="50,26 42,32 58,32" fill="#ffffff" />
                      <circle cx="50" cy="50" r="4" fill="#ef4444" />
                    </svg>
                  </div>

                  <div className="relic-text-content">
                    <h4 className="relic-display-name">CHITTORGARH RELIC</h4>
                    <span className="relic-lore-name">{chittorgarhRelic.name}</span>
                    <p className="relic-description-text">
                      {chittorgarhRelic.lore}
                    </p>
                  </div>

                  <div className="relic-card-footer">
                    <span className="relic-xp-reward">+250 Lore Points</span>
                    <span className="relic-origin-tag">Chittorgarh Fort &bull; Mewar</span>
                  </div>
                </div>

                {/* Remaining Locked Relic Cards */}
                {REMAINING_LOCATIONS.filter(l => l.id !== 'mehrangarh-fort' && l.id !== 'jaisalmer-fort' && l.id !== 'chittorgarh-fort').map((loc) => (
                  <div key={loc.id} className="collectible-relic-card relic-locked-placeholder">
                    <div className="relic-card-header">
                      <span className="relic-tier-badge">Ancient Relic</span>
                      <span className="relic-status-badge locked">🔒 LOCKED</span>
                    </div>

                    <div className="relic-visual-stage locked-stage">
                      <Lock size={36} className="text-muted" />
                    </div>

                    <div className="relic-text-content">
                      <h4 className="relic-display-name">{loc.relicName}</h4>
                      <span className="relic-lore-name">{loc.name}</span>
                      <p className="relic-description-text text-muted">
                        Explore {loc.name} and complete its quest to unlock this sacred heritage relic.
                      </p>
                    </div>

                    <div className="relic-card-footer">
                      <span className="relic-xp-reward text-muted">+350 Lore Points</span>
                      <span className="relic-origin-tag text-muted">{loc.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================================================================= */}
          {/* EXPEDITION TRAIL & OTHER RAJASTHAN DESTINATIONS                   */}
          {/* ================================================================= */}
          {(activeTab === 'all' || activeTab === 'locations') && (
            <section className="codex-section-block">
              <div className="section-title-row">
                <div className="section-title-left">
                  <Compass size={18} className="text-gold" />
                  <h3 className="section-heading">RAJASTHAN EXPEDITION CHAPTERS</h3>
                </div>
                <span className="section-progress-tag">
                  {discoveredCount} / 4 Discovered
                </span>
              </div>

              <div className="locked-locations-grid">
                {REMAINING_LOCATIONS.map((loc) => {
                  const progState = getLocationProgressionState(loc.id, playerStats);
                  const isLocUnlocked = progState === 'UNLOCKED';

                  return (
                    <div 
                      key={loc.id} 
                      className={`locked-monument-card ${isLocUnlocked ? 'unlocked-codex-card' : ''}`}
                    >
                      <div className="locked-card-header">
                        {isLocUnlocked ? (
                          <div className="unlocked-badge-chip pulse-gold">
                            <Unlock size={13} />
                            <span>UNLOCKED</span>
                          </div>
                        ) : (
                          <div className="locked-badge-chip">
                            <Lock size={13} />
                            <span>LOCKED</span>
                          </div>
                        )}
                        <span className="locked-feature-tag">{loc.featureTag}</span>
                      </div>

                      <div className="locked-card-body">
                        <h4 className="locked-location-name">{loc.name.toUpperCase()}</h4>
                        <span className="locked-location-meta">{loc.city} &bull; {loc.era}</span>
                        <p className="locked-location-desc">{loc.description}</p>
                      </div>

                      <div className="locked-card-footer">
                        <span className={`locked-prompt-text ${isLocUnlocked ? 'text-gold' : ''}`}>
                          {isLocUnlocked 
                            ? '“Unlocked and ready to explore in the Rajasthan Journey Hub!”' 
                            : '“Complete the preceding fort to unlock this destination.”'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* =================================================================== */}
        {/* 5. CODEX FOOTER WITH BACK BUTTON                                   */}
        {/* =================================================================== */}
        <footer className="codex-journal-footer">
          <button 
            className="btn-heritage-primary btn-large-cta"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            id="codex-back-to-game-btn"
          >
            <ArrowLeft size={18} />
            <span>BACK TO GAMEPLAY</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
