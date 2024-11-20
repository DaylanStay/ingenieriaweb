import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon, IonImg, IonSpinner, IonBackButton, IonButtons } from '@ionic/react';
import { play, pause } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  privacy: string;
  user_id: number;
  songs: Song[];
}

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentSong, setCurrentSong, isPlaying, togglePlayPause } = usePlayer();
  const history = useHistory();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/playlists/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data);
        } else {
          throw new Error('Error al obtener los detalles de la playlist');
        }
      } catch (error) {
        console.error('Error: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      togglePlayPause(true);
    }
  };

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setCurrentSong(song);
      togglePlayPause(true);
    }
  };

  const handleSongClick = (songId: number) => {
    history.push(`/song/${songId}`);
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (!playlist) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>No se pudo cargar la playlist.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/library" />
          </IonButtons>
          <IonTitle>{playlist.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <h1>{playlist.name}</h1>
          <p>{playlist.description}</p>
          <IonButton expand="block" onClick={handlePlayAll}>Reproducir todo</IonButton>
        </div>
        <IonList>
          {playlist.songs.map((song) => (
            <IonItem key={song.id} onClick={() => handleSongClick(song.id)}>
              <IonImg src={song.coverUrl} slot="start" style={{ width: '50px', height: '50px' }} />
              <IonLabel>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
              </IonLabel>
              <IonButton slot="end" fill="clear" onClick={(e) => {
                e.stopPropagation();
                handlePlayPause(song);
              }}>
                <IonIcon icon={currentSong?.id === song.id && isPlaying ? pause : play} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistDetails;