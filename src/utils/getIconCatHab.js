import React from 'react' 
import habitado from '../img/estados/habitado-color.svg';
import deshabitado from '../img/estados/deshabitado_color-01.svg';

export const getIconCatHab = (tipo) => {
    switch(tipo){
        case 'habitado':
            return <img src={habitado} alt="habitada" title="habitada" className="icon-estado mr-2" />
        case 'deshabitado':
            return <img src={deshabitado} alt="deshabitada" title="deshabitada" className="icon-estado mr-2" />
        default:
            return null
    }   
}