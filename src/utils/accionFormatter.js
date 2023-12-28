import React from 'react';

export const accionFormatter = (status) =>{
    switch(status){
        case "creado":
            return <span className="badge badge-success">{status}</span>
        case "cancelado":
            return <span className="badge badge-dark">{status}</span>
        case "eliminado":
            return <span className="badge badge-danger">{status}</span>
        case "actualizado":
            return <span className="badge badge-info">{status}</span>
        default:
            return 'no tiene estado'
    }
}