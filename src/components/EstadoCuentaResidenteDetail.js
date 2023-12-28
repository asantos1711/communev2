import React, { useEffect, useState } from 'react'
import { Card, Dropdown, Row, Col, Form, Button, Jumbotron, Container, Table, OverlayTrigger, Popover, Modal } from 'react-bootstrap'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import moment from 'moment'
import { RiMailSendLine } from 'react-icons/ri'
import { formatNumber } from '../utils/formatNumber'
import Post from '../service/Post'
import { RESIDENTE_EMAIL, RESIDENTE_FOR_ESTADO_CUENTA_DETAIL } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import { calcCargosEstadoCuenta } from '../utils/calcCargosEstadoCuenta'
import { calcAbonosEstadoCuenta } from '../utils/calcAbonosEstadoCuenta'
import { FaDownload, FaCalendarCheck, FaMapMarkerAlt } from 'react-icons/fa'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from 'react-toastify'
import { getUrlPago } from '../utils/getUrlPago'
import { Link } from 'react-router-dom'
import WaveLoading from 'react-loadingg/lib/WaveLoading'
import Get from '../service/Get'

registerLocale("es", es)

export default function EstadoCuentaResidenteDetail(props){
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1))
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 1))
    const[items, setItems] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [variante, setVariante] = useState(0)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [show, setShow] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false)
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [hidden, setHidden] = useState(false)

    const handleStartDate = date =>{
        //console.log(date)
        setStartDate(date)
        if(date>endDate){
            setEndDate(date)
        }
    }

    useEffect(()=>{
       handleEstadoCuenta()
    },[])

    const handleEstadoCuenta = e =>{
        const desde = moment(startDate).startOf('month').format("YYYY-MM-DD")
        const hasta = moment(endDate).endOf('month').format('YYYY-MM-DD HH:mm:ss')
        const data = {
            fechaInicial: desde,
            fechaFinal: hasta,
            id: variante === 0 ? props.lote.direccion.id_lote : variante, 
            variante: variante,
            email: false
        }

        //console.log(data)
        setLoading(true)
        Post({url: RESIDENTE_FOR_ESTADO_CUENTA_DETAIL, data: data, access_token: props.access_token, header: true})
        .then(response=>{
            setItems(response.data.data)
            //console.log(response)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
            toast.error("Ocurrió un error en el servidor. Intente más tarde o contacte con el administrador", {autoClose: 8000})
            setLoading(false)
        })
    }

    const handleVariant = (item, i) =>{
        setActiveIndex(i)
        setVariante(item)

        if(item === 0){
            props.setDirections(props.directionDefault)
        }else{
            let aux = props.directionDefault
            props.setDirections(aux.filter(a => a.id_lote===item))
        }
    }

    const drawCell = data =>{
        //console.log(row)
        // console.log(data)
        // if (data.section === 'body' && data.column.index === 5) {
        //     data.doc.setTextColor('red')
        // }
    }

    const options2 = { style: 'currency', currency: 'USD' };
    const numberFormat2 = new Intl.NumberFormat('en-US', options2);
    const downloadPDF = e =>{
        setHidden(true)
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text(`Estado de cuenta`, 40, 30)
        doc.text(`${props.lote.direccion.name}`, 40, 50)        
        doc.setFontSize(10);
        doc.text(`${moment(startDate).startOf('month').format("DD-MMM-YYYY")} al ${moment(endDate).endOf('month').format("DD-MMM-YYYY")}`, 435, 65)
        const headers=[["Fecha","Descripción","Factura","Monto", "Pagado", ""]]
        const data = items.map(elt=> [
                elt.fecha,
                elt.descripcion,
                elt.folio, 
                elt.cargo,
                elt.estado === 'cancelado' ? 0 : elt.abono, 
                elt.estado === 'cancelado' ? 'CXLD' : elt.estado === 'pagado' ? 'PAGD' : 'VIGT' 
            ]);
        
        doc.autoTable({
            theme: 'striped',
            head: headers,
            body: data,
            willDrawCell: drawCell,
            startY: 80
        });
        var cargos = calcCargosEstadoCuenta(items)
        var abono = calcAbonosEstadoCuenta(items)
        var deudas = calcCargosEstadoCuenta(items)-calcAbonosEstadoCuenta(items) > 0 ? calcCargosEstadoCuenta(items)-calcAbonosEstadoCuenta(items) : "0"
        doc.autoTable({
            theme: 'plain',
            body: [
                [
                 { content: 'Total', colSpan: 2, styles: { halign: 'left' } },  
                 {content: `${numberFormat2.format(cargos)}`, styles: { halign: 'center', cellWidth: 70 } }, 
                 {content: `${numberFormat2.format(abono)}`, styles: { halign: 'center', cellWidth: 70 } }
                ],               
              ],
            startY: doc.autoTable.previous.finalY + 14,
        });
        doc.autoTable({
            theme: 'plain',
            body: [                
                [
                 {content: 'Deuda', colSpan: 3, styles: { halign: 'left' } }, 
                 {content: `${numberFormat2.format(deudas)}`, styles: { halign: 'center', cellWidth: 70, textColor: [220, 53, 69]  } },  
                ],                
              ],
            startY: doc.autoTable.previous.finalY + 5,
        });
        doc.save(`estado_cuenta_${props.lote.direccion.name}_${moment(startDate).startOf('month').format("DD-MM-YYYY")}_${moment(endDate).endOf('month').format("DD-MM-YYYY")}.pdf`)
        setHidden(false)
    }

    const handleClose = () => setShow(false);
    const commonStyle = {
        margin: 'auto',
        position: 'initial',
        left: 0,
        right: 0,
        top:10,
        bottom:10
    };

    const showEmail = () =>{
        //setSubmiting(true)
        //setIdFactura(id)
        Get({url: `${RESIDENTE_EMAIL}/${props.id}`, access_token: props.access_token})
        .then(response=>{
            //console.log(response)
            setEmailDefault(response.data)
            setShow(true)
            //setSubmiting(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }

    const sendEmail = () =>{
        //console.log(idFactura)
        setSendingEmail(true)
        const desde = moment(startDate).startOf('month').format("YYYY-MM-DD")
        const hasta = moment(endDate).endOf('month').format('YYYY-MM-DD HH:mm:ss')
        const data = {
            fechaInicial: desde,
            fechaFinal: hasta,
            id: variante === 0 ? props.lote.direccion.id_lote : variante, 
            variante: variante,
            email: true,
            correoElectronico: emailDefault,
            correoAdicional: emailPlus
        }

        Post({url: RESIDENTE_FOR_ESTADO_CUENTA_DETAIL, data: data, access_token: props.access_token, header: true})
        .then(response=>{
            //setItems(response.data.data)
            //console.log(response)
            setSendingEmail(false)
            setEmailPlus("")
            setShow(false) 
            toast.success("Se ha enviado el correo electrónico satisfactoriamente", {autoClose: 5000})    
        })
        .catch(error=>{
            //console.log(error)
            setSendingEmail(false)
            setEmailPlus("")
            setShow(false)
            toast.error("No se ha podido enviar el correo electrónico. Intente más tarde", {autoClose: 5000})
        })
    }


    return(
        <Card className="shadow">
            {isLoading && loaderRequest()}
            <Card.Body>
                <h3>Detalle
                    <ul className="list-inline">
                        <li className="list-inline-item"><Button variant={activeIndex === -1 ? "primary" : "outline-primary"} size="sm" onClick={e => handleVariant(0, -1)}>Todos</Button></li>
                        {
                            props.lote.direccion_child!=null &&
                            props.lote.direccion_child.map((item,i)=>(
                                <li className="list-inline-item" key={i}>
                                    <OverlayTrigger
                                        trigger={['hover', 'focus']}
                                        key='top'
                                        placement='top'
                                        overlay={
                                            <Popover id={`popover-positioned-top`}>
                                            <Popover.Content>
                                                <div><FaCalendarCheck className="mb-1" />{' '} 
                                                    {item.fecha_entrega === null ? "No entregado" : moment(item.fecha_entrega).format('DD-MM-YYYY')}</div>
                                                <div><FaMapMarkerAlt className="mb-1" /> {item.direccion}</div>
                                            </Popover.Content>
                                            </Popover>
                                        }
                                        >
                                        <Button variant={activeIndex === i ? "primary" : "outline-primary"}
                                            size="sm" onClick={e =>handleVariant(item.id_lote, i)}
                                        >{item.referencia}</Button>
                                        </OverlayTrigger>
                                </li>
                            ))
                        }
                    </ul>
                </h3>
                <Dropdown.Divider />
                <Row className="mb-4">
                    <Col xs lg="3">
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Desde
                            </Form.Label>
                            <Col sm="9">
                            <DatePicker className="form-control"
                                dateFormat="MMMM/yyyy"
                                locale="es"
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                selected={startDate}
                                onChange={date => handleStartDate(date)}
                                showMonthYearPicker
                            />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col xs lg="3">
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                Hasta
                            </Form.Label>
                            <Col sm="9">
                            <DatePicker className="form-control"
                                dateFormat="MMMM/yyyy"
                                locale="es"
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}

                                selected={endDate}
                                onChange={date => setEndDate(date)}                                
                                showMonthYearPicker
                            />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col xs lg="3">
                        <Button variant="outline-primary" onClick={handleEstadoCuenta}>Ver</Button>
                    </Col>
                </Row>
                    {
                        items.length===0? <Row><Col><Jumbotron fluid className="text-center"><Container>Seleccione nuevas fechas para generar el estado de cuenta</Container></Jumbotron></Col></Row>
                        : <Row>
                            <Col xs="12" lg="12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0">{`Estado cuenta: ${moment(startDate).startOf('month').format("DD-MMM-YYYY")} al ${moment(endDate).endOf('month').format("DD-MMM-YYYY")}`}</h6>
                                    <ul className="list-inline">
                                        <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={e=>showEmail()}><RiMailSendLine /></Button></li>
                                        <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={e=>downloadPDF()}><FaDownload /></Button></li>
                                    </ul>
                                </div>
                                <Dropdown.Divider />
                            </Col>
                            <Col className="h-600 mb-2" xs="12" lg="12">
                                <Table size="sm" hover responsive id="tableEC">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Descripción</th>
                                            <th style={{textAlign: 'center'}}>Factura</th>
                                            <th style={{textAlign: 'center'}}>Monto</th>
                                            <th style={{textAlign: 'center'}}>Pagado</th>
                                            <th style={{textAlign: 'center'}}></th>
                                            <th style={{display: 'none'}}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map((item, i)=>(
                                                <tr key={i} 
                                                    className={(item.estado === 'vigente' || item.estado==='incompleto') ? 'bg-red-light' : 
                                                    item.estado==='cancelado' ? 'line-cancelado' : ''}>
                                                    <td width="10%">{item.fecha && moment(item.fecha).format("DD-MM-YYYY")}</td>
                                                    <td width='55%'>{item.descripcion}</td>
                                                    <td width="10%" style={{textAlign: 'center'}}>
                                                        { item.folio && <Link className="text-dark" to={`/factura/${item.facturaId}`}>{item.folio}</Link>}</td>
                                                    <td width='10%' style={{textAlign: 'center'}}>{formatNumber(item.cargo)}</td>
                                                    <td width='10%' style={{textAlign: 'center'}}>
                                                        {
                                                            item.estado==='cancelado' ? "$0.00" :  formatNumber(item.abono)
                                                        }
                                                    </td>
                                                    <td width="5%"style={{opacity: hidden ? 0 : 1}}>
                                                        {
                                                            item.estado==='cancelado' ? <span className="text-danger">CXLD</span> :
                                                            (item.estado === 'vigente' || item.estado==='incompleto') &&
                                                            <Link className="text-dark" to={getUrlPago(item.tipo, item.identificador)}>Pagar</Link>
                                                        }                                                         
                                                    </td>
                                                    <td style={{display: 'none'}}>{item.estado}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs="12" lg="12">
                                <Table size="sm" responsive id="tableTotalEC">
                                    <thead>
                                        <tr>
                                            <th colSpan="3" className="bt-0">Total</th>
                                            <th width='10%' className="bt-0 text-center">{formatNumber(calcCargosEstadoCuenta(items))}</th>
                                            <th width='10%' className="bt-0 text-center">{formatNumber(calcAbonosEstadoCuenta(items))}</th>
                                            <th width="5%"></th>
                                        </tr>
                                        <tr>
                                            <th colSpan="4">Deuda</th>
                                            <th width='10%' className="text-center">
                                                {
                                                    calcCargosEstadoCuenta(items)-calcAbonosEstadoCuenta(items) > 0
                                                    ? <span className="text-danger">{formatNumber(calcCargosEstadoCuenta(items)-calcAbonosEstadoCuenta(items))}</span>
                                                    : "$0.00"
                                                }                                                
                                            </th>
                                            <th width="5%"></th>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                          </Row>
                    }
            </Card.Body>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${sendingEmail && 'h-100p'}`}>
                    {
                      sendingEmail ?
                        <div className="loadModal">
                        <h6 style={{color: '#7186ed'}}>Enviando correo electrónico</h6>
                        <WaveLoading style={commonStyle} color={"#6586FF"} />
                        </div>
                        :<div>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                    Correo electrónico
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control plaintext readOnly defaultValue={emailDefault === "" ? 'No existe' : emailDefault} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="4">
                                    Adicional
                                </Form.Label>
                                <Col sm="8">
                                <Form.Control value={emailPlus} onChange={e=>setEmailPlus(e.target.value)}/>
                                </Col>
                            </Form.Group>
                        </div>
                    }                    
                </Modal.Body>
                <Modal.Footer>                
                <Button variant="outline-primary" onClick={sendEmail} disabled={sendingEmail}>Enviar</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )

}