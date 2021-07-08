import React from "react";
import { IonItem,  IonLabel } from "@ionic/react";
import { Producto } from "../../models/Producto";

interface CuentaItemProps {
  producto: Producto;
  index: number;
}

const CuentaItem: React.FC<CuentaItemProps> = ({ producto, index }) => {
  return (
    <IonItem key={index} lines="none">
      <IonLabel slot="start">{producto.nombre}</IonLabel>
      <IonLabel slot="end">$ {Number(producto.precio).toFixed(2)}</IonLabel>
    </IonItem>
  );
};

export default CuentaItem;
