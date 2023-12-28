import React from 'react'

export const setBagdeStatus = (status) => {
    switch(status){
        case "vigente":
            return "badge-danger"
        case "cancelado":
            return "badge-dark"
        case "incompleto":
            return "badge-warning"
        case "pagado":
            return "badge-success"
        case "condonado":
                return "badge-info"
        default:
            return "badge-light"
    }
}