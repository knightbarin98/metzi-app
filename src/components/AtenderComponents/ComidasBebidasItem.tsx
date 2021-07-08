import React from 'react';
import {
    IonItem,
    IonThumbnail,
    IonImg,
    IonLabel,
  } from "@ionic/react";
  import { Producto } from "../../models/Producto";

  interface ComidasBebidasItemProps {
    producto: Producto;
    seleccionarProductoHandler: Function;
  }

  const ComidasBebidasItem: React.FC<ComidasBebidasItemProps> = ({producto,seleccionarProductoHandler}) => {

    const seleccionHandler = () => {
        seleccionarProductoHandler(producto);
    }
      return (
        <IonItem
        onClick={
          seleccionHandler
        }
        key={producto.id}
      >
        <IonThumbnail>
          <IonImg src={producto.imagen} />
        </IonThumbnail>
        <IonLabel style={{ padding: "16px" }}>{producto.nombre}</IonLabel>
      </IonItem>
      );
  }

  export default ComidasBebidasItem;