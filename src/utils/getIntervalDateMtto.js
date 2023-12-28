import React from 'react'
import moment from 'moment'


export const getIntervalDateMtto = (startDate, endDate) => {
    //console.log(startDate)
    //console.log(endDate)
    var result = []    
    var currentDate = moment(startDate);
    var stopDate = moment(endDate);


    while (currentDate <= stopDate) {
        result.push( moment(currentDate).format('YYYY-MM-DD') )
        currentDate = moment(currentDate).add(1, 'month');
    }

    return result;
}