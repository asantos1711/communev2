import React from 'react'


export const sumCobros = (list) => {
    var total = list.reduce(function (accumulator, item) {
        return accumulator + item.monto;
      }, 0);

    return total
}