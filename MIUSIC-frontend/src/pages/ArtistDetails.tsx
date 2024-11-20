import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/react';
import { playCircle, heart, heartOutline, arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';

interface ArtistDetailsParams {
  id: string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
}

const ArtistDetails: React.FC = () => {
  const { id } = useParams<ArtistDetailsParams>();
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { setCurrentSong } = usePlayer();
  const history = useHistory();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/artists/${id}`);
        const data = await response.json();
        setArtist(data);
        setIsFavoriteState(isFavorite(data.id, 'artist'));
      } catch (error) {
        console.error('Error al extraer detalles del Artista: ', error);
      }
    };

    const fetchArtistSongs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/artists/${id}/songs`);
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error al extraer canciones del Artista: ', error);
      }
    };

    fetchArtistDetails();
    fetchArtistSongs();
  }, [id, isFavorite]);

  const handleFavoriteClick = useCallback(() => {
    if (artist) {
      if (isFavoriteState) {
        removeFromFavorites(artist.id, 'artist');
      } else {
        addToFavorites({
          id: artist.id,
          title: artist.name,
          coverUrl: artist.imageUrl,
          type: 'artist'
        });
      }
      setIsFavoriteState(!isFavoriteState);
    }
  }, [artist, isFavoriteState, addToFavorites, removeFromFavorites]);

  const handlePlaySong = useCallback((song: Song) => {
    setCurrentSong(song);
  }, [setCurrentSong]);

  const handleSongClick = useCallback((songId: number) => {
    history.push(`/song/${songId}`);
  }, [history]);

  if (!artist) {
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
          <p>Cargando detalles del artista...</p>
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
          <IonTitle>Detalles del Artista</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <img src={artist.imageUrl} alt={artist.name} style={{ width: '100%', height: 'auto' }} />
          <IonCardHeader>
            <IonCardTitle>{artist.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{artist.description}</p>
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
            <IonLabel>Canciones del Artista</IonLabel>
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

export default ArtistDetails;