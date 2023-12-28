import React from 'react';
import { montoInteresMoratorio } from './montoInteresMoratorio';
import { montoInteresMoratorioDia } from './montoInteresMoratorioDia';
import moment from 'moment'
import { isMonthBefore } from './isMonthBefore';

export const calcInteresesMoratorios = (mttos, fechaCorte) => {
    //console.log(mttos)
    //console.log(fechaCorte)
    var intereses = 0;

    if(isMonthBefore(fechaCorte)){
        //buscar el costo del mtto de la fecha determinada
        var total = mttos.filter(item=>item.fechaCorte===fechaCorte).map(it=>it.total)[0]
        
        //obtengo todos los mantenimientos a partir de la fecha de corte en adelante        
        var mttosValidos = mttos.filter(item=>moment(item.fechaCorte)>moment(fechaCorte))
        //console.log(mttosValidos)
        for(var i=0; i<mttosValidos.length;i++){
            if(isMonthBefore(mttosValidos[i].fechaCorte)){
                intereses += montoInteresMoratorio(total, mttosValidos[i].tiie_porcentaje) 
            }else{
                intereses += montoInteresMoratorioDia(total, mttosValidos[i].tiie_porcentaje, mttosValidos[i].fechaCorte)
            }
        }
    }      
    return intereses
}