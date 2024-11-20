import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonCheckbox, IonIcon, IonToast } from '@ionic/react';
import { logoGoogle, logoFacebook } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rut, setRut] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  const { login, register } = useAuth();

  const regiones = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'];
  const [comunas, setComunas] = useState<string[]>([]);

  useEffect(() => {
    if (region) {
      setComunas(['Comuna 1', 'Comuna 2', 'Comuna 3']);
    } else {
      setComunas([]);
    }
  }, [region]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMessage('Por favor, complete todos los campos.');
      setShowToast(true);
      return;
    }
    try {
      await login(email, password);
      history.push('/home');
    } catch (error) {
      setToastMessage('Error al iniciar sesión. Por favor, intente de nuevo.');
      setShowToast(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !rut || !email || !region || !comuna || !password || !confirmPassword || !acceptTerms) {
      setToastMessage('Por favor, complete todos los campos y acepte los términos y condiciones.');
      setShowToast(true);
      return;
    }
    if (password !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden.');
      setShowToast(true);
      return;
    }
    if (!validateRut(rut)) {
      setToastMessage('RUT inválido. Por favor, ingrese un RUT válido.');
      setShowToast(true);
      return;
    }
    try {
      await register({ username, rut, email, region, comuna, password });
      history.push('/home');
    } catch (error) {
      setToastMessage('Error al registrarse. Por favor, intente de nuevo.');
      setShowToast(true);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Iniciando sesión con ${provider}`);
    login(email, password);
    history.push('/home');
  };

  const validateRut = (rut: string) => {
    const rutRegex = /^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/;
    return rutRegex.test(rut);
  };

  return (
    <IonPage className="auth-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Autenticación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="auth-container">
          {showLogin ? (
            <div className="auth-form">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleLogin}>
                <IonList>
                  <IonItem lines="full">
                    <IonLabel position="floating">Correo electrónico</IonLabel>
                    <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Contraseña</IonLabel>
                    <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                </IonList>
                <IonButton expand="block" type="submit" color="primary">Iniciar Sesión</IonButton>
              </form>
              <div className="auth-separator">
                <span>o</span>
              </div>
              <IonButton expand="block" onClick={() => handleSocialLogin('Google')} color="danger">
                <IonIcon slot="start" icon={logoGoogle} />
                Iniciar sesión con Google
              </IonButton>
              <IonButton expand="block" onClick={() => handleSocialLogin('Facebook')} color="primary">
                <IonIcon slot="start" icon={logoFacebook} />
                Iniciar sesión con Facebook
              </IonButton>
              <div className="ion-text-center ion-padding-top">
                <IonLabel>¿No tienes una cuenta? <IonButton fill="clear" onClick={() => setShowLogin(false)}>Regístrate</IonButton></IonLabel>
              </div>
            </div>
          ) : (
            <div className="auth-form">
              <h2>Registro</h2>
              <form onSubmit={handleRegister}>
                <IonList>
                  <IonItem lines="full">
                    <IonLabel position="floating">Nombre de Usuario</IonLabel>
                    <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">RUT</IonLabel>
                    <IonInput value={rut} onIonChange={e => setRut(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Correo Electrónico</IonLabel>
                    <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Región</IonLabel>
                    <IonSelect value={region} onIonChange={e => setRegion(e.detail.value)} interface="popover" className="custom-select">
                      {regiones.map((reg, index) => (
                        <IonSelectOption key={index} value={reg}>{reg}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Comuna</IonLabel>
                    <IonSelect value={comuna} onIonChange={e => setComuna(e.detail.value)} disabled={!region} interface="popover" className="custom-select">
                      {comunas.map((com, index) => (
                        <IonSelectOption key={index} value={com}>{com}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Contraseña</IonLabel>
                    <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="full">
                    <IonLabel position="floating">Confirmación de Contraseña</IonLabel>
                    <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} required className="custom-input"/>
                  </IonItem>
                  <IonItem lines="none">
                    <IonCheckbox checked={acceptTerms} onIonChange={e => setAcceptTerms(e.detail.checked)} />
                    <IonLabel className="ion-padding-start">Acepto los términos y condiciones</IonLabel>
                  </IonItem>
                </IonList>
                <IonButton expand="block" type="submit" color="primary">Registrarse</IonButton>
              </form>
              <div className="ion-text-center ion-padding-top">
                <IonLabel>¿Ya tienes una cuenta? <IonButton fill="clear" onClick={() => setShowLogin(true)}>Inicia sesión</IonButton></IonLabel>
              </div>
            </div>
          )}
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Auth;