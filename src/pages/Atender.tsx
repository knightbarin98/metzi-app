import React, { useState, useEffect, useRef } from "react";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonToast,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { connect } from "../data/connect";
import axios from "axios";
import "./Atender.scss";
import ComidasBebidas from "../components/AtenderComponents/ComidasBebidas";
import ParaLlevar from "../components/AtenderComponents/ParaLlevar";
import Mesa1 from "../components/AtenderComponents/Mesa1";
import { Categoria } from "../models/Categoria";
import { Producto } from "../models/Producto";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Network } from "@capacitor/network";
import { base_url } from "../util/constants";
import moment from "moment";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {}

interface StateProps {
  accessToken?: string;
  tokenType?: string;
  id?: number;
}

interface AtenderProps extends OwnProps, StateProps, DispatchProps {}

const Atender: React.FC<AtenderProps> = ({ accessToken, tokenType, id }) => {
  const [showCompleteToast, setCompleteToast] = useState<boolean>(false);
  const [messageToast, setMessageToast] = useState<string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [venta, setVenta] = useState<number>(0);
  const [urlCategorias] = useState(base_url + "/categorias");
  const [urlProductos] = useState(base_url + "/productos");
  const [urlVentas] = useState(base_url + "/ventas");
  const [urlDetalleVentas] = useState(base_url + "/detalle-ventas");
  const [cuentaParaLlevar, setCuentaParaLlevar] = useState<Producto[]>([]);
  const [cuentaMesa1, setCuentaMesa1] = useState<Producto[]>([]);
  const [networkStatusToast, setNetworkStatusToast] = useState<boolean>(false);
  const [seleccionarParaLlevar, setSeleccionarParaLlevar] =
    useState<boolean>(true);
  const [seleccionarMesa, setSeleccionarMesa] = useState<boolean>(false);
  const [showMessageNetworkStatus, setShowMessageNetworkStatus] =
    useState<boolean>(false);
  const isMountedRef = useRef<boolean>(false);

  const loadCategorias = async () => {
    const clearCategorias: Categoria[] = [];
    if (isMountedRef.current) {
      setCategorias(clearCategorias);
    }

    await axios
      .get(urlCategorias, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      })
      .then((response) => {
        const cats: any[] = response.data;
        const tmpCatsArray: Categoria[] = [];
        cats.map(function (c) {
          const tmpCategoria: Categoria = {
            id: c.id,
            nombre: c.nombre,
            imagen: base_url + c.imagen.formats.thumbnail.url,
          };
          tmpCatsArray.push(tmpCategoria);
        });
        if (isMountedRef.current) {
          setCategorias(tmpCatsArray);
        }
      })
      .catch((errors) => {
        console.debug(errors);
      });
  };

  const loadProductos = async () => {
    await axios
      .get(urlProductos, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      })
      .then((response) => {
        const prods: any[] = response.data;
        const tmpProdsArray: Producto[] = [];
        prods.map(function (p) {
          const tmpProducto: Producto = {
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            imagen: base_url + p.categoria.imagen.formats.thumbnail.url,
          };
          tmpProdsArray.push(tmpProducto);
        });
        if (isMountedRef.current) {
          setProductos(tmpProdsArray);
        }
      })
      .catch((errors) => {
        console.debug(errors);
      });
  };

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
    loadProductos();
    loadCategorias();
    return () => {
      isMountedRef.current = false;
    };
  }, [id, accessToken, tokenType]);

  const productoSeleccionadoHandler = (producto: Producto) => {
    if (seleccionarParaLlevar) {
      setCuentaParaLlevar((prevCuenta) => {
        return [producto, ...prevCuenta];
      });
    } else {
      setCuentaMesa1((prevCuenta) => {
        return [producto, ...prevCuenta];
      });
    }
  };

  const seleccionarHanlder = (seleccion: string) => {
    if (seleccion == "mesa") {
      setSeleccionarParaLlevar(false);
      setSeleccionarMesa(true);
    } else {
      setSeleccionarParaLlevar(true);
      setSeleccionarMesa(false);
    }
  };

  const finalizarParaLlevarHandler = (event: any,total: number) => {
    event.preventDefault();
    if (total > 0) {
      axios
        .post(
          urlVentas,
          {
            FechaHoraVenta: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            Total: total,
            users: id,
          },
          {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        )
        .then((response) => {
          setVenta(response.data.id);
        });

      cuentaParaLlevar.map((p) => {
        axios.post(
          urlDetalleVentas,
          {
            FechaHoraVenta: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            Cantidad: 1,
            Subtotal: p.precio,
            producto: p.id,
            venta: venta,
          },
          {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        );
      });
      setCompleteToast(true);
      setMessageToast("Venta de para llevar completa!");
      setCuentaParaLlevar([]);
    }
  };

  const finalizarMesaHandler = (event: any,total: number) => {
    event.preventDefault();
    if (total > 0) {
      axios
        .post(
          urlVentas,
          {
            FechaHoraVenta: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            Total: total,
            users: id,
          },
          {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        )
        .then((response) => {
          setVenta(response.data.id);
        });

      cuentaMesa1.map((p) => {
        axios.post(
          urlDetalleVentas,
          {
            FechaHoraVenta: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            Cantidad: 1,
            Subtotal: p.precio,
            producto: p.id,
            venta: venta,
          },
          {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        );
      });
      setCompleteToast(true);
      setMessageToast("Venta de mesa completa!");
      setCuentaMesa1([]);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Atender</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scroll-x={true}>
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
        <div className="flex-row">
          <div style={{ padding: "8px" }}>
            <IonItem lines="none" style={{ padding: "9px" }}>
              <IonLabel>Comidas y Bebidas</IonLabel>
            </IonItem>
            <ComidasBebidas
              categorias={categorias}
              productos={productos}
              seleccionProductoHandler={productoSeleccionadoHandler}
            />
          </div>
          <div className="flex-column" style={{ padding: "2px" }}>
            <div style={{ padding: "2px" }}>
              <IonItem lines="none" style={{ padding: "9px" }}>
                <IonLabel>Para llevar</IonLabel>
              </IonItem>
              <ParaLlevar
                productos={cuentaParaLlevar}
                seleccionado={seleccionarParaLlevar}
                seleccionHandler={seleccionarHanlder}
                finalizarHandler={finalizarParaLlevarHandler}
              />
            </div>
            <div style={{ padding: "2px" }}>
              <IonItem lines="none" style={{ padding: "9px" }}>
                <IonLabel>Mesa 1</IonLabel>
              </IonItem>
              <Mesa1
                productos={cuentaMesa1}
                seleccionado={seleccionarMesa}
                seleccionHandler={seleccionarHanlder}
                finalizarHandler={finalizarMesaHandler}
              />
            </div>
          </div>
        </div>
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
  component: Atender,
});
