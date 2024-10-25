import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import CreatePlaylist from './pages/CreatePlaylist';
import Auth from './pages/Auth';
import SongDetails from './pages/SongDetails';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { PlayerProvider } from './contexts/PlayerContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <IonReactRouter>
            <Layout>
              <Route exact path="/home" component={Home} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/library" component={Library} />
              <Route exact path="/create-playlist" component={CreatePlaylist} />
              <Route exact path="/auth" component={Auth} />
              <Route exact path="/song/:id" component={SongDetails} />
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route>
                <Redirect to="/home" />
              </Route>
            </Layout>
          </IonReactRouter>
        </PlayerProvider>
      </FavoritesProvider>
    </AuthProvider>
  </IonApp>
);

export default App;