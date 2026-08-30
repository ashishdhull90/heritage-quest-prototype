import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  Sun, 
  ArrowRight
} from 'lucide-react';
import { sound } from '../../data/soundEffects';

/*
  Grid Coordinate System:
  4 rows x 4 cols (0 to 3)
  Directions: 'UP', 'DOWN', 'LEFT', 'RIGHT'
  
  Mirror Slants:
  - 'SLASH' (/) :
      Incoming RIGHT -> Deflects UP
      Incoming DOWN  -> Deflects LEFT
      Incoming LEFT  -> Deflects DOWN
      Incoming UP    -> Deflects RIGHT
  
  - 'BACKSLASH' (\) :
      Incoming RIGHT -> Deflects DOWN
      Incoming UP    -> Deflects LEFT
      Incoming LEFT  -> Deflects UP
      Incoming DOWN  -> Deflects RIGHT
*/

export default function SheeshMahalMirrorPuzzle({ location, onCompletePuzzle }) {
  // Grid layout state
  const [cells, setCells] = useState(() => [
    // 0: Source (0,0)
    { row: 0, col: 0, type: 'SOURCE' },
    { row: 0, col: 1, type: 'EMPTY' },
    { row: 0, col: 2, type: 'MIRROR', slant: 'SLASH' }, // Needs to be BACKSLASH (\) to deflect right -> down
    { row: 0, col: 3, type: 'EMPTY' },

    // 1: Row 1
    { row: 1, col: 0, type: 'EMPTY' },
    { row: 1, col: 1, type: 'OBSTACLE' },
    { row: 1, col: 2, type: 'EMPTY' },
    { row: 1, col: 3, type: 'EMPTY' },

    // 2: Row 2
    { row: 2, col: 0, type: 'EMPTY' },
    { row: 2, col: 1, type: 'EMPTY' },
    { row: 2, col: 2, type: 'MIRROR', slant: 'SLASH' }, // Needs to be SLASH (/) to deflect down -> right
    { row: 2, col: 3, type: 'MIRROR', slant: 'SLASH' }, // Needs to be BACKSLASH (\) to deflect right -> down

    // 3: Row 3
    { row: 3, col: 0, type: 'EMPTY' },
    { row: 3, col: 1, type: 'OBSTACLE' },
    { row: 3, col: 2, type: 'EMPTY' },
    { row: 3, col: 3, type: 'TARGET' } // Chandelier at (3,3)
  ]);

  const [moves, setMoves] = useState(0);
  const [hintActive, setHintActive] = useState(false);

  // Compute laser raycast path
  const rayPath = useMemo(() => {
    const path = [{ row: 0, col: 0, x: 0.5, y: 0.5 }];
    let currRow = 0;
    let currCol = 0;
    let currDir = 'RIGHT';
    let reachedTarget = false;
    const maxSteps = 20;
    let steps = 0;

    while (steps < maxSteps) {
      steps++;
      let nextRow = currRow;
      let nextCol = currCol;

      if (currDir === 'RIGHT') nextCol++;
      else if (currDir === 'LEFT') nextCol--;
      else if (currDir === 'DOWN') nextRow++;
      else if (currDir === 'UP') nextRow--;

      if (nextRow < 0 || nextRow >= 4 || nextCol < 0 || nextCol >= 4) {
        break;
      }

      path.push({ row: nextRow, col: nextCol, x: nextCol + 0.5, y: nextRow + 0.5 });
      currRow = nextRow;
      currCol = nextCol;

      const cell = cells.find(c => c.row === currRow && c.col === currCol);
      if (!cell) break;

      if (cell.type === 'OBSTACLE') {
        break;
      }

      if (cell.type === 'TARGET') {
        reachedTarget = true;
        break;
      }

      if (cell.type === 'MIRROR') {
        if (cell.slant === 'SLASH') {
          if (currDir === 'RIGHT') currDir = 'UP';
          else if (currDir === 'DOWN') currDir = 'LEFT';
          else if (currDir === 'LEFT') currDir = 'DOWN';
          else if (currDir === 'UP') currDir = 'RIGHT';
        } else if (cell.slant === 'BACKSLASH') {
          if (currDir === 'RIGHT') currDir = 'DOWN';
          else if (currDir === 'UP') currDir = 'LEFT';
          else if (currDir === 'LEFT') currDir = 'UP';
          else if (currDir === 'DOWN') currDir = 'RIGHT';
        }
      }
    }

    return { path, reachedTarget };
  }, [cells]);

  const isSolved = rayPath.reachedTarget;

  const handleRotateMirror = (row, col) => {
    sound.playMirrorRotate();
    setMoves(m => m + 1);

    const nextCells = cells.map(cell => {
      if (cell.row === row && cell.col === col && cell.type === 'MIRROR') {
        return {
          ...cell,
          slant: cell.slant === 'SLASH' ? 'BACKSLASH' : 'SLASH'
        };
      }
      return cell;
    });

    setCells(nextCells);

    // Quick audio check if this move connected the beam
    setTimeout(() => {
      // Re-evaluate target connection sound
      if (
        (row === 2 && col === 3) || 
        (row === 0 && col === 2) || 
        (row === 2 && col === 2)
      ) {
        sound.playChime();
      }
    }, 50);
  };

  const handleReset = () => {
    sound.playClick();
    setMoves(0);
    setCells([
      { row: 0, col: 0, type: 'SOURCE' },
      { row: 0, col: 1, type: 'EMPTY' },
      { row: 0, col: 2, type: 'MIRROR', slant: 'SLASH' },
      { row: 0, col: 3, type: 'EMPTY' },

      { row: 1, col: 0, type: 'EMPTY' },
      { row: 1, col: 1, type: 'OBSTACLE' },
      { row: 1, col: 2, type: 'EMPTY' },
      { row: 1, col: 3, type: 'EMPTY' },

      { row: 2, col: 0, type: 'EMPTY' },
      { row: 2, col: 1, type: 'EMPTY' },
      { row: 2, col: 2, type: 'MIRROR', slant: 'SLASH' },
      { row: 2, col: 3, type: 'MIRROR', slant: 'SLASH' },

      { row: 3, col: 0, type: 'EMPTY' },
      { row: 3, col: 1, type: 'OBSTACLE' },
      { row: 3, col: 2, type: 'EMPTY' },
      { row: 3, col: 3, type: 'TARGET' }
    ]);
  };

  const handleToggleHint = () => {
    sound.playClick();
    setHintActive(!hintActive);
  };

  return (
    <div className="minigame-container">
      {/* Minigame Header */}
      <div className="minigame-header">
        <div className="minigame-title-group">
          <span className="minigame-tag-badge">
            <Sparkles size={14} />
            Tactile Architectural Trial
          </span>
          <h2 className="minigame-title">{location.minigame.title}</h2>
          <p className="minigame-instructions">{location.minigame.instructions}</p>
        </div>

        {/* Controls Bar */}
        <div className="minigame-stats-bar">
          <div className="stat-counter-pill">
            <span>Rotations:</span>
            <strong>{moves}</strong>
          </div>

          <button 
            className="btn-heritage-secondary btn-sm"
            onClick={handleToggleHint}
            title="Toggle alignment hint"
          >
            <HelpCircle size={15} />
            <span>{hintActive ? 'Hide Guide' : 'Hint'}</span>
          </button>

          <button 
            className="btn-heritage-secondary btn-sm"
            onClick={handleReset}
            title="Reset puzzle grid"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Hint Alert Bar */}
      {hintActive && (
        <div className="hint-alert-box">
          <Sun size={18} className="text-gold" />
          <span>
            <strong>Optical Rule:</strong> Rotate Mirror at <strong>(Row 1, Col 3)</strong> to deflect the sunbeam down, and at <strong>(Row 3, Col 3)</strong> to channel the beam straight into the Royal Chandelier!
          </span>
        </div>
      )}

      {/* Main 4x4 Grid Chamber Canvas */}
      <div className="puzzle-chamber-frame">
        <div className="sheesh-mahal-grid">
          {/* Laser SVG Overlay */}
          <svg className="laser-svg-layer" viewBox="0 0 400 400" preserveAspectRatio="none">
            <defs>
              <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Render Light Beam Path Lines */}
            {rayPath.path.map((pt, i) => {
              if (i === 0) return null;
              const prev = rayPath.path[i - 1];
              return (
                <g key={i}>
                  {/* Outer glowing aura line */}
                  <line
                    x1={prev.x * 100}
                    y1={prev.y * 100}
                    x2={pt.x * 100}
                    y2={pt.y * 100}
                    stroke="rgba(253, 224, 71, 0.45)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    filter="url(#laserGlow)"
                  />
                  {/* Core sharp laser beam */}
                  <line
                    x1={prev.x * 100}
                    y1={prev.y * 100}
                    x2={pt.x * 100}
                    y2={pt.y * 100}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animated-laser-beam"
                  />
                  {/* Reflection Sparkle Node */}
                  <circle
                    cx={pt.x * 100}
                    cy={pt.y * 100}
                    r="4"
                    fill="#fef08a"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>

          {/* Grid Cells */}
          {cells.map((cell, idx) => {
            const isSource = cell.type === 'SOURCE';
            const isTarget = cell.type === 'TARGET';
            const isObstacle = cell.type === 'OBSTACLE';
            const isMirror = cell.type === 'MIRROR';

            return (
              <div
                key={idx}
                className={`grid-cell cell-${cell.type.toLowerCase()} ${isSolved && isTarget ? 'target-illuminated' : ''}`}
                onClick={() => {
                  if (isMirror) handleRotateMirror(cell.row, cell.col);
                }}
                role={isMirror ? 'button' : undefined}
                tabIndex={isMirror ? 0 : -1}
                aria-label={isMirror ? `Rotate Mirror at Row ${cell.row + 1}, Col ${cell.col + 1}` : cell.type}
              >
                {/* Sunlight Portal (Source) */}
                {isSource && (
                  <div className="source-portal-badge">
                    <Sun size={28} className="sun-pulse-anim" />
                    <span className="cell-mini-label">Sunlight</span>
                  </div>
                )}

                {/* Royal Chandelier (Target) */}
                {isTarget && (
                  <div className={`target-chandelier-badge ${isSolved ? 'glowing-chandelier' : ''}`}>
                    <Sparkles size={28} className={isSolved ? 'sparkle-spin-anim' : ''} />
                    <span className="cell-mini-label">Chandelier</span>
                  </div>
                )}

                {/* Sandstone Pillar (Obstacle) */}
                {isObstacle && (
                  <div className="obstacle-pillar-badge">
                    <div className="pillar-carving"></div>
                    <span className="cell-mini-label">Pillar</span>
                  </div>
                )}

                {/* Rotatable Brass Mirror Prism */}
                {isMirror && (
                  <div className={`mirror-prism-wrap mirror-slant-${cell.slant.toLowerCase()}`}>
                    <div className="mirror-frame">
                      <div className="mirror-glass-surface"></div>
                      <div className="mirror-brass-rim"></div>
                    </div>
                    <div className="rotate-indicator-icon">
                      <RotateCw size={12} />
                    </div>
                    <span className="mirror-tap-hint">Tap to rotate</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Victory Solved Banner */}
      {isSolved && (
        <div className="puzzle-victory-banner">
          <div className="victory-left-info">
            <CheckCircle2 size={24} color="var(--emerald-accent)" />
            <div>
              <h3>Sheesh Mahal Illuminated!</h3>
              <p>The morning sunbeam has set the entire hall of convex mirrors ablaze in starlight.</p>
            </div>
          </div>

          <button 
            className="btn-heritage-primary btn-proceed-quiz pulse-gold"
            onClick={() => {
              sound.playChime();
              onCompletePuzzle();
            }}
            id="proceed-quiz-btn"
          >
            <span>Proceed to Knowledge Challenge</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
