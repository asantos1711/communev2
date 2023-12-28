export const getTipoAcceso = (tipoA) => {
    const obj = {
        entrada: 'Entrada',
        salida: 'Salida',
        entradasinsalida: 'Entrada Sin Salida',
        EntradaConBloqueo: 'Entrada Con Bloqueo',
        SalidaConBloqueo: 'Salida Con Bloqueo'
    }
    return obj[tipoA] || tipoA;
}