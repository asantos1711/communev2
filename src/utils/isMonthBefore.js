import React from 'react';
import moment from 'moment';

export const isMonthBefore = (fechaCorte) => {
    var today = moment().format("M");
    var fecha = moment(fechaCorte).format("M")

    if(parseInt(fecha) < parseInt(today)){
        return true;
    }
    else{
        return false;
    }
}