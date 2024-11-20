import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, IonButton } from '@ionic/react';
import { musicalNotes, person, disc, musicalNotesOutline, play } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

interface SearchResult {
  id: number;
  title: string;
  artist?: string;
  coverUrl?: string;
  audioUrl?: string;
  type: 'song' | 'artist' | 'album';
}

const typeTranslations: { [key: string]: string } = {
  song: "Canción",
  artist: "Artista",
  album: "Álbum",
};

const Search: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { setCurrentSong } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: 'all', title: 'Todo', icon: musicalNotesOutline },
    { value: 'song', title: 'Canciones', icon: musicalNotes },
    { value: 'artist', title: 'Artistas', icon: person },
    { value: 'album', title: 'Álbumes', icon: disc },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query, activeCategory);
    } else {
      setSearchResults([]);
    }

    return () => setSearchTerm('');
  }, [location, activeCategory]);

  const performSearch = async (query: string, category: string = 'all') => {
    setIsLoading(true);
    try {
      setSearchResults([]);
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}&category=${category}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error al realizar la busqueda: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: CustomEvent) => {
    const query = event.detail.value as string;
    setSearchTerm(query);
    if (query) {
      history.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query, activeCategory);
    } else {
      setSearchResults([]);
      history.push('/search');
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchResults([]);
    if (searchTerm) {
      performSearch(searchTerm, category);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, item: SearchResult) => {
    e.stopPropagation();
    if (item.type === 'song' && item.audioUrl) {
      setCurrentSong({
        id: item.id,
        title: item.title,
        artist: item.artist || '',
        coverUrl: item.coverUrl || '',
        audioUrl: item.audioUrl,
        type: item.type
      });
    }
  };

  const handleItemClick = (item: SearchResult) => {
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Buscar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={searchTerm}
          onIonChange={handleSearch}
          placeholder={`Buscar ${
            activeCategory === 'all' ? 'todo' : categories.find((c) => c.value === activeCategory)?.title.toLowerCase()
          }`}
        />

        <IonSegment
          value={activeCategory}
          onIonChange={(e) => handleCategoryChange(e.detail.value as string)}
          scrollable
        >
          {categories.map((category) => (
            <IonSegmentButton key={category.value} value={category.value}>
              <IonIcon icon={category.icon} />
              <IonLabel>{category.title}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Cargando resultados...</p>
          </div>
        ) : searchResults.length === 0 && searchTerm ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No se encontraron resultados para "<strong>{searchTerm}</strong>".</p>
            <p>Intenta buscar otra cosa.</p>
          </div>
        ) : (
          <IonList>
            {searchResults.map((item, index) => (
              <IonItem key={`${item.type}-${item.id}-${index}`} button onClick={() => handleItemClick(item)}>
                <IonThumbnail slot="start">
                  <img src={item.coverUrl || '/placeholder.png'} alt={item.title} />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.title}</h2>
                  {item.artist && <p>{item.artist}</p>}
                  <p>{typeTranslations[item.type] || item.type}</p>
                </IonLabel>
                {item.type === 'song' && (
                  <IonButton slot="end" fill="clear" onClick={(e) => handlePlayClick(e, item)}>
                    <IonIcon icon={play} />
                  </IonButton>
                )}
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Search;