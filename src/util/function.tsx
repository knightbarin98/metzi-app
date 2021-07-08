import React from 'react';
import {IonItem} from "@ionic/react";

export const showError = (errors: any, _fieldName: string) => {
    let error = (errors as any)[_fieldName];
    return error ? (
        <IonItem lines="none">
            <div style={{ color: "red", fontSize: "smaller" }} >
                {error || "Field Is Required"}
            </div>
        </IonItem>
    ) : null;
};