import React from 'react'
import habitado from '../img/estados/cargo_recurrente_color-01.svg';

export const getIconRecurrente = (isRecurrent) => {
    if(isRecurrent!==undefined && isRecurrent!==null && isRecurrent){
        return <img src={habitado} alt="cargos recurrente" title="cargos recurrentes" className="icon-estado mr-2" />
    }  
}