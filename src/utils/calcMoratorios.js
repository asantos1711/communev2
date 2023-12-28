import React from 'react'
import { isMenorFechaPago } from './isMenorFechaPago';

export const calcMoratorios = (moratorios, fechaPagoReal)=>{
  //console.log(mttos)
  var total = 0;

  moratorios.forEach(item=>{
      //console.log(fechaPagoReal)
      //console.log(item.fechaCorte)
      //console.log(isMenorFechaPago(fechaPagoReal, item.fechaCorte))
      if(!isMenorFechaPago(fechaPagoReal, item.fechaCorte)){
          total+=item.deudaMoratoria-item.pagado
      }
  })

  return total;
}