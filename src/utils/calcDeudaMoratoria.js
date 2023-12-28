import { isMenorFechaPagoMoratorio } from './isMenorFechaPagoMoratorio';

export const calcDeudaMoratoria = (mttos, fechaPagoReal) =>{
    //console.log(mttos)
    var total = 0;

    mttos.forEach(item=>{
        //console.log(fechaPagoReal)
        //console.log(item.fechaCorte)
        //console.log(isMenorFechaPago(fechaPagoReal, item.fechaCorte))
        if(!isMenorFechaPagoMoratorio(fechaPagoReal, item.fechaCorte)){
            total+=item.deuda_moratoria
        }
    })

    return total;
}