import { useState, useEffect } from 'react';
import HeaderHUD from './components/HeaderHUD';
import TitleScreen from './components/TitleScreen';
import RajasthanJourneyHub from './components/RajasthanJourneyHub';
import StateMapScreen from './components/StateMapScreen';
import LocationExploreScreen from './components/LocationExploreScreen';
import MehrangarhExploreScreen from './components/MehrangarhExploreScreen';
import JaisalmerExploreScreen from './components/JaisalmerExploreScreen';
import ChittorgarhExploreScreen from './components/ChittorgarhExploreScreen';
import RestoreHeritageMiniGame from './components/minigames/RestoreHeritageMiniGame';
import MehrangarhDecoderGame from './components/minigames/MehrangarhDecoderGame';
import JaisalmerRouteGame from './components/minigames/JaisalmerRouteGame';
import QuizChallenge from './components/QuizChallenge';
import RewardModal from './components/RewardModal';
import CodexModal from './components/CodexModal';
import RajasthanMasterCelebrationModal from './components/RajasthanMasterCelebrationModal';

import { RAJASTHAN_STATE_DATA, INITIAL_PLAYER_STATS } from './data/statesData';
import { sound } from './data/soundEffects';
import './App.css';

// Initial Demo Mode Player Profile (All 4 Forts Unlocked, Ready for Instant Evaluation)
const DEMO_INITIAL_STATS = {
  xp: 850,
  level: 4,
  rankTitle: 'Royal Chronicler',
  unlockedLocations: ['amer-fort', 'mehrangarh-fort', 'jaisalmer-fort', 'chittorgarh-fort'],
  completedLocations: ['amer-fort', 'mehrangarh-fort', 'jaisalmer-fort'],
  completedExplorations: ['amer-fort', 'mehrangarh-fort', 'jaisalmer-fort'],
  completedQuizzes: ['amer-fort'],
  unlockedRelics: [
    {
      id: 'relic_amer_mirror',
      name: 'Sun Mirror of Amer',
      tier: 'Legendary Relic',
      xpReward: 350,
      lore: 'A masterfully engraved brass mirror prism bearing the solar crest of Amer, reflecting ancient Rajput-Mughal optical science.',
      iconType: 'sun'
    },
    {
      id: 'relic_mehrangarh_inscription',
      name: 'Mehrangarh Inscription Relic',
      tier: 'Legendary Relic',
      xpReward: 150,
      lore: 'An engraved red sandstone tablet bearing the founding seal of Rao Jodha and the solar crest of Marwar.',
      iconType: 'scroll'
    },
    {
      id: 'relic_jaisalmer_route',
      name: 'Golden Route Relic',
      tier: 'Legendary Relic',
      xpReward: 200,
      lore: 'A masterfully sculpted golden sandstone merchant seal bearing the caravan compass of the Thar Desert and the royal crest of Rawal Jaisal.',
      iconType: 'compass'
    }
  ],
  quizzesSolved: 1,
  puzzlesSolved: 3,
  activeState: 'rajasthan'
};

