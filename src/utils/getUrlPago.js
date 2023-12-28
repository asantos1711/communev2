import React from 'react'


export const getUrlPago = (tipo, identificador, lote_id) => {
    switch(tipo) {
        case 'cuota_inicial':
            return `/pagar-cuota-inicial/${identificador}`
        case 'cuota_extraordinaria':
            return `/pagar-cuota-extraordinaria/${identificador}`
        case 'mantenimiento':
            var a = lote_id === undefined ? false : identificador = lote_id;
            return `/mantenimiento/pagar/lote/${identificador}`
        case 'sanción':
            return `/pagar-sancion/${identificador}`
        case 'sancion':
                return `/pagar-sancion/${identificador}`
        case 'cuota_inicial_proyecto':
            return `/pagar-cuota-inicial-proyecto/${identificador}`
        case 'cuota':
            return `/pagar-cuota/${identificador}`
        default: 
            return ''
    }
}