import React from 'react'
import { getDiscountSpecial } from './getDiscountSpecial';
import { calcTotal } from './calcTotal';


export const calcMttos = (item, cant) => {
    var result = 0
    var resul_final = 0;

    for(var i=0; i<cant; i++){
        if(item.discount!==null){
            result=item.mantenimientos[i].total-getDiscountSpecial(item.mantenimientos[i].total, item.discount) 
            result-=calcTotal(item.descuentos,item.mantenimientos[i].total,item.mantenimientos[i].fechaCorte,0)
        }else{
            result=calcTotal(item.descuentos,item.mantenimientos[i].total,item.mantenimientos[i].fechaCorte,0)
        }
        
        resul_final+=result;
    }
    return resul_final;
}