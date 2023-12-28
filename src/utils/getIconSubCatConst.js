import React from 'react' 
import obra_en_proceso from '../img/estados/obra-en-procesosvg-color-01.svg';
import obra_abandonada from '../img/estados/obra_abandonada_color-01.svg';
import obra_suspendida from '../img/estados/obra suspendida-color.svg';
import proyecto_aprobado from '../img/estados/proyecto_aprobado_color-01.svg';

export const getIconSubCatConst = (tipo) => {
    switch(tipo){
        case 'obra_en_proceso':
            return <img src={obra_en_proceso} alt="obra_en_proceso" title="obra en proceso" className="icon-estado mr-2" />
        case 'obra_abandonada':
            return <img src={obra_abandonada} alt="obra_abandonada" title="obra abandonada" className="icon-estado mr-2" />
        case 'obra_suspendida':
            return <img src={obra_suspendida} alt="obra_suspendida" title="obra suspendida" className="icon-estado mr-2" />
        case 'proyecto_aprobado':
            return <img src={proyecto_aprobado} alt="proyecto_aprobado" title="proyecto aprobado" className="icon-estado mr-2" />
        default:
            return null
    }   
}