export const sumPagos = (list) => {
    var total = list.reduce(function (accumulator, item) {
        return accumulator + item.pagado;
      }, 0);

    return total
}