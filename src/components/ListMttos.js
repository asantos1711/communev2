import React from 'react'
import { Accordion, Card, Row, Col, Jumbotron, Container } from 'react-bootstrap'
import moment from 'moment'
import ReglasDescuentoMtto from './ReglasDescuentoMtto'
import { isVencidoMtto } from '../utils/isVencidoMtto'
import { getMonthStr } from '../utils/getMonthStr'

export default function ListMttos(props){
    //console.log(props)
    return(
        <div className="h-400">
            {
                props.mantenimientos.length === 0
                ? <Jumbotron fluid><Container><p className="text-center">No existen mantenimientos a pagar.</p></Container></Jumbotron>
                :
                props.mantenimientos.map((item, i)=>(
                    <Accordion defaultActiveKey={i} key={i} className="mb-3">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0" className={`${isVencidoMtto(item.fechaCorte) && "mtto-vencido"}`}>
                                <Row>
                                    <Col xs="5" lg="5">
                                        <h6 className="m-0 p-1 cursor-pointer">{`${getMonthStr(item.mes)} - ${item.year}`}</h6>
                                    </Col>
                                    <Col xs="3" lg="3">
                                        {/* <div className="p-1">{`TIIE: ${item.tiie_porcentaje ? item.tiie_porcentaje : ' - '}%`}</div> */}
                                    </Col>
                                    <Col xs="4" lg="4">
                                        <div className="p-1 text-right">
                                            {`Fecha corte: ${moment(item.fechaCorte).format("DD-MM-YYYY")}`}                                            
                                        </div>
                                        
                                    </Col>
                                </Row>                                
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <ReglasDescuentoMtto 
                                    descuentos={props.descuentos} 
                                    total={item.total} 
                                    fechaCorte={item.fechaCorte} 
                                    discount={props.discount}
                                    cobros={item.cobroMantenimientoList}
                                    moratorios={props.mantenimientos}
                                />
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>                        
                    </Accordion>
                ))
            }
        </div>
    )
}