import React from 'react'
import representanteLegal from '../img/estados/representanteLegal.svg';

export const getIconHasRepresentante = (hasRepresentante) => {
    if(hasRepresentante!==undefined && hasRepresentante!==null && hasRepresentante){
        return <img src={representanteLegal} alt="representante legal" title="representante legal" className="icon-estado mr-2" />
    }  
}