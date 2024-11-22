import React, { useEffect, useState, useCallback } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline, trash, play } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { usePlayer } from '../contexts/PlayerContext';
import { useHistory } from 'react-router-dom';
import Carousel from '../components/Carousel';

interface FavoriteItem {
  id: number;
  title: string;
  artist?: string;
  coverUrl?: string;
  imageUrl?: string;
  description?: string;
  type: 'song' | 'artist' | 'album';
  audioUrl?: string;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  privacy: string;
}

const Library: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite, fetchFavorites } = useFavorites();
  const { setCurrentSong, togglePlayPause } = usePlayer();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const history = useHistory();

  const fetchPlaylists = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/playlists`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data);
      }
    } catch (error) {
      console.error('Error encontrando playlists: ', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
      fetchPlaylists();
    }
  }, [isLoggedIn, fetchFavorites, fetchPlaylists]);

  const handleFavoriteClick = async (event: React.MouseEvent, item: FavoriteItem) => {
    event.stopPropagation();
    if (isFavorite(item.id, item.type)) {
      await removeFromFavorites(item.id, item.type);
    } else {
      await addToFavorites(item);
    }
  };

  const handleItemClick = (item: FavoriteItem) => {
    switch (item.type) {
      case 'song':
        history.push(`/song/${item.id}`);
        break;
      case 'artist':
        history.push(`/artist/${item.id}`);
        break;
      case 'album':
        history.push(`/album/${item.id}`);
        break;
    }
  };

  const handlePlayClick = (event: React.MouseEvent, song: FavoriteItem) => {
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

  const handlePlaylistClick = (playlistId: number) => {
    history.push(`/playlist/${playlistId}`);
  };

  const handleDeletePlaylist = async (playlistId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Error al eliminar playlist: ', error);
    }
  };

  const renderItem = (item: FavoriteItem) => (
    <IonCard className="library-card" onClick={() => handleItemClick(item)}>
      <div className="library-card-image-container">
        <img src={item.coverUrl || item.imageUrl} alt={item.title} className="library-card-image" />
        <IonButton 
          fill="clear" 
          className="library-favorite-button"
          onClick={(e) => handleFavoriteClick(e, item)}
        >
          <IonIcon 
            icon={isFavorite(item.id, item.type) ? heart : heartOutline} 
            color="danger" 
            className="library-favorite-icon"
          />
        </IonButton>
        {item.type === 'song' && (
          <IonButton
            fill="clear"
            onClick={(e) => handlePlayClick(e, item)}
            className="library-play-button"
          >
            <IonIcon
              icon={play}
              color="primary"
              className="library-play-icon"
            />
          </IonButton>
        )}
      </div>
      <IonCardHeader>
        <IonCardTitle>{item.title}</IonCardTitle>
        {item.artist && <IonCardSubtitle>{item.artist}</IonCardSubtitle>}
      </IonCardHeader>
    </IonCard>
  );

  const renderPlaylist = (playlist: Playlist) => (
    <IonCard className="library-card" onClick={() => handlePlaylistClick(playlist.id)}>
      <IonCardHeader>
        <IonCardTitle>{playlist.name}</IonCardTitle>
        <IonCardSubtitle>{playlist.description}</IonCardSubtitle>
      </IonCardHeader>
      <IonButton 
        fill="clear" 
        className="library-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePlaylist(playlist.id);
        }}
      >
        <IonIcon icon={trash} color="danger" />
      </IonButton>
    </IonCard>
  );

  const renderSection = (title: string, items: FavoriteItem[], type: string) => (
    <>
      <h2 className="library-section-title">{title}</h2>
      {items.length === 0 ? (
        <p>Aún no tienes {type} favoritos.</p>
      ) : (
        <Carousel items={items} renderItem={renderItem} />
      )}
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tu Biblioteca</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          {renderSection('Tus Canciones Favoritas', favorites.songs, 'canciones')}
          {renderSection('Tus Artistas Favoritos', favorites.artists, 'artistas')}
          {renderSection('Tus Álbumes Favoritos', favorites.albums, 'álbumes')}
          
          <h2 className="library-section-title">Tus Playlists</h2>
          {playlists.length === 0 ? (
            <p>Aún no tienes playlists.</p>
          ) : (
            <Carousel items={playlists} renderItem={renderPlaylist} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Library;