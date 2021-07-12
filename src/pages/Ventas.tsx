import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "../data/connect";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonToast,
  IonList,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { Venta } from "../models/Venta";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { base_url } from "../util/constants";
import moment from "moment";
import axios from "axios";
import NoData from "../components/DataCenter";
import VentaItem from "../components/VentasComponents/VentaItem";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {}

interface StateProps {
  accessToken?: string;
  tokenType?: string;
  id?: number;
}

interface VentasProps extends OwnProps, StateProps, DispatchProps {}

const Ventas: React.FC<VentasProps> = ({ accessToken, tokenType, id }) => {
  const [showCompleteToast, setCompleteToast] = useState<boolean>(false);
  const [messageToast, setMessageToast] = useState<string>("");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [urlVentas] = useState(base_url + "/ventas");
  const [networkStatusToast, setNetworkStatusToast] = useState<boolean>(false);
  const [messageData, setMessageData] = useState<string>(
    "No hay datos por mostrar."
  );
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null)
  const [showMessageNetworkStatus, setShowMessageNetworkStatus] =
    useState<boolean>(false);
  const isMountedRef = useRef<boolean>(false);

  const loadVentas = async () => {
    moment.locale("es-MX", {
      meridiem: function (hour, minute, isLowercase) {
        if (hour < 12) {
          return "a.m";
        } else {
          return "p.m";
        }
      },
    });

    const clearVentas: Venta[] = [];
    if (isMountedRef.current) {
      setVentas(clearVentas);
    }

    await axios
      .get(urlVentas, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      })
      .then((response) => {
        const vents: any[] = response.data;
        const tmpVentasArray: Venta[] = [];
        vents.map(function (v) {
          const tmpVenta: Venta = {
            id: v.id,
            fechaHora: moment(v.FechaHoraVenta).format(
              "dddd, MMMM Do YYYY, h:mm:ss a"
            ),
            total: v.Total,
          };
          tmpVentasArray.push(tmpVenta);
        });
        if (isMountedRef.current) {
          setVentas(tmpVentasArray);
        }
        setCompleteToast(true);
        setMessageToast("Carga de ventas completa!");
      })
      .catch((errors) => {
        console.debug(errors);
      });
  };

  const doRefresh = () => {
    loadVentas();
    setTimeout(() => {
        ionRefresherRef.current!.complete();
        setCompleteToast(true);
    }, 2500)
}


  useEffect(() => {
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

  useEffect(() => {
    isMountedRef.current = true;
    loadVentas();
    return () => {
      isMountedRef.current = false;
    };
  }, [id, accessToken, tokenType]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Ventas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonRefresher ref={ionRefresherRef} pullMax={0}
                    slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent
                    ></IonRefresherContent>
                </IonRefresher>
        <IonToast
          cssClass={"text-center"}
          isOpen={networkStatusToast}
          message="No hay conexión a internet."
          duration={2000}
          onDidDismiss={() => setNetworkStatusToast(false)}
        />
        <IonToast
          cssClass={"text-center"}
          isOpen={showCompleteToast}
          message={messageToast}
          duration={2000}
          onDidDismiss={() => setCompleteToast(false)}
        />
        <IonCard>
          <IonCardContent>
            <IonList>
              {ventas.map((v, i) => {
                return <VentaItem key={i} venta={v} index={i} />;
              })}
            </IonList>
          </IonCardContent>
        </IonCard>

        {ventas.length === 0 && <NoData data={messageData} />}
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    accessToken: state.user.accessToken,
    tokenType: state.user.tokenType,
    id: state.user.id,
  }),
  mapDispatchToProps: {},
  component: Ventas,
});
