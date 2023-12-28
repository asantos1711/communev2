export const IsDirector = role => {
    //console.log(role)
    if(role === 'ROLE_SUPERADMINISTRADOR' || role === 'ROLE_DIRECTOR'){
        return true
    }else{
        return false
    }
}