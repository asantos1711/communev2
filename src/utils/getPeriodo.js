import React from 'react'
import { getMonto } from './getMonto'
import { getMonthStr } from './getMonthStr'


export const getPeriodo = (periodo) => {
   var m = periodo.split("-")
   var mes = getMonthStr(m[0])
   return `${mes}-${m[1]}`

}