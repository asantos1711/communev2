import React from 'react';
import { Card, Col, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import VerReserva from '../../../components/agenda/VerReserva';

export default function AmenidadVerReserva(){
    return(
        <Row className='mb-3'>
            <ToastContainer />            
            <Col xs="12" lg={{span: 8, offset: 2}}>
                <Card className="shadow">
                    <Card.Body>
                        <VerReserva />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}