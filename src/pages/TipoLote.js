import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext'
import Get from '../service/Get'
import * as jsPDF from 'jspdf'
import moment from 'moment'
import { Button, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap'
import TableSkeleton from '../loaders/TableSkeleton'
import { FaDownload } from 'react-icons/fa'
import { GET_LOTE_STATUS } from '../service/Routes'

export default function TipoLote(){
    const { auth } = useContext(authContext)
    const [isLoading, setIsLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [items, setItems] = useState([])
    const [count, setCount] = useState(0)


    useEffect(()=>{
        if(status){
            setIsLoading(true)
            Get({url: `${GET_LOTE_STATUS}/${status}`, access_token:  auth.data.access_token})
            .then(response=>{
                console.log(response)
                setItems(response.data)
                setCount(response.data.length)
                setIsLoading(false)
            })
            .catch(error=>{
                console.log(error)
                setCount(0)
                setIsLoading(false)
            })
        }else{
            setCount(0)
            setIsLoading(false)
        }
    }, [status])

    const downloadPDF = () =>{
        //console.log('pdf')
        var doc = new jsPDF('p', 'pt', 'a4', {putOnlyUsedFonts: true});
        doc.setFontSize(14);
        doc.text(`Lote ${status}`, 40, 50)                
        doc.autoTable({
            html:'#tableCC',
            theme: 'striped',
            startY: 75
        });
        doc.save(`lotes_${status}_${moment().format("DD-MM-YYYY")}.pdf`)
    }

    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>Tipo de lotes  </Card.Title>
                <Dropdown.Divider />  
                <Row>
                    <Col>
                    {
                        isLoading
                        ? <TableSkeleton />
                        : 
                        <Row>
                            <Col xs="3" md="3">
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="3">Filtrar</Form.Label>
                                    <Col sm="9">
                                        <Form.Control
                                            as="select"
                                            value={status}
                                            onChange={e=>setStatus(e.target.value)}
                                        >
                                            <option value="">Seleccionar opción</option>
                                            <option value="disponible">Disponible</option>
                                            <option value="entregado">Entregado</option>
                                            <option value="fusionado">Fusionado</option>
                                            <option value="inactivo">Inactivo</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                                
                            </Col>
                            <Col xs="9" md="9" className="text-right">
                                <Button variant="dark" className="mr-1 btn-xs" size="sm" onClick={e=>downloadPDF()}><FaDownload /></Button>
                            </Col>
                            <Col xs="12" md="12">
                                <label className="text-muted ft-0-8rem">{`Cantidad de elementos ${count}`}</label>
                            </Col>
                            <Col xs="12" md="12" className={`mt-4 ${items.length > 15 && 'h-600'}`} >
                            <Table size="sm" hover responsive id="tableCC">
                                <thead>
                                    <tr>
                                        <th width="20%">Referencia</th>
                                        <th width="40%">Dirección</th>
                                        <th width="40%">Asociado</th>
                                    </tr>                                
                                </thead>
                                <tbody>
                                    {
                                        items.length === 0 ? <tr><td colSpan="3" className="text-center bg-light">No existen información a mostrar</td></tr> :
                                        items.map((item,i)=>(
                                            <tr key={i}>
                                                <td>{item.referencia}</td>
                                                <td>{item.direccion}</td>
                                                <td>{item.residente_name}</td>
                                            </tr>
                                        ))
                                    }                                
                                </tbody>
                            </Table>
                            </Col>
                        </Row>
                        
                    }  
                    </Col>
                </Row>
            </Card.Body>
        </Card>         
    );
}