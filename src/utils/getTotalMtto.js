import React from 'react'
import { getDiscountSpecial } from './getDiscountSpecial';
import { calcTotal } from './calcTotal';
import { sumPagos } from './sumPagos';


export const getTotalMtto = (discountSpecial, mttos, descuentos,cuota) => {
       let result = 0; 
        //console.log(discountSpecial)
      //  console.log(mttos)
      //  console.log(descuentos)
      //  console.log(cuota)

       for(var i=0; i<mttos.length; i++){
            //verificamos si tiene descuentos si esta valido y se lo aplicamos
               if(discountSpecial!==null){
                    result += mttos[i].total - sumPagos(mttos[i].cobroMantenimientoList)
               }else{
                    result += mttos[i].total - sumPagos(mttos[i].cobroMantenimientoList) - mttos[i].descuentoReglas
               }
            //result += calcTotal(descuentos, cuota, mttos[i].fechaCorte, discountSpecial,sumPagos(mttos[i].cobroMantenimientoList))
            if(discountSpecial!==null){
               result -= getDiscountSpecial(mttos[i].total, discountSpecial)
            }  
       }

       //console.log(result)
     //   return Math.ceil(result)
     return parseFloat(parseFloat(result).toFixed(2))
}