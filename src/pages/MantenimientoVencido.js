import React, { useContext } from 'react';
import MantenimientoVencidoDetail from '../components/MantenimientoVencidoDetail';
import { authContext } from '../context/AuthContext';

export default function MantenimientoVencido(){
    const {auth} = useContext(authContext)

    return(
        <MantenimientoVencidoDetail access_token={auth.data.access_token}/>
    )

}