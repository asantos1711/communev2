import React, { useEffect, useRef, useState } from 'react'
import { Card, Row, Col, Dropdown, Form, Button, Table, Jumbotron, Container } from 'react-bootstrap'
import DatePicker, { registerLocale } from "react-datepicker"
import moment from 'moment'
import es from "date-fns/locale/es"
import { FaSearch, FaDownload } from 'react-icons/fa'
import { formatNumber } from '../utils/formatNumber'
import Post from '../service/Post'
import { CAJA_GET_ACTIVE, CORTE_CAJA, METODO_PAGO_GET, RESIDENCIAL_GET_DEFAULT } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import { sumPagoTotalCaja } from '../utils/sumPagoTotalCaja'
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import GetAll from '../service/GetAll'
import { getLogoResidencial } from '../utils/getLogoResidencial'

registerLocale("es", es)

export default function CorteCajaDetail(props){
    const [isSubmiting, setSubmiting] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const[items, setItems] = useState([])
    const [caja, setCaja] = useState('')
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [metodoPago, setMetodoPago] = useState("0")
    const imgRef = useRef(null)

    const [info, setInfo] = useState(null)
    const [cajaOpt, setCajaOpt] = useState([])

    useEffect(()=>{
        let urls = [METODO_PAGO_GET, RESIDENCIAL_GET_DEFAULT, CAJA_GET_ACTIVE]
        GetAll({urls: urls, access_token: props.access_token}) 
        .then(response=>{
            //console.log(response)
            setMetodoPagoOpt(response[0].data)
            setInfo(response[1].data.data)
            setCajaOpt(response[2].data)
        })
        .catch(error=>{
            //console.log(error)
        })
    },[])

    const corteCaja = e =>{
        //console.log('entro')
        const d ={
            fechaInicial: moment(startDate).format('YYYY-MM-DD'),
            fechaFinal: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
            metodoPago: metodoPago,
            caja: {id: caja}
        }
        setSubmiting(true)

        Post({url: `${CORTE_CAJA}`, data: d, access_token: props.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setItems(response.data.data)
            setSubmiting(false)
        })
        .catch(error=>{
            setSubmiting(false)
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
        //console.log('pdf')
        var doc = new jsPDF('p', 'mm', 'a4', {putOnlyUsedFonts: true});

        let mp = "Todos";
        if(metodoPago!=="0"){
            mp = metodoPagoOpt.filter(item=>item.id==metodoPago).map(item=>item.name)[0]
        }

        if(caja===""){
            let noCuenta = cajaOpt.map(el=>el.noCuenta)
            let noConvenio = cajaOpt.map(el=>el.noConvenio)
            info['noCuenta'] = noCuenta.join(' / ')
            info['noConvenio'] = noConvenio.join(' / ')            
        }
        
        if(imgRef.current){
            doc.addImage(imgRef.current, "JPEG", 14, 12, 40, 40);
        }        

        doc.setFontSize(16)
        doc.text(info.nombreResidencial, 100, 35)
        doc.text("REPORTE DE CORTE DE CAJA", 100, 41)

        doc.setFontSize(12)
        doc.text(`RANGO DE FECHAS: ${moment(startDate).format("DD-MM-YYYY")} al ${moment(endDate).format("DD-MM-YYYY")}`, 14, 55)
        doc.text(`No. De Convenio: ${info.noConvenio}`, 14, 60)
        doc.text(`No. De Cuenta: ${info.noCuenta}`, 14, 65)

        
        
        doc.text(`Método de pago: ${mp}`, 14, 70)

        const options2 = { style: 'currency', currency: 'USD' };
        const numberFormat2 = new Intl.NumberFormat('en-US', options2);        
        let col = ['Fecha', 'Referencia', "Descripción", 'Monto'];
        let rows = []
        items.forEach(item=>{
            let temp = [
                    {content: `${moment(item.fecha).format("DD-MM-YYYY")}`, styles: { cellWidth: 30 } }, 
                    item.referenciaLote, 
                    item.descripcion,
                    {content: `${numberFormat2.format(item.pago)}`, styles: { cellWidth: 30 } }]
            rows.push(temp)
        })

        doc.autoTable({
            theme: 'striped',
            head: [col],
            body: rows,
            startY: 80
        })
        doc.autoTable({
            theme: 'striped',
            body: [
                [
                 { content: 'Total', colSpan: 3, styles: { halign: 'left' } },  
                 {content: `${numberFormat2.format(sumPagoTotalCaja(items))}`, styles: { cellWidth: 30 } }
                ],               
              ],
            startY: doc.autoTable.previous.finalY + 5,
        });
        doc.setFontSize(10)
        doc.text(`Fecha de impresión ${moment().format("DD-MM-YYYY HH:mm")}`, 14, doc.autoTable.previous.finalY + 17);
        doc.save(`corte_caja_${caja==='Ambas' ? 'caja_1_caja_2' : caja==='Caja 1' ? 'caja_1' : 'caja_2'}_${moment(startDate).format("DD-MM-YYYY")}_${moment(endDate).format("DD-MM-YYYY")}.pdf`)
    }


    return(
        <div>
            {isSubmiting && loaderRequest()}
            <Row className="mb-4">
                {
                   info && <img ref={imgRef}  src={getLogoResidencial(info.residencial)} alt="" id="rioLogo" style={{display: 'none'}}/>
                }
            
                <Col> 
                    <Card className="shadow">
                            <Card.Body>
                                <Card.Title>Corte de caja</Card.Title>
                                <Dropdown.Divider />
                                <Row>
                                    <Col xs lg="3">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="3" className="pr-0">Caja</Form.Label>
                                            <Col sm="9" className="pl-0">
                                                <Form.Control 
                                                    value={caja}
                                                    onChange={e=>{
                                                        setCaja(e.target.value)
                                                        //update info data caja
                                                        if(e.target.value!==''){
                                                            let c = cajaOpt.filter(el=>el.id===parseInt(e.target.value))[0]
                                                            setInfo(prev=>({
                                                                ...prev,
                                                                noCuenta: c.noCuenta,
                                                                noConvenio: c.noConvenio
                                                            }))
                                                        }
                                                        
                                                    }}
                                                    as="select"
                                                >
                                                    <option value="">Todas</option>
                                                    {   
                                                        cajaOpt.map((item,i)=>(
                                                            <option value={item.id} key={i}>{item.name}</option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="3">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="5" className="pr-0">Método de pago</Form.Label>
                                            <Col sm="7" className="pl-0">
                                                <Form.Control 
                                                    value={metodoPago}
                                                    onChange={e=>setMetodoPago(e.target.value)}
                                                    as="select"
                                                >
                                                    <option value="0">Todos</option>
                                                    {
                                                        metodoPagoOpt.map((item,i)=>(
                                                            <option key={i} value={item.id}>{item.name}</option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="2">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="3" className="pr-0">Desde</Form.Label>
                                            <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="dd-MM-yyyy"
                                                locale="es"
                                                selectsStart
                                                startDate={startDate}
                                                endDate={endDate}
                                                selected={startDate}
                                                onChange={date => handleStartDate(date)}
                                            />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="2">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column sm="3" className="pr-0">Hasta</Form.Label>
                                            <Col sm="9" className="pl-0">
                                            <DatePicker className="form-control"
                                                dateFormat="dd-MM-yyyy"
                                                locale="es"
                                                selectsEnd
                                                startDate={startDate}
                                                endDate={endDate}
                                                minDate={startDate}

                                                selected={endDate}
                                                onChange={date => handleEndDate(date)} 
                                            />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col xs lg="2">
                                        <Button variant="outline-primary" onClick={e=>corteCaja()}><FaSearch /></Button>{' '}
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
                            items.length===0 ? <Row><Col><Jumbotron fluid className="text-center"><Container>Seleccione nuevas fechas para generar corte de caja</Container></Jumbotron></Col></Row>
                            :
                            <Row>
                               <Col xs="12" lg="12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{`Rango de fechas: ${moment(startDate).format("DD-MM-YYYY")} al ${moment(endDate).format("DD-MM-YYYY")} `}</span>
                                        <ul className="list-inline">                                        
                                            <li className="list-inline-item"><Button variant="outline-secondary" size="sm" onClick={downloadPDF}><FaDownload /></Button></li>
                                        </ul>
                                    </div>
                               </Col>
                               <Col className="h-600 mb-2" xs="12" lg="12">
                                    <Table size="sm" hover responsive id="tableCC">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Referencia</th>
                                                <th>Descripción</th>
                                                <th className="text-center">Factura</th>
                                                <th className="text-center">Método de pago</th>
                                                {/* <th className="text-center">Referencia</th> */}
                                                <th className="text-center">Pago</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                items.map((item, i)=>(
                                                    <tr key={i}>
                                                        <td width="10%">{moment(item.fecha).format("DD-MM-YYYY")}</td>
                                                        <td width="10%">{item.referenciaLote}</td>
                                                        <td width='35%'>{item.descripcion}</td>
                                                        <td width="10%" className="text-center">
                                                            {item.folio_factura}
                                                            {/* <span className={`badge ${setBagdeStatusPayment(item.status)}`}>{item.status}</span> */}
                                                        </td>
                                                        <td width="25%" className="text-center">{item.metodoPago}</td>
                                                        {/* <td width="10%" className="text-center">{item.referencia}</td> */}
                                                        <td width='10%' className="text-center">{formatNumber(item.pago)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>                                        
                                    </Table>
                                </Col>
                                <Col xs="12" md="12">
                                <Table size="sm" responsive>                                        
                                        <tfoot>
                                            <tr>
                                                <th colSpan="2">Total</th>
                                                <th width='10%' className="text-center">{formatNumber(sumPagoTotalCaja(items))}</th>
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