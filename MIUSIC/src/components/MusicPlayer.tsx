import React, { useState, useRef, useEffect } from 'react';
import { IonRange, IonIcon, IonButton, IonImg } from '@ionic/react';
import { playCircle, pauseCircle, playSkipBack, playSkipForward, volumeHigh, volumeLow } from 'ionicons/icons';
import { usePlayer } from '../contexts/PlayerContext';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, playNextSong, playPreviousSong } = usePlayer();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current!.duration);
      });
      audioRef.current.addEventListener('ended', playNextSong);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', playNextSong);
      }
    };
  }, [playNextSong]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const seek = (e: CustomEvent) => {
    if (audioRef.current) {
      const newTime = (e.detail.value as number / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: CustomEvent) => {
    const newVolume = e.detail.value as number;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="music-player">
      <div className="music-player-content">
        <div className="song-info">
          <IonImg src={currentSong.coverUrl} alt={currentSong.title} className="album-cover" />
          <div className="song-details">
            <p className="song-title">{currentSong.title}</p>
            <p className="artist-name">{currentSong.artist}</p>
          </div>
        </div>
        <div className="player-controls">
          <IonButton fill="clear" onClick={playPreviousSong}>
            <IonIcon icon={playSkipBack} />
          </IonButton>
          <IonButton fill="clear" onClick={togglePlayPause} className="play-pause-button">
            <IonIcon icon={isPlaying ? pauseCircle : playCircle} />
          </IonButton>
          <IonButton fill="clear" onClick={playNextSong}>
            <IonIcon icon={playSkipForward} />
          </IonButton>
        </div>
        <div className="progress-volume">
          <div className="progress-bar-container">
            <IonRange
              min={0}
              max={100}
              value={(currentTime / duration) * 100 || 0}
              onIonChange={seek}
              className="progress-bar"
            />
            <div className="time-info">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="volume-control">
            <IonIcon icon={volume > 50 ? volumeHigh : volumeLow} />
            <IonRange
              min={0}
              max={100}
              value={volume}
              onIonChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;