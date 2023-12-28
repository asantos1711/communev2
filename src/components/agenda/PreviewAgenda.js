import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { authContext } from "../../context/AuthContext";
import Get from "../../service/Get";
import { AGENDAR_RESERVAR, GET_AGENDA, GET_LOTES_BY_PARENT, LOTE_GET, TIPOAMENIDAD_GET_ACTIVAS } from "../../service/Routes";
import DatePicker from "react-datepicker";
import moment from "moment";
import { loaderRequest } from "../../loaders/LoaderRequest";
import { toast } from "react-toastify";
import { setClass } from "../../utils/setClass";
import Post from "../../service/Post";
import MiniLoad from "../../loaders/MiniLoad";

export default function PreviewAgenda(){
    const [fecha, setFecha] = useState(new Date())
    const [lote, setLote] = useState('')
    const [amenidad, setAmenidad] = useState('')
    const [tipoAmenidadesOpt, setTipoAmenidadesOpt]  = useState([])
    const [lotesOpt, setLotesOpt] = useState([])
    const { auth } = useContext(authContext)
    const [horarios, setHorarios] = useState([])
    const [doFind, setDoFind] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [show, setShow] = useState(false)

    //para reservar
    const [optLotesHijos, setOptlotesHijos] = useState([])
    const [loteAReservar, setLoteAReservar] = useState('')
    const [lugares, setLugares] = useState(1)
    const [aforoMaximo, setAforoMaximo] = useState(1)
    const [submitingR, setSubmitingR] = useState(false)
    const [ameFH, setAmFH] = useState('')

    const handleClose = () => setShow(false);

    useEffect(() => {
        //amenidades
        Get({url: TIPOAMENIDAD_GET_ACTIVAS, access_token: auth.data.access_token})
        .then(response=>{           
            setTipoAmenidadesOpt(response.data)
        })
        .catch(error=>{
            //todo console the error
        })

        Get({url: `${LOTE_GET}/condominal`, access_token: auth.data.access_token})
        .then(response=>{
            setLotesOpt(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    useEffect(()=>{
        if(lote!==''){
            Get({url: `${GET_LOTES_BY_PARENT}/${lote}`, access_token: auth.data.access_token})
            .then(response=>{
                console.log(response)
                if(response.data.success){
                    setOptlotesHijos(response.data.data)
                }else{
                    setOptlotesHijos([])
                }
            })
            .catch(error=>{
                console.log(error)
                setOptlotesHijos([])
            })
        }        
    },[lote])


    const buscarHorarios = () =>{
        setIsSubmiting(true)
        let url = `${GET_AGENDA}/${moment(fecha).format("YYYY-MM-DD")}/${amenidad}/${lote}`
        Get({url: url, access_token: auth.data.access_token})
        .then(response=>{
            setDoFind(true)
            setHorarios(response.data.data)
            setIsSubmiting(false)
        })
        .catch(error=>{
            setDoFind(true)
            setIsSubmiting(false)
            toast.error("No podemos obtener la información, intente más tarde o contacte con el administrador", {autoClose: 8000})
        })
    }

    const reservar = () =>{
        setSubmitingR(true)
        const d = {
            idAFAH: ameFH,
            lote: {id: parseInt(loteAReservar)},
            lugaresOcupados: parseInt(lugares),
            aforoMaximo: aforoMaximo
        }
        Post({url: AGENDAR_RESERVAR, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            if(response.data.success){
                setSubmitingR(false)
                handleClose()
                buscarHorarios();
                toast.success("Reservado exitosamente", {autoClose: 3000})
            }else{
                toast.error(response.data.message, {autoClose: 8000})
            }
            
        })
        .catch(error=>{
            setSubmitingR(false)
            toast.error("No podemos reservar en estos momentos, intente más tarde o contacte con el administrador", {autoClose: 8000})
        })
    }

    return (
        <>
        {isSubmiting && loaderRequest()}
            <Row className='align-items-center'>
                <Col xs="12" lg="4">
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <DatePicker 
                            className="form-control"
                            showPopperArrow={false}
                            selected={fecha}
                            minDate={new Date()}
                            autoComplete="off"
                            dateFormat="dd-MM-yyyy"
                            selectsStart
                            startDate={fecha}
                            onChange={date => {
                                if(date===null){
                                    setFecha(new Date())
                                }else{  
                                    setFecha(date)                                      
                                }                                                               
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs="12" lg="4">
                    <Form.Group>
                        <Form.Label>Amenidad</Form.Label>
                        <Form.Control 
                            as="select"
                            value={amenidad}
                            onChange={e=>setAmenidad(e.target.value)}
                        >
                            <option value=''>Seleccionar opción</option>
                            {
                                tipoAmenidadesOpt.map((item)=>(
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs="12" lg="4">
                    <Form.Group>
                        <Form.Label>Lote</Form.Label>
                        <Form.Control 
                            as="select"
                            value={lote}
                            onChange={e=>setLote(e.target.value)}
                        >
                            <option value=''>Seleccionar opción</option>
                            {
                                lotesOpt.map((item)=>(
                                    <option value={item.id} key={item.id}>{`ref: ${item.referencia}. Propietario: ${item.residente_name}`}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs="12" lg="12" className="text-right">
                    {
                        (amenidad && lote && fecha) ?
                        <Button variant="primary" type="button" onClick={buscarHorarios}>Buscar</Button> :
                        <Button variant="primary" type="button" disabled>Buscar</Button>
                    }
                    
                </Col>
            </Row>

            <Row className="mt-3">
                <Col xs="12" md="12">
                    {
                        !doFind && 
                        <Alert variant="secondary" className="text-center">Por favor filtre por los criterios de búsqueda</Alert>
                    }
                    {
                        (doFind && horarios.length) === 0 ?
                        <Alert variant="info" className="text-center">No hay horarios disponibles</Alert> :
                        horarios.map((item) => (
                            <div key={item.id} className="bg-light px-2 py-1 rounded my-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className={`m-0 text-capitalize ${setClass(item.estado)}`}>{item.estado === 'parcialmente' ? 'Parcialmente reservado' : item.estado}</h6>
                                        <span className="m-0">{item.horario}</span>
                                        {item.estadoDescripcion && 
                                        <div><small>{item.estadoDescripcion}</small></div>}
                                    </div>
                                    <div>
                                        <span className="badge badge-pill">{item.lugaresDisponibles}</span>                                        
                                        {
                                            (item.estado === 'disponible' || item.estado === 'parcialmente') ?
                                            <Button type="button" variant="outline-dark" size="sm" 
                                                onClick={()=>{
                                                    setShow(true)
                                                    setAmFH(item.id)
                                                    setAforoMaximo(item.lugaresDisponibles)
                                                }}>
                                                    Reservar
                                            </Button> :
                                            <Button type="button" variant="secondary" size="sm" disabled>Reservar</Button>
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}  backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>Reservar</Modal.Title>
                </Modal.Header>
                {
                    submitingR ? <Modal.Body><MiniLoad texto="Procesando reservación" /></Modal.Body> :
                    <Modal.Body>
                        <Row>
                            <Col xs="12" lg="12">
                                <Form.Group>
                                    <Form.Label>Lote </Form.Label>
                                    <Form.Control 
                                        as="select"
                                        value={loteAReservar}
                                        onChange={e=>setLoteAReservar(e.target.value)}
                                    >
                                        <option value=''>Seleccionar opción</option>
                                        {
                                            optLotesHijos.map((item)=>(
                                                <option value={item.id} key={item.id}>{`${item.referencia} - Residente:  ${item.residente_name}`}</option>
                                            ))
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="12">
                                <Form.Group>
                                    <Form.Label>Capacidad </Form.Label>
                                    <Form.Control 
                                        as="select"
                                        value={lugares}
                                        onChange={e=>setLugares(e.target.value)}
                                    >
                                        <option value=''>Seleccionar opción</option>
                                        {
                                            [...Array(aforoMaximo).keys()].map((item, i)=>(
                                                <option value={i+1} key={i}>{i+1}</option>
                                            ))
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                }
                
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={reservar}>
                    Aceptar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}