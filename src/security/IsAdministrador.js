export const IsAdministrador = role => {
    if(role === 'ROLE_ADMINISTRADOR'){
        return true
    }else{
        return false
    }
}