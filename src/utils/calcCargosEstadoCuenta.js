import React from 'react'

export const calcCargosEstadoCuenta = (items) => {
    var total = items.reduce(function (accumulator, item) {
        return accumulator + item.cargo;
      }, 0);
      
      return total
}