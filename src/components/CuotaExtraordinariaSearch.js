import React from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { BsPlusCircleFill } from 'react-icons/bs'

export default function CuotaExtraordinariaSearch({url, selectOpt, onChangeSelect,selectCuotaExtr,title}){
    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>
                    {title}{' '}
                    <Link className="btn btn-outline-primary btn-sm" to={`${url}/nuevo`}> <BsPlusCircleFill className="mt-m5" /> Nueva</Link>{' '}
                    <Link className="btn btn-outline-primary btn-sm" to={`${url}/nuevoporlote`}> <BsPlusCircleFill className="mt-m5" /> Nueva por lote</Link>
                </Card.Title>                        
                <Row className="mt-5">
                    <Col> 
                        <Form.Group as={Row}>
                            <Form.Label column sm={2}>Tipo cuota</Form.Label>
                            <Col sm={6}>
                                <Form.Control as="select" onChange={onChangeSelect} value={selectCuotaExtr}>
                                    <option value="">Seleccionar opción</option>
                                    {
                                        selectOpt.map((item,i)=>(
                                            <option key={i} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>                        
                    </Col>
                </Row>                        
            </Card.Body>
        </Card>
    )
}