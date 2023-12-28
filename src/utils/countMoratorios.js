import React from 'react'

export const countMoratorios = (mttos) => {
    var arr = mttos.filter(item=>item.deuda_moratoria!==0)
    return arr.length
}