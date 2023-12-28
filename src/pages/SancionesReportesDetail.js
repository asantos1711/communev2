import React, { useState, useEffect } from 'react'
import moment from 'moment'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Row, Col, Card, Dropdown, Form, Button, Jumbotron, Container, Table } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'
import { FaSearch, FaDownload } from 'react-icons/fa'
import Get from '../service/Get'
import { TIPO_MULTA_GET, REPORTE_TIPO_SANCION } from '../service/Routes'
import Post from '../service/Post'
import { getMonto } from '../utils/getMonto'
import { formatNumber } from '../utils/formatNumber'
import { getPeriodo } from '../utils/getPeriodo'
import { getMontoTotal } from '../utils/getMontoTotal'

registerLocale("es", es)


export default function SancionesReportesDetail({access_token}){
    const [isSubmiting, setSubmiting] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const[items, setItems] = useState([])
    const [tipoSanciones, setTipoSanciones] = useState([])
    const [sancion, setSancion] = useState("")
    const [listPeriodos, setListPeriodos] = useState([])
    const [listStatus, setListStatus] = useState([])

    useEffect(()=>{
        Get({url: TIPO_MULTA_GET, access_token: access_token})
        .then(response=>{
            //console.log(response)
            setTipoSanciones(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    const sancionesReport = e =>{
        //console.log('entro')
        const d ={
            fechaInicial: moment(startDate).startOf('month').format('YYYY-MM-DD'),
            fechaFinal: moment(endDate).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
            id:sancion
        }
        console.log(d)
        setSubmiting(true)

        Post({url: `${REPORTE_TIPO_SANCION}`, data: d, access_token: access_token, header: true})
        .then(response=>{
            //console.log(response)
            setItems(response.data.data)
            setSubmiting(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }

    const handleStartDate = date =>{
        if(date===null || date===""){
            setStartDate(new Date())
        }else{
            setStartDate(date)
        }        
        if(date>endDate){
            setEndDate(date)
        }
    }
    const handleEndDate = date =>{
        if(date===null || date===""){
            setEndDate(startDate)
        }else{
            setEndDate(date)
        }
    }

    const downloadPDF = () =>{
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text(`Reporte por sancion: ${tipoSanciones.filter(item=>item.id==sancion).map(item=>item.name)[0]}`, 40, 50)        
        doc.setFontSize(10);
        doc.text(`Rango de fechas: ${moment(startDate).format("MMMM-YYYY")} a ${moment(endDate).format("MMMM-YYYY")}`, 310, 70)
        doc.autoTable({
            html:'#tableCC',
            theme: 'striped',
            startY: 75
        });
        doc.save(`reporte_sancion_${tipoSanciones.filter(item=>item.id==sancion).map(item=>item.name)[0]}_${moment(startDate).format("MMMM-YYYY")}_${moment(endDate).format("MMMM-YYYY")}.pdf`)
    }

    return(
        <div>
            {isSubmiting && loaderRequest()}
            <Row className="mb-4">
                <Col> 
                    <Card className="shadow">
                            <Card.Body>
                                <Card.Title>Reporte por tipo de sanción</Card.Title>
                                <Dropdown.Divider />
                                <Row>
                                    <Col xs lg="4">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="4" className="pr-0">Tipo de sanción</Form.Label>
                                            <Col sm="8" className="pl-0">
                                                <select className="form-control"
                                                    value={sancion}
                                                    onChange={e=>setSancion(e.target.value)}
                                                >
                                                    <option value="">Seleccionar opción</option>
                                                    {
                                                        tipoSanciones.map((item, i)=>(
                                                            <option key={i} value={item.id}>{item.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="3">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="3" className="pr-0">Desde</Form.Label>
                                            <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="MMMM-yyyy"
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
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="3" className="pr-0">Hasta</Form.Label>
                                            <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="MMMM-yyyy"
                                                locale="es"
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}

                                                selected={endDate}
                                                onChange={date => handleEndDate(date)} 
                                                showMonthYearPicker
                                            />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="2">
                                        <Button variant="outline-primary" onClick={e=>sancionesReport()}><FaSearch /></Button>{' '}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                <Card className="shadow">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <h6>Detalle</h6>                            
                        </div>                                
                        <Dropdown.Divider />
                        {
                            items.length===0 ? <Row><Col><Jumbotron fluid className="text-center"><Container>No hay resultados que mostrar. Seleccione nuevas fechas por favor</Container></Jumbotron></Col></Row>
                            :
                            <Row>
                               <Col xs="12" lg="12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{`Rango de fechas: ${moment(startDate).format("MMMM-YYYY")} al ${moment(endDate).format("MMMM-YYYY")} `}</span>
                                        <ul className="list-inline">                                        
                                            <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={downloadPDF}><FaDownload /></Button></li>
                                        </ul>
                                    </div>
                               </Col>
                               <Col className={`${items.length > 10 && 'h-600'} mb-2`} xs="12" lg="12">
                                    <Table size="sm" hover responsive id="tableCC">                                        
                                        <thead>
                                            <tr>
                                                <th>Periódo</th>
                                                <th style={{textAlign: 'center'}}>Pagado</th>
                                                <th style={{textAlign: 'center'}}>Vigente</th>
                                                <th style={{textAlign: 'center'}}>Condonado</th>
                                                <th style={{textAlign: 'center'}}>Cancelado</th> 
                                                <th style={{textAlign: 'center'}}>Incompleto</th>                                               
                                            </tr>
                                        </thead>
                                        <tbody> 
                                            {
                                                items.map((item,i)=>(
                                                    <tr key={i}>
                                                        <td>{getPeriodo(item.periodo)}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(getMonto(item.statusMonto, "pagado"))}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(getMonto(item.statusMonto, "vigente"))}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(getMonto(item.statusMonto, "condonado"))}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(getMonto(item.statusMonto, "cancelado"))}</td>
                                                        <td style={{textAlign: 'center'}}>{formatNumber(getMonto(item.statusMonto, "incompleto"))}</td>
                                                    </tr>
                                                ))
                                            }                                            
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>Total</th>
                                                <th style={{textAlign: 'center'}}>{formatNumber(getMontoTotal(items, "pagado"))}</th>
                                                <th style={{textAlign: 'center'}}>{formatNumber(getMontoTotal(items, "vigente"))}</th>
                                                <th style={{textAlign: 'center'}}>{formatNumber(getMontoTotal(items, "condonado"))}</th>
                                                <th style={{textAlign: 'center'}}>{formatNumber(getMontoTotal(items, "cancelado"))}</th>
                                                <th style={{textAlign: 'center'}}>{formatNumber(getMontoTotal(items, "incompleto"))}</th>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>
                        }
                    </Card.Body>
                </Card>
                </Col>
                
            </Row>
        </div>        
    )


}