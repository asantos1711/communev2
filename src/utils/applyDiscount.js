import React from 'react'
import moment from 'moment'

export const applyDiscount = (day_before, total, fechaCorte) => {
    var result = false
    var fecha = moment(fechaCorte)
    var diff = moment().diff(fecha, 'days')
    if(diff<=0){
        result=true
    }
    return result
}