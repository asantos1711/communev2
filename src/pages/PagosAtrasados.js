import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Dropdown, Form, Jumbotron, Row, Table } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { authContext } from '../context/AuthContext';
import * as jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatNumber } from '../utils/formatNumber';
import TableSkeleton from '../loaders/TableSkeleton';
import Get from '../service/Get';
import { REPORTE_PAGOS_ATRASADOS } from '../service/Routes';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment'

export default function PagosAtrasados(){
    const [opt, setOpt] = useState('mantenimiento');
    const [items, setItems] = useState([])
    const {auth} = useContext(authContext)
    const [isLoading, setLoading] = useState(true)

    useEffect(()=>{
        setLoading(true)
        Get({url: `${REPORTE_PAGOS_ATRASADOS}/${opt}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data)
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            console.log(error);
            toast.error("Ocurrió un error en el servidor. Intente más tarde o contcate con el administrador")
        })
    },[opt])

    const downloadPDF = e =>{
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text(`Pagos atrasados ${opt}`, 40, 30)      
        doc.setFontSize(10);        
        doc.autoTable({
            html:'#tableCC',
            theme: 'striped',
            startY: 55
        });        
        doc.save(`pagos_atrasados_${opt}.pdf`)
    }



    return (
        <div>
            <ToastContainer />
            <Row className='mb-4'>
                <Col>
                    <Card className='shadow'>
                    <Card.Body>
                            <Card.Title>Pagos atrasados</Card.Title>
                            <Dropdown.Divider />
                            <Row>
                                <Col xs="9" lg="3">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="1" className="pr-0"></Form.Label>
                                        <Col sm="11" className="pl-0">
                                            <Form.Control 
                                                value={opt}
                                                onChange={e=>setOpt(e.target.value)}
                                                as="select"
                                            >
                                                <option value="mantenimiento">Mantenimiento</option>
                                                <option value="sancion">Sanción</option>
                                                <option value="cuotaextraordinaria">Cuota extraordinaria</option>
                                                <option value="cuotainicial">Cuota Inicial</option>
                                                <option value="cuotainicialproyecto">Cuota Inicial Proyecto</option>
                                                <option value="cuota">Otras Cuotas</option>
                                                <option value="todos">Todos</option>
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>

                    </Card>
                </Col>
            </Row>
            {
                isLoading ? <Card className='shadow'><Card.Body><TableSkeleton /></Card.Body></Card> :
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
                                                    {/* <th width='10%'>Fecha</th> */}
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
                                                            {/* <td width='10%'>{moment(item.fecha).format("DD-MM-YYYY")}</td> */}
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
            }
            
        </div>
    )
}