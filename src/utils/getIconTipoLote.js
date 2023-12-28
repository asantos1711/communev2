import React from 'react' 
import condominal from '../img/estados/condominal_color-01.svg';
import habitacional from '../img/estados/habitacionalcolor-01.svg';
import comercial from '../img/estados/comercial_color.svg';

export const getIconTipoLote = (tipo_lote) => {
    switch(tipo_lote){
        case 'condominal':
            return <img src={condominal} alt="condominal" title="condominal" className="icon-estado mr-2" />
        case 'habitacional':
            return <img src={habitacional} alt="habitacional" title="habitacional" className="icon-estado mr-2" />
        case 'comercial':
            return <img src={comercial} alt="comercial" title="comercial" className="icon-estado mr-2" />
        default:
            return null
    }   
}