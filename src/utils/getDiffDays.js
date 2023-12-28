import React from 'react';
import moment from 'moment'

export const getDiffDays = fecha =>{
    let current = moment().set({"hour": 0, "minute": 0});
    let f = moment(fecha, "YYYY-MM-DD").set({"hour": 23, "minute": 59})
    if(f.isBefore(current)){
        return -1
    }else{
        return f.diff(current, 'd')
    }
} 