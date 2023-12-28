import React from 'react'

export const calcAPagarMoratoriosCant = (mttos, cantidad) =>{
    var result=0;
    for(var i = 0; i<cantidad; i++){
        result += mttos[i].deuda_moratoria
    }
    return result;
}