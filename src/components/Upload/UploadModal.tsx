import React, { useState, useRef } from 'react';
import { X, UploadCloud, Sparkles, CheckCircle2 } from 'lucide-react';
import { scanLocalFiles } from '../../services/localScanner';
import { Song } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSongsAdded: (songs: Song[]) => void;
}

type Stage = 'idle' | 'reading' | 'analyzing' | 'building' | 'ready';

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSongsAdded
}) => {
  const [stage, setStage] = useState<Stage>('idle');
  const [stageText, setStageText] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setStage('reading');
    setStageText('READING AUDIO METADATA...');
    setProgress(20);

    await new Promise((r) => setTimeout(r, 600));
    setStage('analyzing');
    setStageText('SPECTRAL FREQUENCY ANALYSIS...');
    setProgress(50);

    await new Promise((r) => setTimeout(r, 600));
    setStage('building');
    setStageText('SYNTHESIZING VISUAL PROFILE & LYRIC MAPPING...');
    setProgress(85);

    const { addedSongs } = await scanLocalFiles(files);

    await new Promise((r) => setTimeout(r, 400));
    setStage('ready');
    setStageText('ATMOSPHERE READY.');
    setProgress(100);

    await new Promise((r) => setTimeout(r, 600));
    onSongsAdded(addedSongs);
    setStage('idle');
    setProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl text-[#e4e2dd] select-none">
      
      <div className="relative max-w-xl w-full bg-[#12141a] border border-white/15 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === 'idle' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            className="w-full border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-12 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*,.lrc"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform text-white">
              <UploadCloud className="w-8 h-8 text-amber-300" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl text-white tracking-wide uppercase">
                DROP THE SOUND.
              </h3>
              <p className="text-xs font-mono text-white/50 mt-1">
                Drag .mp3, .wav, .flac audio or matching .lrc lyric files here.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 w-full flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
              {stage === 'ready' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
              )}
            </div>

            <div className="space-y-2 w-full max-w-sm">
              <h4 className="font-mono text-xs text-white tracking-widest uppercase">
                {stageText}
              </h4>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 to-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
