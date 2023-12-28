import React from 'react';


export const sumTotalPagosMttos = (mttos) => {
    let total = 0;
    mttos.forEach(element => {
        total = element.cobroMantenimientoList.reduce(function (accumulator, item) {
            return accumulator + item.pagado;
          }, 0);
    });
    return total
}