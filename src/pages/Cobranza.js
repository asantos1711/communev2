import React from 'react'
import { Row, Col } from 'react-bootstrap'
import CargosRecurrentes from '../components/CargosRecurrentes'
import Facutras from '../components/Facutras'
import Pagos from '../components/Pagos'
import { isTags } from '../security/isTags'

export default function Cobranza({auth}){
    return(
        <Row>
            {!isTags(auth.data.role) && <Col xs lg="4" className="mb-4">
                <CargosRecurrentes />
            </Col>}            
            <Col xs lg="4" className="mb-4">
                <Facutras auth={auth}/>
            </Col> 
            {!isTags(auth.data.role) && <Col xs lg="4" className="mb-4">
                <Pagos />
            </Col>}          
        </Row>


    )
}