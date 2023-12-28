import React from 'react';

export const IsConsultor = role => {
    //console.log(role)
    if(role === 'ROLE_CONSULTOR'){
        return true
    }else{
        return false
    }
}