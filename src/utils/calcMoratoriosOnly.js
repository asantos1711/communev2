import React from 'react';
import { isMenorFechaPagoMoratorio } from './isMenorFechaPagoMoratorio';
import moment from 'moment';

export const calcMoratoriosOnly = (date, moratorios) =>{
    let d = moment();
    if(date!=null){
      d = moment(date);
    }
    //console.log(moratorios)
    var total = 0;
    if(moratorios.length > 0){
      moratorios.forEach(item=>{
        if(!isMenorFechaPagoMoratorio(d, item.fechaCorte)){
          total+= item.deudaMoratoria-item.pagado
        }
      })
    }
    
    return total
}