import React from 'react'
import NumberFormat from 'react-number-format'


export const formatNumber = (number) => {
    return <NumberFormat 
                value={number===null ? 0 : number}
                prefix="$"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                displayType="text"
           />
}
