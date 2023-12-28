import React from 'react'


export const sumPagoTotalCaja = (list) => {
    var total = list.reduce(function (accumulator, item) {
        return accumulator + item.pago;
      }, 0);

    return total
}