import React, { useState } from "react";
import { RouteComponentProps, withRouter, useLocation } from "react-router";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToggle,
  IonAlert,
} from "@ionic/react";
import {
  book,  //ventas
  fastFoodOutline,  //pedidos
  person,
  logOut as out,
  logIn,
  moonOutline,
} from "ionicons/icons";

import { connect } from "../data/connect";
import { setDarkMode, setIsLoggedIn, logOut } from "../data/user/user.actions";

import "./Menu.css";

const routes = {
  appPages: [
    { title: "Atender", path: "/", icon: fastFoodOutline, logout: false },
    { title: "Ventas", path: "/ventas", icon: book, logout: false },
    { title: 'Account', path: '/account', icon: person, logout: false },
  ],
  loggedInPages: [
    { title: "Cerrar sesión", path: "/logout", icon: out, logout: true },
    
  ],
  loggedOutPages: [{ title: "Iniciar sesión", path: "/", icon: logIn, logout: false }],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
  logout: boolean
}

interface StateProps {
  darkMode: boolean;
  isAuthenticated: boolean;
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode;
  setIsLoggedIn: typeof setIsLoggedIn;
  logOut: typeof logOut
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps { }

const Menu: React.FC<MenuProps> = ({
  darkMode,
  history,
  isAuthenticated,
  setDarkMode,
  setIsLoggedIn,
  logOut
}) => {
  const location = useLocation();

  const [showAlertLogout, setShowAlertLogOut] = useState(false);


  function renderlistItems(list: Pages[]) {

    return list
      .filter((route) => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide="false">
          {p.logout ?
            (<IonItem
              detail={false}
              onClick={() => setShowAlertLogOut(true)}
              className={
                location.pathname.startsWith(p.path) ? "selected" : "ion-item-pointer"
              }
            >
              <IonIcon slot="start" icon={p.icon} />
              <IonLabel>{p.title}</IonLabel>
            </IonItem>) :

            (<IonItem
              detail={false}
              routerLink={p.path}
              className={
                location.pathname.endsWith(p.path) ? "selected" : undefined
              }
            >
              <IonIcon slot="start" icon={p.icon} />
              <IonLabel>{p.title}</IonLabel>
            </IonItem>)
          }
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu type="overlay" contentId="main">
      <IonContent forceOverscroll={false}>
        <IonAlert
          isOpen={showAlertLogout}
          onDidDismiss={() => setShowAlertLogOut(false)}
          header={'Cerrar sesión'}
          message={'¿Seguro que desea cerrar sesión?'}
          buttons={[{
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Aceptar',
            cssClass: 'ion-alert-accept-button',
            handler: async () => {
              await logOut();
              history.push('/');
            }
          }]}
        />
        {isAuthenticated ? (
          <IonList lines="none">
            <IonListHeader>Menú</IonListHeader>
            {renderlistItems(routes.appPages)}
          </IonList>
        ) : null}
        <IonList lines="none">
          <IonListHeader>Cuenta</IonListHeader>
          {isAuthenticated
            ? renderlistItems(routes.loggedInPages)
            : renderlistItems(routes.loggedOutPages)}
          <IonItem>
            <IonIcon slot="start" icon={moonOutline}></IonIcon>
            <IonLabel>Dark Mode </IonLabel>
            <IonToggle
              checked={darkMode}
              onClick={() => setDarkMode(!darkMode)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
  }),
  mapDispatchToProps: {
    setDarkMode,
    setIsLoggedIn,
    logOut
  },
  component: withRouter(Menu),
});
