import React from 'react'
import { Row, Col } from 'react-bootstrap'
import CancelarDeudasComp from '../components/CancelarDeudasComp'

export default function Cancelaciones(){
    return(
        <Row>
            <Col xs lg="4" className="mb-4">
                <CancelarDeudasComp />
            </Col>
        </Row>


    )
}