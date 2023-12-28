export const setClass = (status) =>{
    switch(status){
        case 'disponible':
            return 'text-success';
        case 'ocupado':
            return 'text-danger';
        case 'parcialmente':
            return 'text-warning';
        case 'reservado':
            return 'text-primary';
        default:
            return 'text-dark'
    }
}