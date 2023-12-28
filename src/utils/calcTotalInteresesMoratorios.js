import React from 'react'

export const calcTotalInteresesMoratorios = (mttos) => {

    var total = mttos.reduce(function (accumulator, item) {
        return accumulator + (item.deuda_moratoria-item.pagado);
      }, 0);
    return total
}