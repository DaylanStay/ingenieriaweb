import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonList, IonItem, IonLabel, IonSearchbar } from '@ionic/react';

const CreatePlaylist: React.FC = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistPrivacy, setPlaylistPrivacy] = useState('public');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreatePlaylist = () => {
    console.log('Creating playlist:', { playlistName, playlistDescription, playlistPrivacy });
    // Aquí se implementará la lógica de crear una playlist
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Nombre de la playlist</IonLabel>
            <IonInput value={playlistName} onIonChange={e => setPlaylistName(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Descripción</IonLabel>
            <IonTextarea value={playlistDescription} onIonChange={e => setPlaylistDescription(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel>Privacidad</IonLabel>
            <IonSelect value={playlistPrivacy} onIonChange={e => setPlaylistPrivacy(e.detail.value)}>
              <IonSelectOption value="public">Pública</IonSelectOption>
              <IonSelectOption value="private">Privada</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={handleCreatePlaylist}>Crear Playlist</IonButton>

        <IonSearchbar value={searchTerm} onIonChange={e => setSearchTerm(e.detail.value!)} placeholder="Buscar canciones para añadir" />
        
        {/* Aquí se añadirá una lista de búsquedas */}
      </IonContent>
    </IonPage>
  );
};

export default CreatePlaylist;