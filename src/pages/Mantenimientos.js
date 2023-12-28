import React, { useContext } from 'react'
import { Row, Col } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { IsDirector } from '../security/IsDirector'
import { IsAdministrador } from '../security/IsAdministrador'
import MantenimientoIndividualComp from '../components/MantenimientoIndividualComp'

export default function Mantenimientos(){
    const {auth} =  useContext(authContext)
    return(
        <Row>            
            {
                (IsDirector(auth.data.role) || IsAdministrador(auth.data.role)) && 
                <Col xs lg="4" className="mb-4">
                    <MantenimientoIndividualComp />
               </Col>
            }          
        </Row>


    )
}