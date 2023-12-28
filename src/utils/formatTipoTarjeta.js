import React from 'react'

export const formatTipoTarjeta = (tipo) =>{
    switch(tipo){
        case 'visa_mastercard':
            return 'Visa/Mastercard'
        case 'american_express':
            return 'American Express'
        case 'credito':
            return 'Crédito'
        case 'debito':
                return 'Débito'
        default: 
            return ''
    }
}