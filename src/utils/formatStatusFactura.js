import React from 'react'

export const formatStatusFactura = (status) => {
    switch(status){
        case "facturada":
            return <span className="badge badge-success">{status}</span>
        case "cancelada":
            return <span className="badge badge-danger">{status}</span>
        case "pendiente":
            return <span className="badge badge-warning">{status}</span>
        default:
            return 'no tiene estado'
    }
}