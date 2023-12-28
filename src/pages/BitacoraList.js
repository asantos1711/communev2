import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
import { authContext } from '../context/AuthContext';
import TableSkeleton from '../loaders/TableSkeleton';
import Get from '../service/Get';
import { BITACORA_ALL_PAGINABLE } from '../service/Routes';
import moment from 'moment'
import { accionFormatter } from '../utils/accionFormatter';
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import { FaSearch } from 'react-icons/fa';

registerLocale("es", es)

export default function BitacoraList(){
    const [isLoading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const {auth} = useContext(authContext)
    const [pageSize, setPageSize] = useState(20)
    const [pageNo, setPageNo] = useState(0)
    const [sortBy, setSortBy] = useState('createdAt')
    const [next, setNext] = useState(true)
    const [previous, setPrevious] = useState(false)
    const [cantidadElementos, setCantidadElementos] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [referencia, setReferencia] = useState('')
    const [buscar, setBuscar] = useState(true)

    useEffect(()=>{
        setLoading(true)
        Get({url: `${BITACORA_ALL_PAGINABLE}?page=${pageNo}&size=${pageSize}&sortBy=${sortBy}${startDate && `&dateIni=${moment(startDate).format("DD-MM-YYYY 01:00:00")}`}${endDate && `&dateFin=${moment(endDate).format("DD-MM-YYYY 23:59:59")}`}${referencia && `&referencia=${referencia}`}`, access_token: auth.data.access_token})
        .then(response=>{
            console.log(response)
            setItems(response.data.content)
            setPrevious(response.data.first)
            setNext(response.data.last)
            setCantidadElementos(response.data.totalElements)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    },[pageNo, buscar])

    const handlePrev = e =>{
        setPageNo(pageNo-1)
    }
    const handleNext= e =>{
        setPageNo(pageNo+1)
    }

    const handleStartDate = date =>{
        if(date===null || date===""){
            setStartDate('')
            setEndDate('')
        }else{
            setStartDate(date)
            if(date>endDate){
                setEndDate(date)
            }
        }        
    }

    const handleEndDate = date =>{
        if(date===null || date===""){
            setEndDate(startDate)
        }else{
            if(startDate==='' || startDate===null){
                setStartDate(date)
            }
            setEndDate(date)
        }
    }

    const onClickBuscar = e =>{
        setPageNo(0)
        setBuscar(!buscar)
    }

    return(
        <Card className="shadow">
            <Card.Body>
                <Card.Title>Bitácora</Card.Title>
                <Dropdown.Divider />
                <Row className="my-3">
                    <Col xs="12" md="4">
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
                    <Col xs="12" md="4">
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
                    <Col xs="12" md="3">
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="3" className="pr-0">Referencia</Form.Label>
                            <Col sm="9" className="pl-0">
                                <Form.Control 
                                    type="text"
                                    value={referencia}
                                    onChange={e=>setReferencia(e.target.value)} 
                                />
                            </Col>
                        </Form.Group>
                    </Col> 
                    <Col xs="12" md="1">
                        <Button variant="outline-primary" onClick={e=>onClickBuscar()}><FaSearch /></Button>{' '}
                    </Col> 
                </Row>
                {
                    isLoading ? <TableSkeleton /> :
                    <Row>
                        <Col>
                            <Table hover striped>
                                <thead>
                                    <tr>
                                        <th width="15%">Fecha</th>
                                        <th width="20%">Usuario</th>
                                        <th width="15%">Referencia</th>
                                        <th width="10%" style={{textAlign: 'center'}}>Acción</th>
                                        <th width="50%">Nota</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        items.length > 0 ?
                                        items.map((item,i)=>(
                                            <tr key={i}>
                                                <td>{moment(item.createdAt).format("DD-MM-YYYY HH:mm")}</td>
                                                <td>{item.usuario}</td>
                                                <td>{item.referencia}</td>
                                                <td style={{textAlign: 'center'}}>{accionFormatter(item.status)}</td>
                                                <td>{item.nota}</td>
                                            </tr>
                                        ))
                                        :<tr><td colSpan="5" className="text-center">No existen valores a mostrar</td></tr>
                                    }
                                </tbody>
                            </Table>
                            <div className="d-flex flex-row-reverse">
                                
                                <ul className="pagination">
                                    <li className={`${previous && "disabled"} paginate_button page-item previous cursor-pointer`} id="dataTable_previous">
                                        <span className="page-link" onClick={e=>handlePrev()}>Previous</span>
                                    </li>
                                    <li className={`${next && "disabled"} paginate_button page-item next cursor-pointer`} id="dataTable_next">
                                        <span className="page-link"  onClick={e=>handleNext()}>Next</span>
                                    </li>
                                </ul>
                                <span className="text-muted mr-5">Total de elementos {cantidadElementos}</span>
                            </div>
                        </Col>
                    </Row>
                }
                <Row></Row>
            </Card.Body>
        </Card>
    );
}