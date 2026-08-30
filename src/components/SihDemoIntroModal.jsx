import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  X, 
  Zap
} from 'lucide-react';
import { sound } from '../data/soundEffects';

export default function SihDemoIntroModal({ isOpen, onClose, onStartDemo }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content sih-demo-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header sih-demo-header">
          <div className="sih-demo-badge">
            <Zap size={15} className="text-gold" />
            <span>SIH 2024 EVALUATION MODE</span>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body sih-demo-body">
          <div className="sih-demo-titles">
            <h2 className="sih-demo-main-title">HERITAGE QUEST &bull; RAJASTHAN DEMO</h2>
            <p className="sih-demo-sub-tagline">
              &ldquo;Experience the complete Rajasthan heritage journey.&rdquo;
            </p>
          </div>

          {/* 3 Pillars Summary Grid */}
          <div className="sih-demo-pillars-grid">
            <div className="sih-pillar-card">
              <div className="pillar-num-badge">4</div>
              <h4>HERITAGE LOCATIONS</h4>
              <p>Amer, Mehrangarh, Jaisalmer &amp; Chittorgarh Forts</p>
            </div>

            <div className="sih-pillar-card">
              <div className="pillar-num-badge">4</div>
              <h4>GAMEPLAY MECHANICS</h4>
              <p>Optics Restoration, Epigraphy, Trade Routes &amp; Conservation</p>
            </div>

            <div className="sih-pillar-card highlight-pillar">
              <div className="pillar-num-badge">1</div>
              <h4>HERITAGE JOURNEY</h4>
              <p>From 360° physical exploration to living preservation</p>
            </div>
          </div>

          {/* Demo Features Notice */}
          <div className="sih-demo-features-box">
            <h4 className="features-box-heading">
              <Sparkles size={16} className="text-gold" />
              <span>JUDGES DEMONSTRATION WORKFLOW</span>
            </h4>
            <div className="features-checklist">
              <div className="checklist-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span><strong>Fast-Track Access:</strong> Instantly launch any of the 4 citadel learning mechanics.</span>
              </div>
              <div className="checklist-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span><strong>Interactive Gameplay Preserved:</strong> Presenters perform real tactile puzzles, not passive videos.</span>
              </div>
              <div className="checklist-item">
                <CheckCircle2 size={15} className="text-emerald" />
                <span><strong>Safe Sandbox:</strong> Exiting Demo Mode restores your normal saved progress completely.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer sih-demo-footer">
          <button 
            className="btn-heritage-secondary"
            onClick={onClose}
          >
            <span>Cancel</span>
          </button>

          <button 
            className="btn-heritage-primary btn-large-cta pulse-gold"
            onClick={() => {
              sound.playFanfare();
              onStartDemo();
            }}
          >
            <Play size={18} fill="currentColor" />
            <span>START DEMO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
