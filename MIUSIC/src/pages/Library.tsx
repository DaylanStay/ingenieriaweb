import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

const Library: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteClick = (item: any) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const renderItem = (item: any) => (
    <IonCol size="6" size-md="3" key={item.id}>
      <IonCard className="ion-no-margin">
        <div style={{ position: 'relative' }}>
          <img src={item.coverUrl} alt={item.title || item.name} style={{ width: '100%', height: 'auto' }} />
          <IonButton 
            fill="clear" 
            onClick={() => handleFavoriteClick(item)}>
            <IonIcon 
              icon={isFavorite(item.id) ? heart : heartOutline} 
              color="danger" />
          </IonButton>
        </div>
        <IonCardHeader>
          <IonCardTitle>{item.title || item.name}</IonCardTitle>
          {item.artist && <IonCardSubtitle>{item.artist}</IonCardSubtitle>}
        </IonCardHeader>
      </IonCard>
    </IonCol>
  );

  const renderSection = (title: string, items: any[], type: string) => (
    <>
      <IonRow>
        <IonCol>
          <h2>{title}</h2>
        </IonCol>
      </IonRow>
      <IonRow>
        {items.length === 0 ? (
          <IonCol>
            <p>Aún no tienes {type} favoritos.</p>
          </IonCol>
        ) : (
          items.map(renderItem)
        )}
      </IonRow>
    </>
  );

  if (!isLoggedIn) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Tu Biblioteca</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="ion-padding">
            <h2>Inicia sesión para ver tu biblioteca</h2>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const favoriteSongs = favorites.filter(item => item.type === 'song');
  const favoritePlaylists = favorites.filter(item => item.type === 'playlist');
  const favoriteAlbums = favorites.filter(item => item.type === 'album');
  const favoriteArtists = favorites.filter(item => item.type === 'artist');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tu Biblioteca</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          {renderSection('Tus Canciones Favoritas', favoriteSongs, 'canciones')}
          {renderSection('Tus Playlists Favoritas', favoritePlaylists, 'playlists')}
          {renderSection('Tus Álbumes Favoritos', favoriteAlbums, 'álbumes')}
          {renderSection('Tus Artistas Favoritos', favoriteArtists, 'artistas')}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Library;