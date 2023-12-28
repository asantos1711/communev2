export const getTipoVisita = (tipoV) => {
    const obj = {
        regularindefinido: 'Regular Indefinido',
        regulardefinido: 'Regular Definido',
        rentaVac: 'Renta Vacacional',
        Trabajador: 'Trabajador',
        TrabajadorPermanente: 'Trabajador Permanente',
        Instantanea: 'Instantanea',
        unicoDia: 'Único Día'
    }
    return obj[tipoV] || tipoV;
}