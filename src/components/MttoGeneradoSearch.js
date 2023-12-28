import React from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import { BsPlusCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'

export default function MttoGeneradoSearch({fecha, setFecha, handleMes, url}){
    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>
                    Mantenimientos Generados{' '}
                    <Link className="btn btn-outline-primary btn-sm" to={`${url}/nuevo`}> <BsPlusCircleFill className="mt-m5" /> Nuevo</Link>
                </Card.Title>                        
                <Row className="mt-5">
                    <Col> 
                        <Form.Group as={Row}>
                            <Form.Label column sm={1}>Mes</Form.Label>
                            <Col sm={3}>
                                <DatePicker className="form-control"
                                    showPopperArrow={false}
                                    selected={fecha}
                                    autoComplete="off"
                                    dateFormat="MMMM-yyyy"
                                    onChange={date => {
                                        if(date === "" || date ===null || date===undefined){
                                            setFecha(new Date())
                                        }else{
                                            setFecha(date)
                                        }                                        
                                    }}
                                    locale="es"
                                    showMonthYearPicker
                                />                                
                            </Col>
                        </Form.Group>                        
                    </Col>
                </Row>                        
            </Card.Body>
        </Card>
    )
}