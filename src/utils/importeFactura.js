import React from 'react'

export const importeFactura = (list) =>{
    //console.log(list)
    var total = list.reduce(function (accumulator, item) {
        return accumulator + parseInt(item.monto);
      }, 0);

    return total
}