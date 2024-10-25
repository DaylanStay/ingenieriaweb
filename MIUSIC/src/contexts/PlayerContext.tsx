import React, { createContext, useState, useContext, useEffect } from 'react';
import recommendedSongsData from '../data/recommendedSongs.json';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  playNextSong: () => void;
  playPreviousSong: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (currentSong) {
      const index = recommendedSongsData.findIndex(song => song.id === currentSong.id);
      setCurrentIndex(index);
    }
  }, [currentSong]);

  const playNextSong = () => {
    if (currentIndex < recommendedSongsData.length - 1) {
      setCurrentSong(recommendedSongsData[currentIndex + 1]);
    } else {
      setCurrentSong(recommendedSongsData[0]);
    }
  };

  const playPreviousSong = () => {
    if (currentIndex > 0) {
      setCurrentSong(recommendedSongsData[currentIndex - 1]);
    } else {
      setCurrentSong(recommendedSongsData[recommendedSongsData.length - 1]);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentSong, setCurrentSong, playNextSong, playPreviousSong }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('Error contexto reproductor música');
  }
  return context;
};