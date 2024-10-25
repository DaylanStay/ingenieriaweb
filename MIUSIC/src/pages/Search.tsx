import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/react';
import { musicalNotes, person, disc, list, mic, musicalNotesOutline } from 'ionicons/icons';

const Search: React.FC = () => {
  const categories = [
    { title: 'Canciones', icon: musicalNotes },
    { title: 'Artistas', icon: person },
    { title: 'Álbumes', icon: disc },
    { title: 'Playlists', icon: list },
    { title: 'Podcasts', icon: mic },
    { title: 'Géneros', icon: musicalNotesOutline },
  ];

  const recentSearches = [
    'Búsqueda reciente 1',
    'Búsqueda reciente 2',
    'Búsqueda reciente 3',
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar placeholder="Buscar canciones, artistas o álbumes" />
        
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2>Buscar por categoría</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            {categories.map((category, index) => (
              <IonCol size="6" size-md="4" key={index}>
                <IonCard className="category-item">
                  <IonCardHeader>
                    <IonIcon icon={category.icon} size="large" />
                    <IonCardTitle>{category.title}</IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol>
              <h2>Búsquedas recientes</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            {recentSearches.map((search, index) => (
              <IonCol size="12" key={index}>
                <IonCard className="recent-search-item">
                  <IonCardHeader>
                    <IonIcon icon={musicalNotes} />
                    <IonCardTitle>{search}</IonCardTitle>
                  </IonCardHeader>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Search;