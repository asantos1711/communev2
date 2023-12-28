export const getDiscountSpecial = (total, discount) => {
    var result = (total*discount)/100    
    return Math.ceil(result);
}