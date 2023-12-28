import React from 'react';

export const getColors = (data) =>{
    let arr = [];
    data.forEach(item=>{
        switch (item.name){
            case 'Efectivo - Oficina':
                arr.push("#00C49F")
                break;
            case 'Efectivo - Banco':
                arr.push("#019b7e")
                break;
            case 'Cheque - Oficina':
                arr.push('#FFBB28')
                break;
            case 'Cheque - Banco':
                arr.push('#c2880b')
                break;
            case 'Transferencia':
                arr.push('#ff8042')
                break;
            case 'Tarjeta de crédito - Oficina':
                arr.push('#0088fe')
                break;
            case 'Tarjeta de crédito - Web Transfer':
                arr.push('#055eab')
                break;
            case 'Tarjeta de débito - Oficina':
                arr.push('#ff5860')
                break;
            case 'Tarjeta de débito - Web Transfer':
                arr.push('#df121c')
                break;
            case 'Otro':
                arr.push('#888888')
                break;
            case 'Mantenimiento':
                arr.push('#00C49F')
                break;
            case 'Sanción':
                arr.push('#FFBB28')
                break;
            case 'Cuota inicial':
                arr.push('#ff8042')
                break;
            case 'Cuota extraordinaria':
                arr.push('#0088fe')
                break;
            case 'Pagados':
                    arr.push('#28a745')
                    break;
            case 'No pagados':
                arr.push('#dc3545')
                break;
            case 'Otras cuotas':
                arr.push('#007bff')
                break;
            default:
                arr.push('#ddddd')
        }
    })

    return arr;
}