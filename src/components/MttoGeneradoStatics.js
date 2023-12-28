import React from 'react'
import { Card, Row, Col, Form } from 'react-bootstrap'
import PieChart from './PieChart'
import Skeleton from 'react-loading-skeleton'

export default function MttoGeneradoStatics({countCondos, countHabitacional, countComercial,listByStatus, handleChangeRadio,isLoadingPie}){
    return(
        <Card className="shadow">
            <Card.Body>                  
                <Row>
                    <Col xs lg="4">
                        <Row className="mb-4 mt-4">
                            <Col>
                                <h6>
                                <Form.Check
                                    defaultChecked={true}
                                    custom
                                    name="radio"
                                    type='radio'
                                    label= 'Todos'
                                    id="radio-0"
                                    value="todos"
                                    onChange={handleChangeRadio}
                                />
                                </h6></Col>
                            <Col className="text-right"><span>{countCondos+countHabitacional+countComercial}</span></Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                <h6>
                                <Form.Check
                                    custom
                                    name="radio"
                                    type='radio'
                                    label= 'Lote Condominal'
                                    id="radio-1"
                                    value="condominal"
                                    onChange={handleChangeRadio}
                                />
                                </h6></Col>
                            <Col className="text-right"><span>{countCondos}</span></Col>
                        </Row>
                        <Row className="mb-4">
                            <Col><h6>
                                <Form.Check
                                    custom
                                    name="radio"
                                    type='radio'
                                    label= 'Lote Habitacional'
                                    id="radio-2"
                                    value="habitacional"
                                    onChange={handleChangeRadio}
                                /></h6></Col>
                            <Col className="text-right"><span>{countHabitacional}</span></Col>
                        </Row>
                        <Row className="mb-4">
                            <Col><h6>
                            <Form.Check
                                    custom
                                    name="radio"
                                    type='radio'
                                    label= 'Lote Comercial'
                                    id="radio-3"
                                    value="comercial"
                                    onChange={handleChangeRadio}
                                /></h6></Col>
                            <Col className="text-right"><span>{countComercial}</span></Col>
                        </Row>
                    </Col>
                    <Col xs lg="8" className="text-center">
                        {
                            isLoadingPie
                            ? <Skeleton circle={true} height={200} width={200} />
                            : <PieChart values={listByStatus}/>
                        }                        
                    </Col>
                </Row>                                                  
            </Card.Body>
        </Card>
    )
}