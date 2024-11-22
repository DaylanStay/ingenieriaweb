import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline, play } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useHistory } from 'react-router-dom';
import Carousel from '../components/Carousel';
import '../theme/Home.css'

interface Song {
  id: number;
  title: string;
  coverUrl: string;
  audioUrl: string;
  type: 'song';
  artist: string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  type: 'artist';
}

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite, fetchFavorites } = useFavorites();
  const { setCurrentSong, togglePlayPause } = usePlayer();
  const history = useHistory();
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>([]);
  const [recommendedArtists, setRecommendedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recommended-songs');
        const data = await response.json();
        setRecommendedSongs(data.map((song: Song) => ({ ...song, type: 'song' })).slice(0, 10));
      } catch (error) {
        console.error('Error al extraer canciones recomendadas: ', error);
      }
    };

    const fetchRecommendedArtists = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recommended-artists');
        const data = await response.json();
        setRecommendedArtists(data.map((artist: Artist) => ({ ...artist, type: 'artist' })).slice(0, 10));
      } catch (error) {
        console.error('Error al extraer artistas recomendados: ', error);
      }
    };

    fetchRecommendedSongs();
    fetchRecommendedArtists();
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn, fetchFavorites]);

  const handleSearch = (event: CustomEvent) => {
    const searchTerm = event.detail.value;
    if (searchTerm) {
      history.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleFavoriteClick = async (event: React.MouseEvent, item: Song | Artist) => {
    event.stopPropagation();
    if (isFavorite(item.id, item.type)) {
      await removeFromFavorites(item.id, item.type);
    } else {
      const favoriteItem = item.type === 'song'
        ? {
            id: item.id,
            title: item.title,
            artist: item.artist,
            coverUrl: item.coverUrl,
            type: item.type
          }
        : {
            id: item.id,
            title: item.name,
            description: item.description,
            imageUrl: item.imageUrl,
            coverUrl: item.imageUrl,
            type: item.type
          };
      await addToFavorites(favoriteItem);
    }
  };

  const handleItemClick = (item: Song | Artist) => {
    if (item.type === 'song') {
      history.push(`/song/${item.id}`);
    } else if (item.type === 'artist') {
      history.push(`/artist/${item.id}`);
    }
  };

  const handlePlayClick = (event: React.MouseEvent, song: Song) => {
    event.stopPropagation();
    if (song.type === 'song' && song.audioUrl) {
      setCurrentSong({
        id: song.id,
        title: song.title,
        artist: song.artist || '',
        coverUrl: song.coverUrl || '',
        audioUrl: song.audioUrl,
        type: 'song'
      });
      togglePlayPause(true);
    }
  };

  const renderSong = (song: Song) => (
    <IonCard className="home-card" onClick={() => handleItemClick(song)}>
      <div className="home-card-image-container">
        <img src={song.coverUrl} alt={song.title} className="home-card-image" />
        {isLoggedIn && (
          <IonButton 
            fill="clear" 
            onClick={(e) => handleFavoriteClick(e, song)}
            className="home-favorite-button"
          >
            <IonIcon 
              icon={isFavorite(song.id, song.type) ? heart : heartOutline} 
              color="danger" 
              className="home-favorite-icon"
            />
          </IonButton>
        )}
        <IonButton
          fill="clear"
          onClick={(e) => handlePlayClick(e, song)}
          className="home-play-button"
        >
          <IonIcon
            icon={play}
            color="primary"
            className="home-play-icon"
          />
        </IonButton>
      </div>
      <IonCardHeader>
        <IonCardTitle>{song.title}</IonCardTitle>
        <IonCardSubtitle>{song.artist}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );

  const renderArtist = (artist: Artist) => (
    <IonCard className="home-card" onClick={() => handleItemClick(artist)}>
      <div className="home-card-image-container">
        <img src={artist.imageUrl} alt={artist.name} className="home-card-image" />
        {isLoggedIn && (
          <IonButton 
            fill="clear" 
            onClick={(e) => handleFavoriteClick(e, artist)}
            className="home-favorite-button"
          >
            <IonIcon 
              icon={isFavorite(artist.id, artist.type) ? heart : heartOutline} 
              color="danger" 
              className="home-favorite-icon"
            />
          </IonButton>
        )}
      </div>
      <IonCardHeader>
        <IonCardTitle>{artist.name}</IonCardTitle>
        <IonCardSubtitle>{artist.description}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          placeholder="Buscar canciones, artistas o álbumes"
          onIonChange={handleSearch}
        />
        
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="ion-padding">
          <h2 className="home-section-title">Canciones Recomendadas</h2>
          <Carousel items={recommendedSongs} renderItem={renderSong} />

          <h2 className="home-section-title">Artistas Recomendados</h2>
          <Carousel items={recommendedArtists} renderItem={renderArtist} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;