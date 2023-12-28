import React from "react";

export const FiltroCV = (item, tipo) =>{
    let total = 0;

    if(tipo === "30") {
        total = item.reduce(function(accumulator, it) {
            return accumulator + it.saldo30;
        }, 0);
    } else if(tipo === "60") {
        total = item.reduce(function(accumulator, it) {
            return accumulator + it.saldo60;
        }, 0);
    } else if(tipo === "90") {
        total = item.reduce(function(accumulator, it) {
            return accumulator + it.saldo90;
        }, 0);
    } else if(tipo === "100") {
        total = item.reduce(function(accumulator, it) {
            return accumulator + it.saldo90 + it.saldo60 + it.saldo30;
        }, 0);
    }

    return total;
}
