export const IsSuperadmin = role => {
    if(role === 'ROLE_SUPERADMINISTRADOR'){
        return true
    }else{
        return false
    }
}