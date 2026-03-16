import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import AlgorithmEngine from './AlgorithmEngine';

/**
 * useAlgorithm Hook
 * 
 * Provides a React-friendly interface for the AlgorithmEngine.
 * Manages playback, state snapshots, and interactive controls.
 */
export const useAlgorithm = (generatorFn, initialParams) => {
  // Use a ref for the engine to avoid unnecessary re-renders of the engine instance itself
  const engineRef = useRef(new AlgorithmEngine(generatorFn, initialParams));
  
  // State for the current algorithm snapshot
  const [state, setState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [progress, setProgress] = useState({ current: -1, total: 0 });
  
  const intervalRef = useRef(null);

  // Sync progress state
  const updateProgress = useCallback(() => {
    setProgress({
      current: engineRef.current.currentStepIndex,
      total: engineRef.current.steps.length
    });
  }, []);

  // Update engine if generator function changes
  useEffect(() => {
    engineRef.current = new AlgorithmEngine(generatorFn, initialParams);
    setState(null);
    updateProgress();
  }, [generatorFn, initialParams]);

  const stepForward = useCallback(() => {
    const nextState = engineRef.current.stepForward();
    if (nextState) {
      setState(nextState);
      updateProgress();
      return true;
    } else {
      setIsPlaying(false);
      return false;
    }
  }, [updateProgress]);

  const stepBackward = useCallback(() => {
    const prevState = engineRef.current.stepBackward();
    if (prevState) {
      setState(prevState);
      updateProgress();
      return true;
    }
    return false;
  }, [updateProgress]);

  const reset = useCallback((newParams) => {
    setIsPlaying(false);
    engineRef.current.reset(newParams || initialParams);
    setState(null);
    updateProgress();
  }, [initialParams, updateProgress]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      // Calculation for delay: higher speed = lower delay
      // Min delay: ~200ms, Max delay: ~2200ms
      const delay = Math.max(100, 2200 - speed);
      
      intervalRef.current = setInterval(() => {
        const hasNext = stepForward();
        if (!hasNext) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
      }, delay);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, stepForward]);

  return {
    state,           // Current algorithm snapshot (type, data, indices, etc.)
    isPlaying,
    stepForward,
    stepBackward,
    reset,
    togglePlay,
    setSpeed,
    speed,
    progress,        // { current, total }
    isComplete: engineRef.current.isComplete
  };
};

export default useAlgorithm;
