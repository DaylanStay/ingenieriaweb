import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface FavoriteItem {
  id: number;
  title: string;
  artist?: string;
  coverUrl?: string;
  imageUrl?: string;
  description?: string;
  type: 'song' | 'artist' | 'album';
}

interface FavoritesContextType {
  favorites: {
    songs: FavoriteItem[];
    artists: FavoriteItem[];
    albums: FavoriteItem[];
  };
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (itemId: number, itemType: string) => Promise<void>;
  isFavorite: (itemId: number, itemType: string) => boolean;
  fetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<{
    songs: FavoriteItem[];
    artists: FavoriteItem[];
    albums: FavoriteItem[];
  }>({ songs: [], artists: [], albums: [] });
  const { user, isLoggedIn } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (isLoggedIn && user) {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error encontrando favoritos: ', error);
      }
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addToFavorites = useCallback(async (item: FavoriteItem) => {
    if (isLoggedIn && user) {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${item.type}s`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ user_id: user.id, [`${item.type}_id`]: item.id })
        });
        if (response.ok) {
          setFavorites(prev => ({
            ...prev,
            [item.type + 's']: [...prev[item.type + 's' as keyof typeof prev], item]
          }));
        }
      } catch (error) {
        console.error('Error añadiendo un favorito: ', error);
      }
    }
  }, [isLoggedIn, user]);

  const removeFromFavorites = useCallback(async (itemId: number, itemType: string) => {
    if (isLoggedIn && user) {
      try {
        const response = await fetch(`http://localhost:5000/api/favorites/${itemType}s`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ user_id: user.id, [`${itemType}_id`]: itemId })
        });
        if (response.ok) {
          setFavorites(prev => ({
            ...prev,
            [itemType + 's']: prev[itemType + 's' as keyof typeof prev].filter(item => item.id !== itemId)
          }));
        }
      } catch (error) {
        console.error('Error al eliminar un favorito: ', error);
      }
    }
  }, [isLoggedIn, user]);

  const isFavorite = useCallback((itemId: number, itemType: string) => {
    return favorites[itemType + 's' as keyof typeof favorites].some(item => item.id === itemId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('Error de FavoritesContext');
  }
  return context;
};