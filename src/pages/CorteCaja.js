import React, { useContext } from 'react'
import { authContext } from '../context/AuthContext'
import CorteCajaDetail from '../components/CorteCajaDetail'

export default function CorteCaja(){
    const {auth} = useContext(authContext)

    return(
        <CorteCajaDetail access_token={auth.data.access_token}/>
    )
}