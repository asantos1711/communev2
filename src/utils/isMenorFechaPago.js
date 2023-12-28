import React from 'react';
import moment from 'moment';

export const isMenorFechaPago = (fechaPago, fechaCorte) =>{
    const fechaPagoM = moment(fechaPago)
    const fechaCorteM = moment(fechaCorte)

    if(fechaPagoM.isBefore(fechaCorteM)){
        return true;
    }else if(fechaPagoM.isSame(fechaCorteM, 'year') && fechaPagoM.isSame(fechaCorteM, 'month') && fechaPagoM.isSame(fechaCorteM, 'day')){
        return true;
    }else{
        return false;
    }
}