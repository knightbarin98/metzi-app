import {
  IonCard,
  IonCardContent,
  IonList,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import CuentaItem from "./CuentaItem";
import "./ParaLlevar.scss";
import { Producto } from "../../models/Producto";
import { receipt } from "ionicons/icons";

interface ParaLlevarProps {
  productos: Producto[];
  seleccionado: boolean;
  seleccionHandler: Function;
  finalizarHandler: Function;
}

const ParaLlevar: React.FC<ParaLlevarProps> = ({
  productos,
  seleccionado,
  seleccionHandler,
  finalizarHandler
}) => {
  const [cuenta, setCuenta] = useState<Producto[]>(productos);
  const [selec, setSelec] = useState<boolean>(seleccionado);
  const [total,setTotal] = useState<number>(0);
  useEffect(() => {
    setCuenta(productos);
    setSelec(seleccionado);
    setTotal(0);
    productos.map((p)=>{
        setTotal((prevTotal)=>{
            return prevTotal + (p.precio == undefined ? 0 : p.precio);
        })
    });
  }, [productos, seleccionado]);
  

  return (
    <IonCard onClick={() => seleccionHandler("parallevar")}>
      <IonCardContent>
        {selec ? (
          <div className="box">
            <IonList>
              {cuenta.map((p, i) => {
                return <CuentaItem producto={p} index={i} />;
              })}
            </IonList>
          </div>
        ) : (
          <IonList>
            {cuenta.map((p, i) => {
              return <CuentaItem producto={p} index={i} />;
            })}
          </IonList>
        )}
        <IonItem lines="none">
          <IonLabel color="primary">Total $ {Number(total).toFixed(2)}</IonLabel>
          <IonButton slot="end" onClick={(e)=>finalizarHandler(e,total)}>
            Finalizar
            <IonIcon icon={receipt} />
          </IonButton>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default ParaLlevar;
