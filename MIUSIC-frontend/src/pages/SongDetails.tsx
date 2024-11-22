import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel, IonButtons, IonBackButton} from '@ionic/react';
import { playCircle, heart, heartOutline, arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';

interface SongDetailsParams {
  id: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  album: string;
  year: string;
  genre: string;
  duration: string;
  type: 'song';
}

const SongDetails: React.FC = () => {
  const { id } = useParams<SongDetailsParams>();
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { setCurrentSong } = usePlayer();
  const history = useHistory();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/songs/${id}`);
        if (!response.ok) {
          throw new Error('Error al extraer detalles de la canción');
        }
        const data = await response.json();
        setSong({ ...data, type: 'song' });
        setIsFavoriteState(isFavorite(data.id, 'song'));
      } catch (error) {
        console.error('Error al encontrar detalles de la canción: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [id, isFavorite]);

  const handleFavoriteClick = useCallback(() => {
    if (song) {
      if (isFavoriteState) {
        removeFromFavorites(song.id, 'song');
      } else {
        addToFavorites(song);
      }
      setIsFavoriteState(!isFavoriteState);
    }
  }, [song, isFavoriteState, addToFavorites, removeFromFavorites]);

  const handlePlayClick = useCallback(() => {
    if (song) {
      setCurrentSong(song);
    }
  }, [song, setCurrentSong]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBack} text="" />
            </IonButtons>
            <IonTitle>Cargando...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Cargando detalles de la canción...</p>
        </IonContent>
      </IonPage>
    );
  }

  if (!song) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBack} text="" />
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>No se pudo cargar los detalles de la canción.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" icon={arrowBack} text="" />
          </IonButtons>
          <IonTitle>Detalles de la Canción</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <img src={song.coverUrl} alt={song.title} style={{ width: '100%', height: 'auto' }} />
          <IonCardHeader>
            <IonCardTitle>{song.title}</IonCardTitle>
            <IonCardSubtitle>{song.artist}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>Álbum: {song.album || 'No disponible'}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Año: {song.year || 'No disponible'}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Género: {song.genre || 'No disponible'}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Duración: {song.duration || 'No disponible'}</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <div className="ion-padding">
          <IonButton expand="block" onClick={handlePlayClick}>
            <IonIcon slot="start" icon={playCircle} />
            Reproducir
          </IonButton>
          {isLoggedIn && (
            <IonButton expand="block" onClick={handleFavoriteClick} color={isFavoriteState ? 'danger' : 'medium'}>
              <IonIcon slot="start" icon={isFavoriteState ? heart : heartOutline} />
              {isFavoriteState ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SongDetails;