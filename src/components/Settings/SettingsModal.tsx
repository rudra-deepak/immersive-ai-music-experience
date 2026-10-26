import React from 'react';
import { X, Key, Sliders, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isReducedMotion,
  onToggleReducedMotion
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl text-[#e4e2dd] select-none font-mono">
      
      <div className="relative max-w-lg w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide">
                ENGINE SETTINGS
              </h3>
              <p className="text-xs text-white/50">Customization & Shortcuts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <EyeOff className="w-4 h-4 text-amber-300" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase">REDUCED MOTION</h4>
              <p className="text-[11px] text-white/50">Lowers canvas particle count for accessibility & performance</p>
            </div>
          </div>

          <button
            onClick={onToggleReducedMotion}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isReducedMotion ? 'bg-amber-400' : 'bg-white/20'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-black transition-transform ${
              isReducedMotion ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Keyboard Shortcuts Sheet */}
        <div className="space-y-2 bg-[#0a0b0e] p-5 rounded-2xl border border-white/10 text-xs">
          <div className="text-[10px] text-white/40 uppercase mb-2 flex items-center gap-1.5">
            <Key className="w-3 h-3 text-sky-400" /> KEYBOARD SHORTCUTS
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/70">PLAY / PAUSE</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">SPACE</kbd>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/70">COMMAND SEARCH</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">CMD + K</kbd>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/70">MUTE / UNMUTE</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">M</kbd>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/70">LYRICS OVERLAY</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">L</kbd>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/70">AI DIRECTOR MODE</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">D</kbd>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-all shadow-xl"
        >
          SAVE & CLOSE
        </button>

      </div>

    </div>
  );
};
