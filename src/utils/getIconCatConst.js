import React from 'react' 
import construcción from '../img/estados/construccion_color.svg';
import baldio from '../img/estados/baldio-color-01.svg';

export const getIconCatConst = (tipo) => {
    switch(tipo){
        case 'construcción':
            return <img src={construcción} alt="construcción" title="construcción" className="icon-estado mr-2" />
        case 'baldio':
            return <img src={baldio} alt="baldio" title="baldío" className="icon-estado mr-2" />
        default:
            return null
    }   
}