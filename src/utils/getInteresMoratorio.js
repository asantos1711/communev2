import React from 'react'

export const getInteresMoratorio = (mttos, fechaCorte) => {
    var total = mttos.filter(item=>item.fechaCorte===fechaCorte)

    if(total.length > 0){
        return total[0].deuda_moratoria
    }else{
        return 0
    }
     
}