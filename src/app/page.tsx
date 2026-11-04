
"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AudioLines,
  Home,
  Search,
  Library,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
  Radio,
  Headphones,
  Loader2,
} from "lucide-react";

import { searchYouTube } from "@/services/youtube";
import { Song } from "@/types/music";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Home");

  const player = useYouTubePlayer();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const songs = await searchYouTube(search);
      setResults(songs);

      if (songs.length === 0) {
        setError("No matching songs found. Try another search.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites((previous) =>
      previous.includes(videoId)
        ? previous.filter((id) => id !== videoId)
        : [...previous, videoId]
    );
  };

  const visibleSongs =
    activeNav === "Favorites"
      ? results.filter((song) =>
          favorites.includes(song.videoId)
        )
      : results;

  const currentIndex = results.findIndex(
    (song) => song.videoId === currentSong?.videoId
  );

  const nextSong = () => {
    if (results.length === 0) return;

    const nextIndex =
      currentIndex >= results.length - 1 ? 0 : currentIndex + 1;

    setCurrentSong(results[nextIndex]);
  };

  const previousSong = () => {
    if (results.length === 0) return;

    const previousIndex =
      currentIndex <= 0 ? results.length - 1 : currentIndex - 1;

    setCurrentSong(results[previousIndex]);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <AudioLines size={23} color="white" />
          </div>
          SONORA
        </div>

        <div className="nav-label">MENU</div>

        {[
          { name: "Home", icon: Home },
          { name: "Discover", icon: Radio },
        ].map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activeNav === item.name ? "active" : ""
            }`}
            onClick={() => setActiveNav(item.name)}
          >
            <item.icon size={19} />
            <span>{item.name}</span>
          </button>
        ))}

        <button
          className={`nav-item ${
            activeNav === "Search" ? "active" : ""
          }`}
          onClick={() => {
            setActiveNav("Search");
            document.getElementById("song-search")?.focus();
          }}
        >
          <Search size={19} />
          <span>Search</span>
        </button>

        <div className="nav-label" style={{ marginTop: 35 }}>
          YOUR COLLECTION
        </div>

        <button
          className={`nav-item ${
            activeNav === "Library" ? "active" : ""
          }`}
          onClick={() => setActiveNav("Library")}
        >
          <Library size={19} />
          <span>My Library</span>
        </button>

        <button
          className={`nav-item ${
            activeNav === "Favorites" ? "active" : ""
          }`}
          onClick={() => setActiveNav("Favorites")}
        >
          <Heart size={19} />
          <span>Favorites</span>
        </button>

        <div className="sidebar-bottom">
          <Headphones size={22} color="#b69aff" />
          <p>Your music. Your mood. Your universe.</p>
        </div>
      </aside>

      {/* MAIN AREA */}

      <main className="main-area">

        <header className="topbar">
          <form className="search-box" onSubmit={handleSearch}>
            <Search size={19} />

            <input
              id="song-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs, artists, albums..."
            />

            <button
              type="submit"
              disabled={loading || !search.trim()}
              aria-label="Search songs"
              style={{
                background: "transparent",
                border: "none",
                color: "#b69aff",
              }}
            >
              {loading ? (
                <Loader2 className="spinning" size={19} />
              ) : (
                <Search size={19} />
              )}
            </button>
          </form>

          <div className="profile">
            <div className="avatar">S</div>
            <span>Music Lover</span>
          </div>
        </header>

        {/* HERO */}

        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              YOUR PERSONAL MUSIC UNIVERSE
            </div>

            <h1>
              Feel every beat.
              <br />
              <span>Live every moment.</span>
            </h1>

            <p>
              Discover the music that moves you.
              Your next favourite song is just one
              heartbeat away.
            </p>

            <button
              className="primary-button"
              onClick={() => {
                document.getElementById("song-search")?.focus();
              }}
            >
              <Search size={16} />
              Discover music
            </button>
          </div>

          <div className="vinyl-section">
            <motion.div
              className={`vinyl ${
                player.isPlaying ? "spinning" : ""
              }`}
              animate={{
                scale: player.isPlaying ? 1 : 0.96,
              }}
            >
              <div className="vinyl-label">
                {currentSong ? (
                  <img
                    src={currentSong.thumbnail}
                    alt={currentSong.title}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg,#8b5cf6,#17111f)",
                    }}
                  >
                    <Music2 color="white" size={30} />
                  </div>
                )}
              </div>
              <div className="vinyl-hole" />
            </motion.div>
          </div>
        </section>

        {/* YOUTUBE PLAYER */}

        {currentSong && (
          <YouTubePlayer
            key={currentSong.videoId}
            videoId={currentSong.videoId}
            onReady={player.onReady}
            onStateChange={player.onStateChange}
            onEnd={nextSong}
          />
        )}

        {/* SEARCH RESULTS */}

        <div className="section-heading">
          <h2>
            {activeNav === "Favorites"
              ? "Your favorites"
              : search
              ? "Search results"
              : "Discover music"}
          </h2>

          <span>{visibleSongs.length} tracks</span>
        </div>

        {loading && (
          <div className="empty-state">
            <Loader2 className="spinning" size={30} />
            <p>Searching the music universe...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <Music2 size={35} />
            <h3>No matching songs found</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && visibleSongs.length === 0 && (
          <div className="empty-state">
            <Music2 size={35} />
            <h3>
              {activeNav === "Favorites"
                ? "No favorites yet"
                : "Your music journey starts here"}
            </h3>
            <p>
              Search for your favourite song or artist above.
            </p>
          </div>
        )}

        <div className="music-grid">
          <AnimatePresence mode="popLayout">
            {visibleSongs.map((song) => (
              <motion.div
                key={song.videoId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="music-card"
                onClick={() => playSong(song)}
              >
                <div className="cover-wrap">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                  />

                  <button
                    className="cover-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                    aria-label={`Play ${song.title}`}
                  >
                    <Play size={19} fill="currentColor" />
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 5,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song.videoId);
                    }}
                    aria-label="Toggle favorite"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: favorites.includes(song.videoId)
                        ? "#c4a5ff"
                        : "#777",
                    }}
                  >
                    <Heart
                      size={17}
                      fill={
                        favorites.includes(song.videoId)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM PLAYER */}

      {currentSong && (
        <footer className="player-bar">

          <div className="now-playing">
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
            />

            <div style={{ minWidth: 0 }}>
              <h4>{currentSong.title}</h4>
              <p>{currentSong.artist}</p>
            </div>

            <Heart
              size={17}
              color={
                favorites.includes(currentSong.videoId)
                  ? "#c4a5ff"
                  : "#777"
              }
              fill={
                favorites.includes(currentSong.videoId)
                  ? "#c4a5ff"
                  : "none"
              }
              style={{ cursor: "pointer", flexShrink: 0 }}
              onClick={() =>
                toggleFavorite(currentSong.videoId)
              }
            />
          </div>

          <div className="player-center">
            <div className="control-buttons">
              <button
                onClick={previousSong}
                aria-label="Previous song"
              >
                <SkipBack size={19} />
              </button>

              <button
                className="play-control"
                onClick={player.togglePlay}
                aria-label={player.isPlaying ? "Pause" : "Play"}
              >
                {player.isPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>

              <button
                onClick={nextSong}
                aria-label="Next song"
              >
                <SkipForward size={19} />
              </button>
            </div>

            <div className="progress-row">
              <span>{formatTime(player.currentTime)}</span>

              <input
                type="range"
                min={0}
                max={player.duration || 100}
                value={Math.min(
                  player.currentTime,
                  player.duration || 100
                )}
                onChange={(e) =>
                  player.seek(Number(e.target.value))
                }
                aria-label="Playback progress"
                style={{
                  flex: 1,
                  accentColor: "#a78bfa",
                  cursor: "pointer",
                  minWidth: 0,
                }}
              />

              <span>{formatTime(player.duration)}</span>
            </div>
          </div>

          <div className="player-extra">
            <Volume2 size={19} />
          </div>

        </footer>
      )}
    </div>
  );
}
