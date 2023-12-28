import React from "react";

export const calcConciliado = (item, tipo) =>{
    let total = 0;
    if(tipo==="30"){
        total = item.reduce(function (accumulator, it) {
            return accumulator + it.treinta;
          }, 0);
    }else  if(tipo==="60"){
        total = item.reduce(function (accumulator, it) {
            return accumulator + it.sesenta;
          }, 0);
    }else if(tipo==="90"){
        total = item.reduce(function (accumulator, it) {
            return accumulator + it.noventa;
          }, 0);
    }else if(tipo==="100"){
        total = item.reduce(function (accumulator, it) {
            return accumulator + it.noventa+it.treinta+it.sesenta;
          }, 0);
    }

    return total
}