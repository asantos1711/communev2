import { isVencidoMtto } from './isVencidoMtto';
import moment from 'moment'

export const montoInteresMoratorioDia = (total, tiie_porcentaje, fechaCorte) => {
    var result = 0

    //calculamos cuantos dia tiene el mes de fechaCorte
    //console.log(fechaCorte)
    var date = moment(fechaCorte)
    var current_day = moment(`${date.format("YYYY-MM")}-${moment().format("DD")}`).format("D")
    var last_day = date.endOf('month').format("D")
    current_day = parseInt(current_day)
    last_day = parseInt(last_day)
    var percent_apply = (current_day/last_day)*tiie_porcentaje
    result = Math.ceil((total*percent_apply)/100)
    return result
}