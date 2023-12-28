import React from 'react'
import { Card, Row, Col, Dropdown } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { sumPagos } from '../utils/sumPagos'
import { sumMultas } from '../utils/sumMultas'

export default function ResidenteBalance(props){
    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>Balance</Card.Title>
                <Dropdown.Divider />
                <Row>
                    <Col>
                        <label>Sanciones</label>
                        <h2>
                            <NumberFormat 
                                displayType="text"
                                prefix="$"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={true}
                                value={sumMultas(props.residente.multaList)} 
                            />
                        </h2>
                    </Col>
                    <Col>
                        <label>Pagos</label>
                        <h2>
                            <NumberFormat 
                                displayType="text"
                                prefix="$"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={true}
                                value={sumPagos(props.residente.pagosMultasList)} 
                            />
                        </h2>
                    </Col>
                    <Col>
                        <label>Deuda</label>
                        <h2 className={`${sumMultas(props.residente.multaList) > sumPagos(props.residente.pagosMultasList) && "text-danger"}`}>
                            <NumberFormat 
                                displayType="text"
                                prefix="$"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={true}
                                value={sumMultas(props.residente.multaList)-sumPagos(props.residente.pagosMultasList)} 
                            />
                        </h2>                      
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}