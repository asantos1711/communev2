import React from 'react'

export const setBagdeStatusPayment = (status) => {
    switch(status){
        case "recibido":
            return "badge-success"
        case "cancelado":
            return "badge-danger"
        case "condonado":
            return "badge-info"
        default:
            return "badge-light"
    }
}