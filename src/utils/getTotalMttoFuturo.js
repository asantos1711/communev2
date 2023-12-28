import { calcTotal } from './calcTotal';
export const getTotalMttoFuturo = (discountSpecial, mttos, descuentos,cuota) =>{
    let result = 0;
    for(var i=0; i<mttos.length; i++){
        result += calcTotal(descuentos, cuota, mttos[i], discountSpecial,0)
   }
   
   return result
}