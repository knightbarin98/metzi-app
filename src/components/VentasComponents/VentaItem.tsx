import React from "react";
import { IonItem,  IonLabel } from "@ionic/react";
import { Venta } from "../../models/Venta";

interface VentaItemProps {
  venta: Venta;
  index: number;
}

const VentaItem: React.FC<VentaItemProps> = ({ venta, index }) => {
  return (
    <IonItem key={index} lines="none">
      <IonLabel slot="end">Total $ {Number(venta.total).toFixed(2)}</IonLabel>
      <IonLabel slot="start">{venta.fechaHora}</IonLabel>
    </IonItem>
  );
};

export default VentaItem;
