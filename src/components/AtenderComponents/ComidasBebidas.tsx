import { IonCard, IonCardContent, IonList } from "@ionic/react";
import React, { useEffect, useState } from "react";
import ComidasBebidasItem from "./ComidasBebidasItem";
import { Categoria } from "../../models/Categoria";
import { Producto } from "../../models/Producto";

interface ComidasBebidasProps {
  categorias: Categoria[];
  productos: Producto[];
  seleccionProductoHandler: Function;
}

const ComidasBebidas: React.FC<ComidasBebidasProps> = ({
  categorias,
  productos,
  seleccionProductoHandler,
}) => {
    const [prods, setProds] = useState<Producto[]>(productos);
    useEffect(()=>{
        setProds(productos);
    },[productos])

  const seleccionHandler = (producto: Producto) => {
    seleccionProductoHandler(producto);
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonList>
          {
            productos.map((p) => {
              return (<ComidasBebidasItem
                key={p.id}
                producto={p}
                seleccionarProductoHandler={seleccionHandler}
              />);
            })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default ComidasBebidas;
