import React from 'react';

export const getColorOnly = (name) =>{
    switch (name){
        case 'Efectivo - Oficina':
           return "#00C49F"
        case 'Efectivo - Banco':
           return "#019b7e"
        case 'Cheque - Oficina':
           return '#FFBB28'
        case 'Cheque - Banco':
           return '#c2880b'
        case 'Transferencia':
           return '#ff8042'
        case 'Tarjeta de crédito - Oficina':
           return '#0088fe'
        case 'Tarjeta de crédito - Web Transfer':
           return '#055eab'
        case 'Tarjeta de débito - Oficina':
           return '#ff5860'
        case 'Tarjeta de débito - Web Transfer':
           return '#df121c'
        case 'Otro':
           return '#888888'
        case 'Mantenimiento':
            return '#00C49F'
        case 'Sanción':
            return '#FFBB28'
        case 'Cuota inicial':
            return '#ff8042'
        case 'Cuota extraordinaria':
            return '#0088fe'
         case 'Pagados':
               return '#28a745'
         case 'No pagados':
               return '#dc3545'
        default:
           return '#ddddd'
        }
}