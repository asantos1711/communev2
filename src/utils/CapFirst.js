import React from 'react'


export const CapFirst = (cadena) => {
    if(cadena === null || cadena === undefined){
        return "";
    }else{
        if(cadena === 'cuota_inicial' || cadena === 'cuota_extraordinaria' || cadena === 'intereses_moratorios'){
            let first = cadena.substring(0,1);
            let aux = cadena.split('_')
            return `${first.toUpperCase()}${aux[0].substring(1)} ${aux[1]}`
        }else if(cadena === 'cuota_inicial_proyecto'){
            let first = cadena.substring(0,1);
            let aux = cadena.split('_')
            return `${first.toUpperCase()}${aux[0].substring(1)} ${aux[1]} ${aux[2]}`
        }else{
            let firstUp = cadena.substring(0,1);
            return  `${firstUp.toUpperCase()}${cadena.substring(1)}`
        }
        
    }    
}