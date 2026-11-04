
"use client";

import YouTube, { YouTubeProps } from "react-youtube";

interface YouTubePlayerProps {
  videoId: string;
  onReady: YouTubeProps["onReady"];
  onStateChange: YouTubeProps["onStateChange"];
  onEnd?: YouTubeProps["onEnd"];
}

export default function YouTubePlayer({
  videoId,
  onReady,
  onStateChange,
  onEnd,
}: YouTubePlayerProps) {
  const options: YouTubeProps["opts"] = {
    width: "360",
    height: "203",
    playerVars: {
      autoplay: 1,
      controls: 1,
      playsinline: 1,
      rel: 0,
      enablejsapi: 1,
    },
  };

  return (
    <div className="youtube-player">
      <div className="youtube-player-label">
        <span className="youtube-live-dot" />
        NOW PLAYING ON YOUTUBE
      </div>

      <YouTube
        videoId={videoId}
        opts={options}
        onReady={onReady}
        onStateChange={onStateChange}
        onEnd={onEnd}
        className="youtube-frame"
      />
    </div>
  );
}
