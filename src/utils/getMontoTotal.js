import React from 'react'
import { getMonto } from './getMonto';


export const getMontoTotal = (list, type) => {
    var total = 0;
    for(var i=0; i<list.length; i++){
        total+= getMonto(list[i].statusMonto, type)
    }
    return total
}