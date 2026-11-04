
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

export function useYouTubePlayer() {
  const playerRef = useRef<PlayerInstance | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onReady = useCallback((event: { target: PlayerInstance }) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration() || 0);
  }, []);

  const onStateChange = useCallback((event: { data: number }) => {
    // YouTube PlayerState:
    // 0 = ended, 1 = playing, 2 = paused
    setIsPlaying(event.data === 1);

    if (event.data === 0) {
      setCurrentTime(0);
    }
  }, []);

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!playerRef.current) return;

      setCurrentTime(playerRef.current.getCurrentTime() || 0);
      setDuration(playerRef.current.getDuration() || 0);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return {
    onReady,
    onStateChange,
    play,
    pause,
    togglePlay,
    seek,
    isPlaying,
    currentTime,
    duration,
  };
}
