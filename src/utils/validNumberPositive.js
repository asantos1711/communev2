import React from 'react'


export const validNumberPositive = (number, useFondo) => {
    if(useFondo && is_numeric(number)){
        return true
    }
    else if( (is_numeric(number)) && (number>0) && !useFondo ){
        return true;
    }else{
        return false
    } 
}

function is_numeric(value){
    return !isNaN(parseFloat(value)) && isFinite(value);
}