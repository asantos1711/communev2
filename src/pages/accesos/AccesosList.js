import moment from "moment"
import React, { useEffect, useState } from "react"
import { Button, Col, Form, Modal, Row, Table, Image, Collapse, Card } from "react-bootstrap"
import { FaChevronCircleDown, FaChevronCircleUp, FaEye, FaSearch } from "react-icons/fa"
import TableSkeleton from "../../loaders/TableSkeleton"
import Get from "../../service/Get"
import { GET_ACCESOS_PAGINABLE } from "../../service/Routes"
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import { getTipoVisita } from "../../utils/getTipoVisita"
import { getTipoAcceso } from "../../utils/getTipoAcceso"
import { labelManzana } from "../../constant/token"

export default function AccesosList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [pageSize, setPageSize] = useState(20)
    const [pageNo, setPageNo] = useState(0)
    const [sortBy, setSortBy] = useState('fechaHoraAcceso')
    const [next, setNext] = useState(true)
    const [previous, setPrevious] = useState(false)
    const [searchPLacas, setSearchPlacas] = useState('')
    const [nombre, setNombre] = useState('')
    const [tipoVisita, setTipoVisita] = useState('')
    const [cono, setCono] = useState('')
    const [tipo, setTipoo] = useState('')
    const [cantidadElementos, setCantidadElementos] = useState(0)
    const [showModal, setModalShow] = useState(false)
    const [data, setData] = useState(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [openFilter, setOpenFilter] = useState(true)
    //filtros de direcccion
    const [calle, setCalle] = useState('')
    const [lote, setLote] = useState('')
    const [etapa, setEtapa] = useState('')
    const [manzana, setManzana] = useState('')

    useEffect(()=>{       
        DataList()                
    }, [pageNo])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: `${GET_ACCESOS_PAGINABLE}?page=${pageNo}&size=${pageSize}&sortBy=${sortBy}${nombre && `&name=${nombre}`}${tipoVisita && `&tipoVisita=${tipoVisita}`}${searchPLacas && `&placas=${searchPLacas}`}${tipo && `&tipo=${tipo}`}${cono && `&cono=${cono}`}${startDate && `&dateIni=${moment(startDate).format("YYYY-MM-DD")}`}${endDate && `&dateFin=${moment(endDate).format("YYYY-MM-DD")}`}${calle && `&calle=${calle}`}${lote && `&lote=${lote}`}${manzana && `&manzana=${manzana}`}${etapa && `&etapa=${etapa}`}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItems(response.data.accesoList)
            setPrevious(response.data.previous)
            setNext(response.data.next)
            setCantidadElementos(response.data.total)
            setIsLoading(false)            
        })
        .catch(error=>{
            toast.error("No se puede obtener la informacion en este momento. Intente más tarde", {autoclose: 8000})
        })
    }

    const handlePrev = e =>{
        setPageNo(pageNo-1)
    }
    const handleNext= e =>{
        setPageNo(pageNo+1)
    }
    const onClickBuscar = e =>{
        setPageNo(0)
        DataList()
    }

    const showItem = (item) =>{
        setModalShow(true)
        setData(item)
    }
    const handleClose = () => {
        setModalShow(false)
    }
    const handleStartDate = date =>{
        //console.log(date)
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

    return(
        <div className="fact-font">
            {
                isLoading
                ? <TableSkeleton />
                : <div className="react-bootstrap-table">
                    <Card className="mb-2">
                        <Card.Body>
                            <Row>
                                <Col xs="12" md="12">
                                    <h6 onClick={() => setOpenFilter(!openFilter)} style={{display: 'inline-block'}} className="cursor-pointer m-0">
                                        Filtros de búsqueda{' '}
                                        {
                                            openFilter ? <FaChevronCircleDown /> : <FaChevronCircleUp /> 
                                        }
                                    </h6>
                                </Col>
                            </Row>
                            <Collapse in={openFilter}>
                                <div>
                                    <Row>
                                        <Col xs="12" md="8">
                                            <Row>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Nombre</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={nombre}
                                                            onChange={e=>setNombre(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Tipo de acceso</Form.Label>
                                                        <Form.Control 
                                                            as="select" 
                                                            value={tipo}
                                                            onChange={e=>setTipoo(e.target.value)}
                                                        >
                                                            <option value="">Ambos tipos de acceso</option>
                                                            <option value="entrada">Solo Entrada</option>
                                                            <option value="salida">Solo Salida</option>
                                                            <option value="entradasinsalida">Solo Entrada Sin Salida</option>
                                                            <option value="EntradaConBloqueo">Entradas con Bloqueo</option>
                                                            <option value="SalidaConBloqueo">Salidas con Bloqueo</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Tipo de visita</Form.Label>
                                                        <Form.Control 
                                                            as="select" 
                                                            value={tipoVisita}
                                                            onChange={e=>setTipoVisita(e.target.value)}
                                                        >
                                                            <option value="">Seleccionar opción</option>
                                                            <option value="regularindefinido">Regular Indefinido</option>
                                                            <option value="regulardefinido">Regular Definido</option>
                                                            <option value="rentaVac">Renta Vacacional</option>
                                                            <option value="Trabajador">Trabajador</option>
                                                            <option value="TrabajadorPermanente">Trabajador Permanente</option>
                                                            <option value="Instantanea">Instantanea</option>
                                                            <option value="unicoDia">Único Día</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Placa</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={searchPLacas}
                                                            onChange={e=>setSearchPlacas(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Cono</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={cono}
                                                            onChange={e=>setCono(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4"></Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Fecha de acceso</Form.Label>
                                                        <DatePicker className="form-control"
                                                            dateFormat="dd-MM-yyyy"
                                                            locale="es"
                                                            selectsStart
                                                            startDate={startDate}
                                                            endDate={endDate}
                                                            selected={startDate}
                                                            onChange={date => handleStartDate(date)}
                                                            placeholderText="Desde"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Label className="m-0 opacity-0">Fecha de acceso</Form.Label>
                                                    <DatePicker className="form-control"
                                                        dateFormat="dd-MM-yyyy"
                                                        locale="es"
                                                        selectsEnd
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        minDate={startDate}
                                                        selected={endDate}
                                                        onChange={date => handleEndDate(date)} 
                                                        placeholderText="Hasta"
                                                    />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs="12" md={{offset: 1, span: 3}}>
                                            <Row>
                                                <Col xs="12" md="12"><h6 className="m-0">Filtros de dirección</h6></Col>
                                                <Col xs="12" md="8">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Calle</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={calle}
                                                            onChange={e=>setCalle(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="4">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Lote</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={lote}
                                                            onChange={e=>setLote(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">{labelManzana}</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={manzana}
                                                            onChange={e=>setManzana(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" md="6">
                                                    <Form.Group>
                                                        <Form.Label className="m-0">Etapa</Form.Label>
                                                        <Form.Control 
                                                            type="text" 
                                                            value={etapa}
                                                            onChange={e=>setEtapa(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" md="12"><hr /></Col>
                                        <Col xs="12" md="3">
                                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                                <Form.Label column sm="5">Ordenar por: </Form.Label>
                                                <Col sm="7">
                                                    <Form.Control 
                                                        as="select" 
                                                        value={sortBy}
                                                        onChange={e=>setSortBy(e.target.value)}
                                                    >
                                                        <option value="fechaHoraAcceso">Fecha Acceso</option>
                                                        <option value="nombre">Nombre</option>
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col xs="12" md="2">
                                            <Button variant="outline-primary" block onClick={e=>onClickBuscar()}><FaSearch /> Buscar</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </Card.Body>
                    </Card>
                    
                    
                    
                    <Table hover striped className="tableVertical">
                        <thead>
                            <tr>
                                <th width="20%">Nombre</th>
                                <th width="10%">Tipo visita</th>
                                <th width="10%">Fecha acceso</th>
                                <th width="5%">Cono</th>
                                <th width="8%">Placas</th>
                                <th width="10%">Punto acceso</th>
                                <th width="8%">Tipo</th>
                                <th width="5%">Referencia</th>
                                <th width="20%">Dirección</th>
                                <th width="4%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.length > 0 ?
                                items.map((item,i)=>(
                                    <tr key={i}>
                                        <td>{item.nombre}</td>
                                        <td>{getTipoVisita(item.tipoVisita)}</td>
                                        <td>{moment(item.fechaHoraAcceso, "YYYY-MM-DDTHH:mm").format("DD-MM-YYYY HH:mm")}</td>
                                        <td>{item?.cono ?? ''}</td>
                                        <td>{item.placas}</td>
                                        <td>{item.puntoAcceso}</td>
                                        <td>{getTipoAcceso(item.tipo)}</td>
                                        <td>{item.idLote}</td>
                                        <td>{item.direccion}</td>
                                        <td><FaEye onClick={()=>showItem(item)}/></td>
                                    </tr>
                                ))
                                :<tr><td colSpan="10" className="text-center">No existen valores a mostrar</td></tr>
                            }
                        </tbody>
                    </Table>
                    
                    <div className="d-flex flex-row-reverse">
                            
                        <ul className="pagination">
                            <li className={`${!previous && "disabled"} paginate_button page-item previous cursor-pointer`} id="dataTable_previous">
                                <span className="page-link" onClick={e=>handlePrev()}>Previous</span>
                            </li>
                            <li className={`${!next && "disabled"} paginate_button page-item next cursor-pointer`} id="dataTable_next">
                                <span className="page-link"  onClick={e=>handleNext()}>Next</span>
                            </li>
                        </ul>
                        <span className="text-muted mr-5">Total de elementos {cantidadElementos}</span>
                    </div>
                </div>
            }
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>Detalle</Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs="12" md="6">
                            <Image fluid src={data?.placasUrl} 
                                style={{
                                    height: '250px'
                                }}
                            />
                        </Col>
                        <Col xs="12" md="6">
                            <Image fluid src={data?.idUrl} 
                                style={{
                                    height: '250px'
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {data && <ul className="list-unstyled">
                                <li><strong>Cono:</strong>{data.cono ?? '-'}</li>
                                <li><strong>Nombre:</strong>{data.nombre}</li>
                                <li><strong>Placa:</strong>{data.placas}</li>
                                <li><strong>Tipo visita:</strong>{data.tipoVisita}</li>
                                <li><strong>Fecha y hora:</strong>{moment(data.fechaHoraAcceso, "YYYY-MM-DDTHH:mm").format("DD-MM-YYYY HH:mm")}</li>
                                <li><strong>Punto acceso:</strong>{data.puntoAcceso}</li>
                                <li><strong>Tipo acceso:</strong>{data.tipo}</li>
                                <li><strong>Referencia lote:</strong>{data.idLote}</li>
                                {data.nombreSeguridad && <li><strong>Nombre Seguridad:</strong>{data.nombreSeguridad}</li>}
                                {data.nombreEncargadoObra && <li><strong>Nombre Encargado de obra:</strong>{data.nombreEncargadoObra}</li>}
                                {data.acompanantes && <li><strong>No acompañantes:</strong>{data.acompanantes}</li>}
                                {data.motivo && <li><strong>Motivo:</strong>{data.motivo}</li>}
                            </ul>}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}