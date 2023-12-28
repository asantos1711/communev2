import React from 'react'


export const getAmountMttoDcto = (list) => {

    if(list.length === 0){
        return 0
    }else{
        var total = list.map(el=>el.costoMttoDescuento)[0];
        return total
    }
}