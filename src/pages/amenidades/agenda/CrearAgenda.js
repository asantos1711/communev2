import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import CrearAgendaForm from '../../../components/agenda/CrearAgendaForm';

export default function CrearAgenda(){
    return(
        <Row className='mb-3'>
            <ToastContainer />
            <Col xs="12" lg="12">
                <Card className="shadow">
                    <Card.Body>
                        <CrearAgendaForm />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}