import React from 'react'

export const calcAbonosEstadoCuenta = (items) => {
    var total = items.reduce(function (accumulator, item) {
        return accumulator + item.abono;
      }, 0);
      
      return total
}