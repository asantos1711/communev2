import React from 'react' 
import propietario from '../img/estados/propietario_color-01.svg';
import alquilada from '../img/estados/alquilada_color-01.svg';
import airbnb from '../img/estados/airbnb_color.svg';

export const getIconSubCatHab = (tipo) => {
    switch(tipo){
        case 'propietario':
            return <img src={propietario} alt="propietario" title="propietario" className="icon-estado mr-2" />
        case 'alquilada':
            return <img src={alquilada} alt="alquilada" title="alquilada" className="icon-estado mr-2" />
        case 'airbnb':
            return <img src={airbnb} alt="airbnb" title="airbnb" className="icon-estado mr-2" />
        default:
            return null
    }   
}