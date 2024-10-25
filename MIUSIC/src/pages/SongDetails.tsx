import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonItem, IonLabel, IonButtons, IonBackButton } from '@ionic/react';
import { playCircle, heart, heartOutline, arrowBack } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';
import recommendedSongsData from '../data/recommendedSongs.json';

interface SongDetailsParams {
  id: string;
}

const SongDetails: React.FC = () => {
  const { id } = useParams<SongDetailsParams>();
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { setCurrentSong } = usePlayer();
  const history = useHistory();

  const song = recommendedSongsData.find(song => song.id === id);

  if (!song) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" icon={arrowBack} text="" />
            </IonButtons>
            <IonTitle>Canción no encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Lo sentimos, no se pudo encontrar la canción solicitada.</p>
        </IonContent>
      </IonPage>
    );
  }

  const handleFavoriteClick = () => {
    if (isFavorite(song.id)) {
      removeFromFavorites(song.id);
    } else {
      addToFavorites({
        id: song.id,
        title: song.title,
        artist: song.artist,
        coverUrl: song.coverUrl,
        type: 'song'
      });
    }
  };

  const handlePlayClick = () => {
    setCurrentSong(song);
  };

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
                <IonLabel>Álbum: {song.album}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Año: {song.year}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Género: {song.genre}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Duración: {song.duration}</IonLabel>
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
            <IonButton expand="block" onClick={handleFavoriteClick} color={isFavorite(song.id) ? 'danger' : 'medium'}>
              <IonIcon slot="start" icon={isFavorite(song.id) ? heart : heartOutline} />
              {isFavorite(song.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SongDetails;