import React from 'react'


export const getMonto = (list, type) => {
    var total = list.filter(item=>item.status===type).reduce(function (accumulator, item) {
        return accumulator + item.monto;
      }, 0);
    return total
}