import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

interface Song {
  id: number;
  title: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
  artist: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
  isPlaying: boolean;
  togglePlayPause: (forcePlay?: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recommended-songs');
        const data = await response.json();
        setRecommendedSongs(data);
      } catch (error) {
        console.error('Error al encontrar canciones recomendadas: ', error);
      }
    };

    fetchRecommendedSongs();
  }, []);

  const playNextSong = useCallback(() => {
    if (currentSong && recommendedSongs.length > 0) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      if (currentIndex < recommendedSongs.length - 1) {
        setCurrentSong(recommendedSongs[currentIndex + 1]);
      } else {
        setCurrentSong(recommendedSongs[0]);
      }
    }
  }, [currentSong, recommendedSongs]);

  const playPreviousSong = useCallback(() => {
    if (currentSong && recommendedSongs.length > 0) {
      const currentIndex = recommendedSongs.findIndex(song => song.id === currentSong.id);
      if (currentIndex > 0) {
        setCurrentSong(recommendedSongs[currentIndex - 1]);
      } else {
        setCurrentSong(recommendedSongs[recommendedSongs.length - 1]);
      }
    }
  }, [currentSong, recommendedSongs]);

  const togglePlayPause = useCallback((forcePlay?: boolean) => {
    setIsPlaying(prev => forcePlay ?? !prev);
  }, []);

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong, playNextSong, playPreviousSong, isPlaying, togglePlayPause }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('Error contexto de reproductor');
  }
  return context;
};