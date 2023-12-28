import React from 'react'

export const isVencidoMtto = (fechaCorte) => {
    var today = new Date();
    var aux = fechaCorte.split("-")
    var fecha = new Date(aux[0], aux[1]-1, aux[2])

    if(fecha.getFullYear() < today.getFullYear()){
        return true;
    }else if(fecha.getUTCMonth() < today.getUTCMonth() && fecha.getFullYear() <= today.getFullYear()){
        return true;
    }else{
        return false
    }
}