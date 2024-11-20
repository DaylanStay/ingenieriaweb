import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonList, IonItem, IonLabel, IonSearchbar, IonIcon, IonToast } from '@ionic/react';
import { add, close } from 'ionicons/icons';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

interface Song {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  type: 'song';
}

export default function Component() {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistPrivacy, setPlaylistPrivacy] = useState('public');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const { favorites, fetchFavorites } = useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState<Song[]>([]);
  const { user } = useAuth();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    const favoriteSongs = favorites.songs.filter((song): song is Song => song.type === 'song');
    setFilteredFavorites(
      favoriteSongs.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [favorites, searchTerm]);

  const handleCreatePlaylist = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          privacy: playlistPrivacy,
          userId: user?.id,
          songs: selectedSongs.map(song => song.id)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setToastMessage('Playlist creada correctamente');
        setShowToast(true);
        history.push(`/playlist/${data.id}`);
      } else {
        throw new Error('Error al crear la playlist');
      }
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error al crear la playlist');
      setShowToast(true);
    }
  };

  const addSongToPlaylist = (song: Song) => {
    if (!selectedSongs.some(s => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const removeSongFromPlaylist = (songId: number) => {
    setSelectedSongs(selectedSongs.filter(song => song.id !== songId));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="create-playlist-content">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Nombre de la playlist</IonLabel>
            <IonInput value={playlistName} onIonChange={e => setPlaylistName(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea value={playlistDescription} onIonChange={e => setPlaylistDescription(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Privacidad</IonLabel>
            <IonSelect value={playlistPrivacy} onIonChange={e => setPlaylistPrivacy(e.detail.value)}>
              <IonSelectOption value="public">Pública</IonSelectOption>
              <IonSelectOption value="private">Privada</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <IonSearchbar value={searchTerm} onIonChange={e => setSearchTerm(e.detail.value!)} placeholder="Buscar canciones favoritas" />
        
        <IonList>
          {filteredFavorites.map(song => (
            <IonItem key={song.id}>
              <IonLabel>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
              </IonLabel>
              <IonButton slot="end" fill="clear" onClick={() => addSongToPlaylist(song)}>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonList>
          <IonItem>
            <IonLabel>Canciones seleccionadas</IonLabel>
          </IonItem>
          {selectedSongs.map(song => (
            <IonItem key={song.id}>
              <IonLabel>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
              </IonLabel>
              <IonButton slot="end" fill="clear" color="danger" onClick={() => removeSongFromPlaylist(song.id)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="block" onClick={handleCreatePlaylist}>Crear Playlist</IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
}