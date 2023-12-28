export const calcAmount = (number, list) => {
    if(list.length === 0){
        return number
    }else{
        var totalPayment = list.filter(el=>el.pagoStatus==='recibido').reduce(function (accumulator, pilot) {
            return accumulator + pilot.pagado;
          }, 0);

        return number-totalPayment
    }
}