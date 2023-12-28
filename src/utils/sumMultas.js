import React from 'react'


export const sumMultas = (list) => {

    var total = list.reduce(function (accumulator, item) {
        return accumulator + item.tipoMulta.monto;
      }, 0);

    return total
}