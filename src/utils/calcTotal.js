import React from 'react'
import moment from 'moment'
import { getDiscountSpecial } from './getDiscountSpecial'

export const calcTotal = (descuentos, total, fechaCorte, discountSpecial, currentPayment) => {
    var result = total 
    //console.log(result)
    //console.log(descuentos)
    //console.log(total)
    //console.log(fechaCorte)
    if(discountSpecial!==null){
        result-=getDiscountSpecial(total, discountSpecial)
    }else{
        var fecha = moment(fechaCorte)
        var diff = moment().diff(fecha, 'days')
        //console.log(diff)
        for(var i=0; i<descuentos.length; i++){
            if(diff<=0){
                result-=descuentos[i].discount
            }
        }
    }
    if(currentPayment!==null){
        result-=currentPayment
    }
    // return Math.ceil(result);
    return parseFloat(parseFloat(result).toFixed(2))






    // var diffDays = fecha.diff(today, 'seconds');
    // diffDays = Math.ceil(diffDays/(24*60*60))
    // //const diffTime = today - fecha;
    // //const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    // for(var i=0; i<descuentos.length; i++){
    //     if(diffDays>=0 && diffDays>=descuentos[i].day_before){
    //         result-=descuentos[i].discount
    //     }
    // }
    // if(discountSpecial!==null){
    //     result-=getDiscountSpecial(total, discountSpecial)
    // }       

    // if(currentPayment!==null){
    //     result-=currentPayment
    // }

    // return Math.ceil(result);
}