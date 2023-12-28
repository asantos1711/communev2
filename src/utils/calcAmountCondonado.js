export const calcAmountCondonado = (condonadasMultasList) =>{
    return condonadasMultasList.reduce(function (accumulator, pilot) {
        return accumulator + pilot.montoCondonado;
      }, 0);
}