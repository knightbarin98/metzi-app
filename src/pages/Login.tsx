import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonCardHeader,
  IonLabel,
  IonTitle,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState, useRef } from "react";
import { RouteComponentProps } from "react-router";
import { storageSet } from "../util/storage";
import "./Login.css";
import axios from "axios";
import {
  setIsLoggedIn,
  setAccessToken,
  setTokenType,
  setId,
  setData,
  logOut,
} from "../data/user/user.actions";
import { connect } from "../data/connect";
import { base_url } from "../util/constants";
import { showError } from "../util/function";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import DataCenter from "../components/DataCenter";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setAccessToken: typeof setAccessToken;
  setTokenType: typeof setTokenType;
  setId: typeof setId;
  setData: typeof setData;
  logOut: typeof logOut;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({
  history,
  setIsLoggedIn,
  setId,
  setAccessToken,
  setTokenType,
  setData,
  logOut,
}) => {
  const ionInputEmailRef = useRef<HTMLIonInputElement>(null);
  const [email, setEmailState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [urlLogin] = useState(base_url + "/auth/local");
  const [{ errors }, setErrors] = useState({ errors: [] });
  const [networkStatusToast, setNetworkStatusToast] = useState<boolean>(false);
  const [showMessageNetworkStatus, setShowMessageNetworkStatus] =
    useState<boolean>(false);

  const clearAll = async () => {
    await logOut();
  };

  useEffect(() => {
    let node = ionInputEmailRef.current!;
    node.focus();
    Network.addListener("networkStatusChange", (state: any) => {
      let status = state.connected;
      setNetworkStatusToast(!status);
      setShowMessageNetworkStatus(!status);
    });

    if (Capacitor.isNative) {
      App.addListener("backButton", (e: any) => {
        if (window.location.pathname === "/") {
          App.exitApp();
        }
      });
    }
  }, []);

  const login = async () => {
    setLoading(true);
    axios
      .post(urlLogin, { identifier: email, password: password })
      .then((response) => {
        setLoading(false);
        storageSet("access_token", response.data.jwt);
        storageSet("token_type", "Bearer");
        storageSet("isLoggedIn", "true");
        storageSet("id", response.data.user.id);

        const data = {
          username: response.data.user.username,
          email: response.data.user.email,
        };

        storageSet("data", data);

        setData(data);
        setId(+response.data.id);
        setAccessToken(response.data.access_token);
        setTokenType(response.data.token_type);
        setIsLoggedIn(true);
        history.push("/");
      })
      .catch((errors) => {
        console.log(errors);
        setLoading(false);
        setErrors({ errors: errors.response.data.errors });
      });
  };

  return (
    <IonPage>
      <IonContent>
        <IonToast
          cssClass={"text-center"}
          isOpen={networkStatusToast}
          message="No hay conexión a internet."
          duration={2000}
          onDidDismiss={() => setNetworkStatusToast(false)}
        />
        <IonCard className="ion-padding">
          <IonCardHeader className="ion-text-center">
            <IonTitle>Inicio de sesión</IonTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Correo electrónico</IonLabel>
              <IonInput
                ref={ionInputEmailRef}
                value={email}
                autofocus={true}
                onIonChange={(e) => setEmailState(e.detail.value!)}
              />
            </IonItem>
            {showError(errors, "email")}
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
            {showError(errors, "password")}
            <IonButton
              onClick={login}
              disabled={loading}
              className="ion-margin-top"
              expand="block"
              color="primary"
              slot="end"
              ion-text-center
            >
              {loading ? <IonSpinner name="bubbles" /> : ""} Iniciar sesión
            </IonButton>
          </IonCardContent>
        </IonCard>

        {showMessageNetworkStatus && (
          <DataCenter data={"No hay conexion a internet."} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setData,
    setId,
    setAccessToken,
    setTokenType,
    logOut,
  },
  component: Login,
});