export default function App() {
  // Screen State Machine: 'TITLE' | 'JOURNEY_HUB' | 'STATE_MAP' | 'LOCATION_EXPLORE' | 'MINIGAME' | 'QUIZ'
  const [currentScreen, setCurrentScreen] = useState('TITLE');
  
  // Active Navigation Target
  const [activeLocation, setActiveLocation] = useState(RAJASTHAN_STATE_DATA.locations[0]);
  
  // Game Modals
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCodexModal, setShowCodexModal] = useState(false);
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [lastQuizResult, setLastQuizResult] = useState(null);

  // SIH Demo Mode State (Isolated Sandbox)
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStats, setDemoStats] = useState(null);

  // Audio Configuration
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Persistent Normal Player Stats State
  const [playerStats, setPlayerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('heritage_quest_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PLAYER_STATS;
  });

  // Active Effective Stats (Uses Demo sandbox during demo, normal stats otherwise)
  const activePlayerStats = isDemoMode && demoStats ? demoStats : playerStats;

  // Save Player Stats on Change (ONLY when NOT in demo mode to protect real save)
  useEffect(() => {
    if (!isDemoMode) {
      try {
        localStorage.setItem('heritage_quest_stats_v1', JSON.stringify(playerStats));
      } catch {
        // ignore
      }
    }
  }, [playerStats, isDemoMode]);

  // Unified State Updater
  const updatePlayerStats = (updater) => {
    if (isDemoMode) {
      setDemoStats((prev) => updater(prev || DEMO_INITIAL_STATS));
    } else {
      setPlayerStats(updater);
    }
  };

  // Audio Toggle Handler
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  // Demo Mode Triggers
  const handleStartDemo = () => {
    setIsDemoMode(true);
    setDemoStats(DEMO_INITIAL_STATS);
    setActiveLocation(RAJASTHAN_STATE_DATA.locations[0]);
    setCurrentScreen('JOURNEY_HUB');
  };

  const handleRestartDemo = () => {
    setDemoStats(DEMO_INITIAL_STATS);
    setShowMasterModal(false);
    setShowRewardModal(false);
    setShowCodexModal(false);
    setActiveLocation(RAJASTHAN_STATE_DATA.locations[0]);
    setCurrentScreen('JOURNEY_HUB');
  };

  const handleExitDemo = () => {
    setIsDemoMode(false);
    setDemoStats(null);
    setShowMasterModal(false);
    setShowRewardModal(false);
    setShowCodexModal(false);
    setCurrentScreen('TITLE');
  };

  // Navigation Back State Machine
  const handleNavigateBack = () => {
    if (showRewardModal) {
      setShowRewardModal(false);
      setCurrentScreen('JOURNEY_HUB');
      return;
    }
    if (showCodexModal) {
      setShowCodexModal(false);
      return;
    }

    switch (currentScreen) {
      case 'QUIZ':
        setCurrentScreen('MINIGAME');
        break;
      case 'MINIGAME':
        setCurrentScreen('LOCATION_EXPLORE');
        break;
      case 'LOCATION_EXPLORE':
        setCurrentScreen('JOURNEY_HUB');
        break;
      case 'STATE_MAP':
        setCurrentScreen('JOURNEY_HUB');
        break;
      case 'JOURNEY_HUB':
        if (isDemoMode) {
          handleExitDemo();
        } else {
          setCurrentScreen('TITLE');
        }
        break;
      default:
        setCurrentScreen('TITLE');
        break;
    }
  };

  // Screen Flow Triggers
  const handleStartGame = () => {
    setIsDemoMode(false);
    setCurrentScreen('JOURNEY_HUB');
  };

  const handleEnterAmerFort = () => {
    setActiveLocation(RAJASTHAN_STATE_DATA.locations[0]);
    setCurrentScreen('LOCATION_EXPLORE');
  };

  const handleSelectLocation = (location) => {
    const targetId = typeof location === 'string' ? location : location?.id;
    const fullLocation = RAJASTHAN_STATE_DATA.locations.find(l => l.id === targetId) || location;
    setActiveLocation(fullLocation);
    setCurrentScreen('LOCATION_EXPLORE');
  };

  const handleStartMiniGame = () => {
    setCurrentScreen('MINIGAME');
  };

  const handleClaimExplorationXP = (xpAmount = 75) => {
    const isAlreadyExplored = activePlayerStats.completedExplorations?.includes(activeLocation.id);
    if (isAlreadyExplored) return;

    updatePlayerStats((prev) => {
      const newXP = prev.xp + xpAmount;
      const completedExplorations = [...(prev.completedExplorations || []), activeLocation.id];

      let rankTitle = 'Novice Explorer';
      if (newXP >= 1200) rankTitle = 'Grand Lorekeeper of Bharat';
      else if (newXP >= 800) rankTitle = 'Royal Chronicler';
      else if (newXP >= 400) rankTitle = 'Heritage Seeker';
      else if (newXP > 0) rankTitle = 'Apprentice Explorer';

      return {
        ...prev,
        xp: newXP,
        rankTitle,
        completedExplorations
      };
    });
  };

  const handleCompleteRestoration = ({ xpAward = 100, relicAward }) => {
    const relic = relicAward || activeLocation.relic;
    const isAlreadyCompleted = activePlayerStats.completedLocations.includes(activeLocation.id);

    // If already completed, don't inflate XP or duplicate relics
    if (isAlreadyCompleted) return;

    updatePlayerStats((prev) => {
      const newXP = prev.xp + xpAward;
      const completed = [...prev.completedLocations, activeLocation.id];
      
      // Compute progressive unlocks
      const newlyUnlocked = [...(prev.unlockedLocations || ['amer-fort'])];
      if (activeLocation.id === 'amer-fort' && !newlyUnlocked.includes('mehrangarh-fort')) {
        newlyUnlocked.push('mehrangarh-fort');
      } else if (activeLocation.id === 'mehrangarh-fort' && !newlyUnlocked.includes('jaisalmer-fort')) {
        newlyUnlocked.push('jaisalmer-fort');
      } else if (activeLocation.id === 'jaisalmer-fort' && !newlyUnlocked.includes('chittorgarh-fort')) {
        newlyUnlocked.push('chittorgarh-fort');
      }

      const relics = prev.unlockedRelics.some(r => r.id === relic.id)
        ? prev.unlockedRelics
        : [...prev.unlockedRelics, relic];

      let rankTitle = 'Novice Explorer';
      if (newXP >= 1200) rankTitle = 'Grand Lorekeeper of Bharat';
      else if (newXP >= 800) rankTitle = 'Royal Chronicler';
      else if (newXP >= 400) rankTitle = 'Heritage Seeker';
      else if (newXP > 0) rankTitle = 'Apprentice Explorer';

      return {
        ...prev,
        xp: newXP,
        rankTitle,
        completedLocations: completed,
        unlockedLocations: newlyUnlocked,
        unlockedRelics: relics,
        puzzlesSolved: prev.puzzlesSolved + 1
      };
    });
  };

  // Handler for completing Mehrangarh Chapter (Decoder Mini-Game)
  const handleCompleteMehrangarhChapter = ({ xpAward = 150, relicAward }) => {
    const relic = relicAward || activeLocation.relic || {
      id: 'relic_mehrangarh_inscription',
      name: 'Mehrangarh Inscription Relic',
      tier: 'Legendary Relic',
      xpReward: 150,
      lore: 'An engraved red sandstone tablet bearing the founding seal of Rao Jodha and the solar crest of Marwar.',
      iconType: 'relic'
    };

    const isAlreadyCompleted = activePlayerStats.completedLocations.includes('mehrangarh-fort');

    updatePlayerStats((prev) => {
      const newXP = isAlreadyCompleted ? prev.xp : prev.xp + xpAward;
      const completed = isAlreadyCompleted 
        ? prev.completedLocations 
        : [...prev.completedLocations, 'mehrangarh-fort'];

      // Unlock Jaisalmer Fort
      const newlyUnlocked = [...(prev.unlockedLocations || ['amer-fort', 'mehrangarh-fort'])];
      if (!newlyUnlocked.includes('jaisalmer-fort')) {
        newlyUnlocked.push('jaisalmer-fort');
      }

      const relics = prev.unlockedRelics.some(r => r.id === relic.id)
        ? prev.unlockedRelics
        : [...prev.unlockedRelics, relic];

      let rankTitle = 'Novice Explorer';
      if (newXP >= 1200) rankTitle = 'Grand Lorekeeper of Bharat';
      else if (newXP >= 800) rankTitle = 'Royal Chronicler';
      else if (newXP >= 400) rankTitle = 'Heritage Seeker';
      else if (newXP > 0) rankTitle = 'Apprentice Explorer';

      return {
        ...prev,
        xp: newXP,
        rankTitle,
        completedLocations: completed,
        unlockedLocations: newlyUnlocked,
        unlockedRelics: relics,
        puzzlesSolved: prev.puzzlesSolved + 1
      };
    });

    setCurrentScreen('JOURNEY_HUB');
  };

  // Handler for completing Jaisalmer Chapter (Route Reconstruction Mini-Game)
  const handleCompleteJaisalmerChapter = ({ xpAward = 200, relicAward }) => {
    const relic = relicAward || activeLocation.relic || {
      id: 'relic_jaisalmer_route',
      name: 'Golden Route Relic',
      tier: 'Legendary Relic',
      xpReward: 200,
      lore: 'A masterfully sculpted golden sandstone merchant seal bearing the caravan compass of the Thar Desert and the royal crest of Rawal Jaisal.',
      iconType: 'compass'
    };

    const isAlreadyCompleted = activePlayerStats.completedLocations.includes('jaisalmer-fort');

    updatePlayerStats((prev) => {
      const newXP = isAlreadyCompleted ? prev.xp : prev.xp + xpAward;
      const completed = isAlreadyCompleted 
        ? prev.completedLocations 
        : [...prev.completedLocations, 'jaisalmer-fort'];

      // Unlock Chittorgarh Fort
      const newlyUnlocked = [...(prev.unlockedLocations || ['amer-fort', 'mehrangarh-fort', 'jaisalmer-fort'])];
      if (!newlyUnlocked.includes('chittorgarh-fort')) {
        newlyUnlocked.push('chittorgarh-fort');
      }

      const relics = prev.unlockedRelics.some(r => r.id === relic.id)
        ? prev.unlockedRelics
        : [...prev.unlockedRelics, relic];

      let rankTitle = 'Novice Explorer';
      if (newXP >= 1200) rankTitle = 'Grand Lorekeeper of Bharat';
      else if (newXP >= 800) rankTitle = 'Royal Chronicler';
      else if (newXP >= 400) rankTitle = 'Heritage Seeker';
      else if (newXP > 0) rankTitle = 'Apprentice Explorer';

      return {
        ...prev,
        xp: newXP,
        rankTitle,
        completedLocations: completed,
        unlockedLocations: newlyUnlocked,
        unlockedRelics: relics,
        puzzlesSolved: prev.puzzlesSolved + 1
      };
    });

    setCurrentScreen('JOURNEY_HUB');
  };

  // Handler for completing Chittorgarh Chapter (Preservation Challenges)
  const handleCompleteChittorgarhChapter = ({ xpAward = 250, relicAward }) => {
    const relic = relicAward || activeLocation.relic || {
      id: 'relic_chittorgarh_crest',
      name: 'Guardian of Chittorgarh',
      tier: 'Mythic Relic',
      xpReward: 250,
      lore: 'A sacred golden Mewari seal crowned with the Tower of Victory and the sunburst crest, awarded to true guardians of India’s living heritage.',
      iconType: 'flame'
    };

    const isAlreadyCompleted = activePlayerStats.completedLocations.includes('chittorgarh-fort');

    updatePlayerStats((prev) => {
      const newXP = isAlreadyCompleted ? prev.xp : prev.xp + xpAward;
      const completed = isAlreadyCompleted 
        ? prev.completedLocations 
        : [...prev.completedLocations, 'chittorgarh-fort'];

      const relics = prev.unlockedRelics.some(r => r.id === relic.id)
        ? prev.unlockedRelics
        : [...prev.unlockedRelics, relic];

      return {
        ...prev,
        xp: newXP,
        rankTitle: 'Master Lorekeeper of Rajasthan',
        completedLocations: completed,
        unlockedRelics: relics,
        puzzlesSolved: prev.puzzlesSolved + 1
      };
    });

    setShowMasterModal(true);
    setCurrentScreen('JOURNEY_HUB');
  };

  const handleCompleteQuiz = (result) => {
    setLastQuizResult(result);
    const isAlreadyQuizDone = activePlayerStats.completedQuizzes?.includes(activeLocation.id);

    // Calculate Quiz Reward (Anti-inflation: only once per location)
    const xpGain = isAlreadyQuizDone ? 0 : (result.correctCount || 0) * 50;

    updatePlayerStats((prev) => {
      const newXP = prev.xp + xpGain;
      const completedQuizzes = isAlreadyQuizDone
        ? (prev.completedQuizzes || [])
        : [...(prev.completedQuizzes || []), activeLocation.id];

      let rankTitle = 'Novice Explorer';
      if (newXP >= 1200) rankTitle = 'Grand Lorekeeper of Bharat';
      else if (newXP >= 800) rankTitle = 'Royal Chronicler';
      else if (newXP >= 400) rankTitle = 'Heritage Seeker';
      else if (newXP > 0) rankTitle = 'Apprentice Explorer';

      return {
        ...prev,
        xp: newXP,
        rankTitle,
        completedQuizzes,
        quizzesSolved: prev.quizzesSolved + 1
      };
    });
  };

  const handleReturnToMapFromReward = () => {
    setShowRewardModal(false);
    setCurrentScreen('JOURNEY_HUB');
  };

  return (
    <div className="game-root-wrapper">
      {/* Top Universal Game HUD */}
      <HeaderHUD
        currentScreen={currentScreen}
        onNavigateBack={handleNavigateBack}
        playerStats={activePlayerStats}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onOpenCodex={() => setShowCodexModal(true)}
        isDemoMode={isDemoMode}
        onExitDemo={handleExitDemo}
        locationTitle={
          currentScreen === 'MINIGAME' 
            ? `${activeLocation.name} • ${activeLocation.id === 'jaisalmer-fort' ? 'Reconstruct Route' : activeLocation.id === 'mehrangarh-fort' ? 'Decode Inscription' : 'Restore the Heritage'}`
            : currentScreen === 'QUIZ'
              ? `${activeLocation.name} • Knowledge Challenge`
              : currentScreen === 'LOCATION_EXPLORE'
                ? activeLocation.name 
                : currentScreen === 'JOURNEY_HUB'
                  ? 'Rajasthan: Heritage Journey Hub'
                  : ''
        }
      />

      {/* Main Game Screen Viewport */}
      <main className="game-main-viewport">
        {currentScreen === 'TITLE' && (
          <TitleScreen 
            onStartGame={handleStartGame}
            onStartDemo={handleStartDemo}
            playerStats={activePlayerStats}
          />
        )}

        {currentScreen === 'JOURNEY_HUB' && (
          <RajasthanJourneyHub
            onEnterAmerFort={handleEnterAmerFort}
            onSelectLocation={handleSelectLocation}
            onOpenMap={() => setCurrentScreen('STATE_MAP')}
            onOpenCodex={() => setShowCodexModal(true)}
            playerStats={activePlayerStats}
          />
        )}

        {currentScreen === 'STATE_MAP' && (
          <StateMapScreen
            onSelectLocation={handleSelectLocation}
            playerStats={activePlayerStats}
            onOpenCodex={() => setShowCodexModal(true)}
          />
        )}

        {currentScreen === 'LOCATION_EXPLORE' && (
          activeLocation.id === 'chittorgarh-fort' ? (
            <ChittorgarhExploreScreen
              location={activeLocation}
              onCompleteChapter={handleCompleteChittorgarhChapter}
              onClaimExplorationXP={handleClaimExplorationXP}
              playerStats={activePlayerStats}
              onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          ) : activeLocation.id === 'jaisalmer-fort' ? (
            <JaisalmerExploreScreen
              location={activeLocation}
              onStartMiniGame={handleStartMiniGame}
              onClaimExplorationXP={handleClaimExplorationXP}
              playerStats={activePlayerStats}
              onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          ) : activeLocation.id === 'mehrangarh-fort' ? (
            <MehrangarhExploreScreen
              location={activeLocation}
              onStartMiniGame={handleStartMiniGame}
              onClaimExplorationXP={handleClaimExplorationXP}
              playerStats={activePlayerStats}
              onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          ) : (
            <LocationExploreScreen
              location={activeLocation}
              onStartMiniGame={handleStartMiniGame}
              onClaimExplorationXP={handleClaimExplorationXP}
              playerStats={activePlayerStats}
              onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          )
        )}

        {currentScreen === 'MINIGAME' && (
          activeLocation.id === 'jaisalmer-fort' ? (
            <JaisalmerRouteGame
              location={activeLocation}
              playerStats={activePlayerStats}
              onCompleteChapter={handleCompleteJaisalmerChapter}
              onReturnToMap={() => setCurrentScreen('LOCATION_EXPLORE')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          ) : activeLocation.id === 'mehrangarh-fort' ? (
            <MehrangarhDecoderGame
              location={activeLocation}
              playerStats={activePlayerStats}
              onCompleteChapter={handleCompleteMehrangarhChapter}
              onReturnToMap={() => setCurrentScreen('LOCATION_EXPLORE')}
              onOpenCodex={() => setShowCodexModal(true)}
            />
          ) : (
            <RestoreHeritageMiniGame
              location={activeLocation}
              onCompleteRestoration={handleCompleteRestoration}
              onStartQuiz={() => setCurrentScreen('QUIZ')}
              onReturnToExplore={() => setCurrentScreen('LOCATION_EXPLORE')}
              onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
              onOpenCodex={() => setShowCodexModal(true)}
              playerStats={activePlayerStats}
            />
          )
        )}

        {currentScreen === 'QUIZ' && (
          <QuizChallenge
            location={activeLocation}
            playerStats={activePlayerStats}
            onCompleteQuiz={handleCompleteQuiz}
            onReturnToMap={() => setCurrentScreen('JOURNEY_HUB')}
            onExploreAgain={() => setCurrentScreen('LOCATION_EXPLORE')}
            onOpenCodex={() => setShowCodexModal(true)}
          />
        )}
      </main>

      {/* Grand Celebration Reward Modal */}
      {showRewardModal && (
        <RewardModal
          location={activeLocation}
          quizResult={lastQuizResult}
          onReturnToMap={handleReturnToMapFromReward}
          onOpenCodex={() => {
            setShowRewardModal(false);
            setShowCodexModal(true);
          }}
          playerStats={activePlayerStats}
        />
      )}

      {/* Heritage Codex & Relic Vault Modal */}
      <CodexModal
        isOpen={showCodexModal}
        onClose={() => setShowCodexModal(false)}
        playerStats={activePlayerStats}
      />

      {/* Rajasthan Master Explorer Grand Finale Modal */}
      <RajasthanMasterCelebrationModal
        isOpen={showMasterModal}
        onReturnToHub={() => setShowMasterModal(false)}
        onOpenCodex={() => {
          setShowMasterModal(false);
          setShowCodexModal(true);
        }}
        isDemoMode={isDemoMode}
        onRestartDemo={handleRestartDemo}
        onExitDemo={handleExitDemo}
        playerStats={activePlayerStats}
      />
    </div>
  );
}
