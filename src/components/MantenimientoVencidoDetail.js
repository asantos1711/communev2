import React, { useState } from 'react'
import { Button, Card, Col, Container, Dropdown, Form, Jumbotron, Row, Table } from 'react-bootstrap';
import { FaDownload, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';
import Post from '../service/Post';
import { REPORTE_MTTO_VENCIDO } from '../service/Routes';
import { formatNumber } from '../utils/formatNumber';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function MantenimientoVencidoDetail({access_token}){
    const [isSubmiting, setSubmiting] = useState(false)
    const [atrasado, setAtrasado] = useState("30")
    const[items, setItems] = useState([])

    const onClickSearch = () =>{
        setSubmiting(true)
        const d = {
            atrasado: atrasado
        }
        Post({url: REPORTE_MTTO_VENCIDO, data: d, access_token: access_token, header: true})
        .then(response=>{
           //console.log(response)
            setItems(response.data)
            setSubmiting(false)
        })
        .catch(error=>{
            setSubmiting(false)
            toast.error("Ocurrió un error. Intente más tarde o contacte con el adminsitrador", {autoClose: 5000})
        })
    }

   
    const downloadPDF = e =>{
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text(`Mantenimiento vencido ${atrasado === '100' ? '90 días y más' : atrasado+' días'}`, 40, 30)      
        doc.setFontSize(10);        
        doc.autoTable({
            html:'#tableCC',
            theme: 'striped',
            startY: 55
        });        
        doc.save(`mantenimiento_vencido.pdf`)
    }

    return(
        <div>
            {isSubmiting && loaderRequest()}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Mantenimiento vencido</Card.Title>
                            <Dropdown.Divider />
                            <Row>
                                <Col xs="9" lg="3">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="1" className="pr-0"></Form.Label>
                                        <Col sm="11" className="pl-0">
                                            <Form.Control 
                                                value={atrasado}
                                                onChange={e=>setAtrasado(e.target.value)}
                                                as="select"
                                            >
                                                <option value="30">30 días</option>
                                                <option value="60">60 días</option>
                                                <option value="90">90 días</option>
                                                <option value="100">90 días o más</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col xs="3" lg="2">
                                    <Button variant="outline-primary" onClick={e=>onClickSearch()}><FaSearch /></Button>
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
                                items.length===0 ? <Row><Col><Jumbotron fluid className="text-center"><Container>No existen datos que mostrar</Container></Jumbotron></Col></Row>
                            :
                            <Row>
                               <Col xs="12" lg="12">
                                    <div className="d-flex flex-row-reverse bd-highlight"> 
                                        <div className="p-2 bd-highlight"><Button variant="outline-secondary" size="sm" onClick={()=>downloadPDF()}><FaDownload /></Button></div>                                        
                                    </div>
                               </Col>
                               <Col className="h-600 mb-2" xs="12" lg="12">
                                    <Table size="sm" hover responsive id="tableCC">
                                        <thead>
                                            <tr>
                                                <th width='15%'>Referencia</th>
                                                <th width='20%'>Asociado</th>
                                                <th width='55%'>Dirección</th>
                                                <th width='10%' className="text-center">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                items.map((item, i)=>(
                                                    <tr key={i}>
                                                        <td width="15%">{item.referencia}</td>
                                                        <td width='20%'>{item.asociado}</td>
                                                        <td width="55%">{item.direccion}</td>
                                                        <td width="10%" className="text-center">{formatNumber(item.monto)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}