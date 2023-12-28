import React from 'react'

export const calcDeudaOfMtto = (items) => {
    var total = items.filter(x=>x.status==="vigente" || x.status==="incompleto").reduce(function (accumulator, item) {
        return accumulator + item.amount;
      }, 0);
      
      return total
}