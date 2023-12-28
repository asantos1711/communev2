import React, { useContext } from 'react'
import { authContext } from '../context/AuthContext'
import SancionesReportesDetail from './SancionesReportesDetail'

export default function SancionesReportes(){
    const {auth} = useContext(authContext)

    return(
        <SancionesReportesDetail access_token={auth.data.access_token}/>
    )
}