import React, { useState, useEffect } from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonFooter, IonPage } from '@ionic/react';
import { home, search, library, addCircle, person, logOut } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MusicPlayer from './MusicPlayer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [navItems, setNavItems] = useState<Array<{ tab: string; href: string; icon: string; label: string }>>([]);

  useEffect(() => {
    const baseItems = [
      { tab: 'home', href: '/home', icon: home, label: 'Inicio' },
      { tab: 'search', href: '/search', icon: search, label: 'Buscar' },
    ];

    const loggedInItems = [
      { tab: 'library', href: '/library', icon: library, label: 'Tu Biblioteca' },
      { tab: 'create-playlist', href: '/create-playlist', icon: addCircle, label: 'Crear Playlist' },
    ];

    setNavItems(isLoggedIn ? [...baseItems, ...loggedInItems] : baseItems);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    history.push('/auth');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MIUSIC</IonTitle>
          <IonButtons slot="end">
            {isLoggedIn ? (
              <IonButton fill="clear" color="light" onClick={handleLogout}>
                <IonIcon icon={logOut} slot="start" />
                Cerrar sesión
              </IonButton>
            ) : (
              <IonButton 
                fill="clear" 
                color={location.pathname === '/auth' ? 'primary' : 'light'} 
                onClick={() => history.push('/auth')}
              >
                <IonIcon icon={person} slot="icon-only" />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonTabs>
          <IonRouterOutlet>
            {children}
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {navItems.map((item) => (
              <IonTabButton key={item.tab} tab={item.tab} href={item.href}>
                <IonIcon icon={item.icon} />
                <IonLabel>{item.label}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      </IonContent>
      <IonFooter>
        <MusicPlayer />
      </IonFooter>
    </IonPage>
  );
};

export default Layout;