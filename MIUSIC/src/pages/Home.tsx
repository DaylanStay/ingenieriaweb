import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline, play } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useHistory } from 'react-router-dom';
import recommendedSongsData from '../data/recommendedSongs.json';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: string;
}

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { setCurrentSong } = usePlayer();
  const history = useHistory();
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecommendedSongs(recommendedSongsData);
    };

    fetchRecommendedSongs();
  }, []);

  const featuredItems = [
    { id: 'p1', title: 'Playlist 1', coverUrl: 'https://via.placeholder.com/150', type: 'playlist' },
    { id: 'p2', title: 'Playlist 2', coverUrl: 'https://via.placeholder.com/150', type: 'playlist' },
    { id: 'p3', title: 'Playlist 3', coverUrl: 'https://via.placeholder.com/150', type: 'playlist' },
    { id: 'p4', title: 'Playlist 4', coverUrl: 'https://via.placeholder.com/150', type: 'playlist' },
  ];

  const recommendedArtists = [
    { id: 'ar1', name: 'Artista 1', coverUrl: 'https://via.placeholder.com/150', type: 'artist' },
    { id: 'ar2', name: 'Artista 2', coverUrl: 'https://via.placeholder.com/150', type: 'artist' },
    { id: 'ar3', name: 'Artista 3', coverUrl: 'https://via.placeholder.com/150', type: 'artist' },
    { id: 'ar4', name: 'Artista 4', coverUrl: 'https://via.placeholder.com/150', type: 'artist' },
  ];

  const handleFavoriteClick = (event: React.MouseEvent, item: any) => {
    event.stopPropagation();
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.type === 'song') {
      history.push(`/song/${item.id}`);
    }
  };

  const handlePlayClick = (event: React.MouseEvent, item: any) => {
    event.stopPropagation();
    if (item.type === 'song') {
      setCurrentSong(item);
    }
  };

  const renderItem = (item: any) => (
    <IonCol size="6" size-md="3" key={item.id}>
      <IonCard className="home-card" onClick={() => handleItemClick(item)}>
        <div className="home-card-image-container">
          <img src={item.coverUrl} alt={item.title || item.name} className="home-card-image" />
          {isLoggedIn && (
            <IonButton 
              fill="clear" 
              onClick={(e) => handleFavoriteClick(e, item)}
              className="home-favorite-button"
            >
              <IonIcon 
                icon={isFavorite(item.id) ? heart : heartOutline} 
                color="danger" 
                className="home-favorite-icon"
              />
            </IonButton>
          )}
          {item.type === 'song' && (
            <IonButton
              fill="clear"
              onClick={(e) => handlePlayClick(e, item)}
              className="home-play-button"
            >
              <IonIcon
                icon={play}
                color="primary"
                className="home-play-icon"
              />
            </IonButton>
          )}
        </div>
        <IonCardHeader>
          <IonCardTitle>{item.title || item.name}</IonCardTitle>
          {item.artist && <IonCardSubtitle>{item.artist}</IonCardSubtitle>}
        </IonCardHeader>
      </IonCard>
    </IonCol>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar placeholder="Buscar canciones, artistas o álbumes" />
        
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 className="home-section-title">Destacados</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            {featuredItems.map(renderItem)}
          </IonRow>
          <IonRow>
            <IonCol>
              <h2 className="home-section-title">Canciones Recomendadas</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            {recommendedSongs.map(renderItem)}
          </IonRow>
          <IonRow>
            <IonCol>
              <h2 className="home-section-title">Artistas Recomendados</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            {recommendedArtists.map(renderItem)}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;