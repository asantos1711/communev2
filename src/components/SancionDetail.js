import React, { useState } from 'react'
import { Card, Dropdown, Row, Col, Form, Button, Accordion, Modal } from 'react-bootstrap'
import moment from 'moment'
import NumberFormat from 'react-number-format'
import { calcAmount } from '../utils/calcAmount'
import { formatNumber } from '../utils/formatNumber'
import { toast, ToastContainer } from 'react-toastify'
import Get from '../service/Get'
import { CODIGO_AUTORIZACION_CHECK_CODIGO } from '../service/Routes'
import { calcAmountCondonado } from '../utils/calcAmountCondonado'
import InputMask from "react-input-mask";
import DatePicker from 'react-datepicker';

export default function SancionDetail(props){
    const [totalPagar, setTotalPagar] = useState(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
    const [show, setShow] = useState(false);    
    const handleClose = () => {
        setTotalPagar(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
        props.setInput(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
        props.setApplyDescuento(0)
        props.setAutorizado('')
        setShow(false)
    }
    const handleShow = () => {
        props.setInput(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
        props.setApplyDescuento(0)
        props.setAutorizado('')
        setTotalPagar(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
        setShow(true)
    };
    const handleAccept = () => {
        if(props.applyDescuento==="0"){
            setTotalPagar(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
            props.setInput(calcAmount(props.multa.costo, props.multa.pagosMultas)-calcAmountCondonado(props.multa.condonadasMultas))
            props.setAutorizado('')
            setShow(false)
        }
        else if(props.applyDescuento > 0 && props.applyDescuento <=100 && props.autorizado!=="" && props.autorizado!==null){

            //primaro se valida que el codigo de autorizacion esta vigente y es correcto
            Get({url: `${CODIGO_AUTORIZACION_CHECK_CODIGO}/${props.autorizado}`, access_token: props.access_token})
            .then(response=>{
                //console.log(response)
                if(!response.data){
                    toast.info("Código de autorización es incorrecto o no se puede usar más. Intente de nuevo porfavor", {autoClose: 8000})
                }else{
                    let monto_p = Math.ceil((props.applyDescuento*totalPagar)/100)
                    setTotalPagar(totalPagar-monto_p)
                    props.setInput(totalPagar-monto_p)
                    setShow(false)
                }
            })
            .catch(error=>{
                // console.log(error)
            })    
        }        
    };    

    

    return(
        <Card className="shadow">
            <ToastContainer />
            <Card.Body>
                <Card.Title>
                    Sanción
                </Card.Title>
                <Dropdown.Divider />                  
                <Row className="mb-3">
                    <Col xs lg="6">
                        <dl className="row">
                            <dd className="col-sm-3">Folio</dd>
                            <dt className="col-sm-9">{props.multa.folio}</dt>
                            <dd className="col-sm-3">Fecha creada</dd>
                            <dt className="col-sm-9">{moment(props.multa.updated_at).format("DD-MMM-YYYY HH:mm")}</dt>  
                            <dd className="col-sm-3">Observación</dd>
                            <dt className="col-sm-9">{props.multa.observacion}</dt>
                            <dd className="col-sm-3">Estado pago</dd>
                            <dt className="col-sm-9">{props.multa.pagoStatus}</dt>                      
                        </dl>
                    </Col> 
                    <Col xs lg={{span: 3, offset: 3}}>
                        <Form.Group>
                            <Form.Label>Fecha pago</Form.Label>
                            <DatePicker className="form-control"
                                showPopperArrow={false}
                                selected={props.fechaPago}
                                autoComplete="off"
                                dateFormat="dd-MM-yyyy"
                                onChange={date => {
                                    if(date===null){
                                        props.setFechaPago(new Date())
                                    }else{
                                        props.setFechaPago(date)
                                    }                                                                
                                }}
                            />  
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Caja</Form.Label>
                            <Form.Control as="select" size="sm"
                                value={props.caja}
                                onChange={e=>props.setCaja(e.target.value)}
                            >
                                {
                                    props.cajaOpt.map((item,i)=>(
                                        <option key={i} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Método de pago</Form.Label>
                            <Form.Control as="select" size="sm"
                                value={props.metodoPago}
                                onChange={e=>props.handleChangeMetodoPago(e.target.value)}
                            >
                                {
                                props.metodoPagoOpt.map((item, i)=>(
                                    <option key={i} value={item.id}>{item.name}</option>
                                ))
                            }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Observación</Form.Label>
                            <Form.Control size="sm"
                                type="text"
                                value={props.referencia}
                                onChange={e=>props.setReferencia(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>No. cuenta</Form.Label>
                            <InputMask
                                className={`${!props.errorNoCuenta && 'error'} form-control form-control-sm`} 
                                mask="9999" 
                                onChange={e=>{
                                    if(e.target.value === ""){
                                        props.setErrorNoCuenta(false)
                                    }else{
                                        props.setErrorNoCuenta(true)
                                    }
                                    props.setNoCuenta(e.target.value)
                                }}
                                value={props.noCuenta}
                            />
                        </Form.Group>
                    </Col>                    
                </Row>
                <Row>
                    <Col xs lg>
                        <Card>
                            <Card.Body>
                                <Card.Title>Detalle</Card.Title>
                                {
                                    props.multa.pagosMultas.filter(el=>el.pagoStatus==='recibido').length > 0 &&
                                    <Row className="mb-4">
                                        <Col>
                                            <Accordion>
                                                <Card>
                                                    <Card.Header>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                            Historial de pagos    
                                                        </Accordion.Toggle>
                                                        <span>Total: <span className="font-weight-bold mr-2">{formatNumber(props.multa.costo)}</span></span>
                                                        </div>
                                                       
                                                        
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey="0">
                                                        <Card.Body>
                                                                <ul>
                                                                    {
                                                                        props.multa.pagosMultas.map((item, i)=>(
                                                                            <li key={i} className={item.pagoStatus==='cancelado' ? 'text-danger' : ''}>
                                                                                {moment(item.updated_at).format("DD-MMM-YYYY")}{' - '}
                                                                                <strong><NumberFormat
                                                                                    value={item.pagado}
                                                                                    displayType="text"
                                                                                    fixedDecimalScale={true}
                                                                                    decimalScale={2}
                                                                                    prefix="$"
                                                                                /></strong> {item.pagoStatus==="cancelado" && ' - CXLD'}
                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>

                                                                {
                                                                    props.multa.condonadasMultas.length > 0 && 
                                                                    <>
                                                                        <h6>Pagos Condonados</h6>
                                                                        <ul>
                                                                            {
                                                                                props.multa.condonadasMultas.map((item,i)=>(
                                                                                    <li key={i}>{moment(item.created_at).format("DD-MMM-YYYY")}{' - '}
                                                                                        <strong>{formatNumber(item.montoCondonado)}</strong>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </>
                                                                }
                                                                
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Accordion>
                                        </Col>
                                    </Row>
                                }
                                <Row>                                    
                                    <Col xs lg="6">
                                        <p>{props.multa.tipoMulta.name}</p>
                                        <p>{props.multa.tipoMulta.descripcion}</p>
                                    </Col>
                                    <Col xs lg="6">
                                        <div className="text-right">
                                            <Button variant="link" size="sm" onClick={handleShow}>Aplicar descuento</Button>
                                            <h2><NumberFormat 
                                                value={totalPagar} 
                                                prefix="$" 
                                                displayType="text"
                                                fixedDecimalScale={true}
                                                decimalScale={2}
                                                />
                                            </h2>
                                            <span>Monto a pagar</span>
                                            <Form.Control className={`${!props.valid && "error"} input-pay mb-2`} size="lg" 
                                                type="number" min="1" 
                                                value={props.input} 
                                                onChange={e=>{
                                                    var regex = /^[0-9\s]*$/;
                                                    if(e.target.value !== "" && regex.test(e.target.value)){
                                                        props.setInput(parseInt(e.target.value))
                                                    }else if(e.target.value === ""){
                                                        props.setInput(e.target.value)
                                                    }else{
                                                        props.setInput(0)
                                                    }
                                                    
                                                }}
                                            />
                                            {!props.valid && <div className="text-danger mb-2"><small>Campo inválido</small></div>}
                                            <Button variant="primary"
                                                disabled={calcAmount(props.multa.costo, props.multa.pagosMultas) === 0} 
                                                onClick={props.handlePayment}>Pagar</Button>
                                        </div>
                                        
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        
                    </Col>
                </Row>
            </Card.Body>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Descuento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs="12" lg="6" className="mb-3">
                            <Form.Label>Porcentaje a aplicar</Form.Label>
                            <Form.Control 
                                type="number"
                                min="0"
                                value={props.applyDescuento}
                                onChange={e=>props.setApplyDescuento(e.target.value)}
                                placeholder="Porcentaje descuento"
                            />
                        </Col>
                        <Col xs="12" lg="12">
                        <Form.Control
                                type="text"
                                value={props.autorizado}
                                onChange={e=>props.setAutorizado(e.target.value)} 
                                placeholder="Código de autorización"
                            />
                        </Col>                        
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" size="sm" onClick={handleAccept}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}