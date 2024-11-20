import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/react';
import { playCircle, heart, heartOutline, arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';

interface AlbumDetailsParams {
  id: string;
}

interface Album {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  release: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
}

const AlbumDetails: React.FC = () => {
  const { id } = useParams<AlbumDetailsParams>();
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { setCurrentSong } = usePlayer();
  const history = useHistory();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/albums/${id}`);
        if (!response.ok) {
          throw new Error('Error al extraer detalles del Album');
        }
        const data = await response.json();
        setAlbum(data);
        setIsFavoriteState(isFavorite(data.id, 'album'));
      } catch (error) {
        console.error('Error al encontrar detalles del Album: ', error);
      }
    };

    const fetchAlbumSongs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/albums/${id}/songs`);
        if (!response.ok) {
          throw new Error('Error al extraer canciones del Album');
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error al encontrar canciones del album: ', error);
      }
    };

    fetchAlbumDetails();
    fetchAlbumSongs();
  }, [id, isFavorite]);

  const handleFavoriteClick = useCallback(() => {
    if (album) {
      if (isFavoriteState) {
        removeFromFavorites(album.id, 'album');
      } else {
        addToFavorites({
          id: album.id,
          title: album.title,
          artist: album.artist,
          coverUrl: album.coverUrl,
          type: 'album',
        });
      }
      setIsFavoriteState(!isFavoriteState);
    }
  }, [album, isFavoriteState, addToFavorites, removeFromFavorites]);

  const handlePlaySong = useCallback((song: Song) => {
    setCurrentSong(song);
  }, [setCurrentSong]);

  const handleSongClick = useCallback((songId: number) => {
    history.push(`/song/${songId}`);
  }, [history]);

  if (!album) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/search" icon={arrowBack} text="" />
            </IonButtons>
            <IonTitle>Cargando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Cargando detalles del álbum...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/search" icon={arrowBack} text="" />
          </IonButtons>
          <IonTitle>Detalles del Álbum</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <img src={album.coverUrl} alt={album.title} style={{ width: '100%', height: 'auto' }} />
          <IonCardHeader>
            <IonCardTitle>{album.title}</IonCardTitle>
            <IonCardSubtitle>{album.artist}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Lanzamiento: {album.release}</p>
          </IonCardContent>
        </IonCard>
        {isLoggedIn && (
          <div className="ion-padding">
            <IonButton expand="block" onClick={handleFavoriteClick} color={isFavoriteState ? 'danger' : 'medium'}>
              <IonIcon slot="start" icon={isFavoriteState ? heart : heartOutline} />
              {isFavoriteState ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </IonButton>
          </div>
        )}
        <IonList>
          <IonItem>
            <IonLabel>Canciones del Álbum</IonLabel>
          </IonItem>
          {songs.map((song) => (
            <IonItem key={song.id} onClick={() => handleSongClick(song.id)} button>
              <IonLabel>{song.title}</IonLabel>
              <IonButton slot="end" fill="clear" onClick={(e) => {
                e.stopPropagation();
                handlePlaySong(song);
              }}>
                <IonIcon icon={playCircle} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AlbumDetails;