import { isVencidoMtto } from './isVencidoMtto';

export const montoInteresMoratorio = (total, tiie_porcentaje) => {
    var result = 0
    result = Math.ceil((total*tiie_porcentaje)/100)
    return result
}