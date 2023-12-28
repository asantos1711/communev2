import React from 'react';
import moment from 'moment';

export const setStatusNota = (fecha, activa) =>{
    let current = moment().set({"hour": 0, "minute": 0});
    let f = moment(fecha, "YYYY-MM-DD").set({"hour": 23, "minute": 59})
    if(!activa){
        return <span className="badge badge-light">Cerrada</span>
    }else if(f.diff(current, 'd') > 3){
        return <span className="badge badge-success">Activa</span>
    }else if(f.diff(current, 'd') <= 3 && f.diff(current, 'd') >= 0){
        return <span className="badge badge-warning">Advertencia</span>
    }else{
        return <span className="badge badge-danger">Alerta</span>
    }

}