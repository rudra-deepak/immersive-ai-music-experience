import React, { useEffect, useRef } from 'react';
import { VisualProfile, VisualMode } from '../../types';
import { VisualEngineCanvas } from '../../services/visualEngine';
import { audioEngine } from '../../services/audioEngine';

interface VisualizerCanvasProps {
  visualProfile: VisualProfile;
  activeMode?: VisualMode;
  isReducedMotion?: boolean;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  visualProfile,
  activeMode,
  isReducedMotion = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<VisualEngineCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new VisualEngineCanvas(canvasRef.current, visualProfile, isReducedMotion);
    engineRef.current = engine;

    let animId: number;

    const loop = () => {
      const audioData = audioEngine.getAnalysis();
      if (engineRef.current) {
        engineRef.current.render(audioData, activeMode);
      }
      animId = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [visualProfile, activeMode, isReducedMotion]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateProfile(visualProfile, isReducedMotion);
    }
  }, [visualProfile, isReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
