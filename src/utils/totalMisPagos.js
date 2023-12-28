import React from 'react'


export const totalMisPagos = (list) => {
    var total = list.reduce(function (accumulator, item) {
        return accumulator + item.amount;
      }, 0);

    return total
}