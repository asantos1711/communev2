import { getDiscountSpecial } from './getDiscountSpecial';
import { isMenorFechaPago } from './isMenorFechaPago';
import { sumPagos } from './sumPagos';


export const getTotalMtto2 = (discountSpecial, arrayDates, descuentos,cuota, mttos, fechaPagoReal) => {
       let result = 0; 
       //console.log(arrayDates)
       console.log(mttos)
      /*  console.log(mttos)
       console.log(fechaPagoReal)
       console.log(descuentos)
       
       console.log(discountSpecial) */

      arrayDates.forEach(item=>{
        let currentDeuda = 0;
        let currentFecha = item;
        //console.log(item)

        let index = mttos.findIndex(el => el.fechaCorte === currentFecha)

        if(index >= 0){
          currentDeuda = mttos[index].total - sumPagos(mttos[index].cobroMantenimientoList) - mttos[index].descuentoReglas
          //console.log(currentDeuda+"- "+index)
          
          //console.log(result+"- "+index)
          //buscamos para aplicar el descuento si la fecha de pago es diferente
          if(discountSpecial===null){
            //console.log("isNUll")
            if(isMenorFechaPago(fechaPagoReal, currentFecha) && mttos[index].descuentoReglas===0){
              //console.log('menor')
              let total = descuentos.reduce(function(accumulator, item){
                return accumulator + item.discount;
              }, 0);
              currentDeuda-=total;
            }
          }else{
            currentDeuda -= getDiscountSpecial(mttos[index].total, discountSpecial)
          }   
          result +=currentDeuda  
          //console.log(result)  
        }else{
          //old
          //currentDeuda = calcTotal(descuentos, cuota, currentFecha, discountSpecial,sumTotalPagosMttos(mttos))
          //new
          currentDeuda = cuota
          if(discountSpecial===null){
            if(isMenorFechaPago(fechaPagoReal, currentFecha)){
              let total = descuentos.reduce(function(accumulator, item){
                return accumulator + item.discount;
              }, 0);
              currentDeuda-=total;
            }
          }else{
            currentDeuda -= getDiscountSpecial(mttos[0].total, discountSpecial)
          }
          
          
          result +=currentDeuda

        }                
      })
       return Math.ceil(result)
}