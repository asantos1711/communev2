import React from 'react';
import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { loaderRequest } from '../../../loaders/LoaderRequest';
import DatePicker from "react-datepicker";
import { useContext } from 'react';
import { authContext } from '../../../context/AuthContext';
import { useEffect } from 'react';
import Get from '../../../service/Get';
import { AGENDAR_RESERVAR, GET_AGENDA_BY_FECHA_AMENIDAD_LOTE, GET_LOTES_BY_PARENT, GET_LOTES_HABITACIONALES, LOTE_GET, TIPOAMENIDAD_GET_ACTIVAS } from '../../../service/Routes';
import moment from 'moment';
import MiniLoad from '../../../loaders/MiniLoad';
import { FaTrash } from 'react-icons/fa';
import Post from '../../../service/Post';
import Select  from "react-select";

export default function CrearReserva(){
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [fecha, setFecha] = useState(new Date())
    const [amenidad, setAmenidad] = useState('')
    const [tipoAmenidadesOpt, setTipoAmenidadesOpt]  = useState([])
    const [lotesOpt, setLotesOpt] = useState([])
    const { auth } = useContext(authContext)
    const [lote, setLote] = useState(null)
    const [doFind, setDoFind] = useState(false)
    const [horarios, setHorarios] = useState([])
    const [agenda, setAgenda] = useState(null)
    const [show, setShow] = useState(false)
    const [aforoMaximo, setAforoMaximo] = useState(1)
    const [submitingR, setSubmitingR] = useState(false)
    const [loteAReservar, setLoteAReservar] = useState(null)
    const [optLotesHijos, setOptlotesHijos] = useState([])
    const [lugares, setLugares] = useState(1)
    const [residentes, setResidentes] = useState([])
    const [isVisita, setIsVisita] = useState(false)
    const [name, setName] = useState('')
    const [errorReserva, setErrorReserva] = useState({
        error: false,
        text: ''
    })
    const [reservaGlobal, setReservaGlobal] = useState(null)
    const [general, setGeneral] = useState(false)
    

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

    const buscarHorarios = () =>{
        setIsSubmiting(true)
        let url = `${GET_AGENDA_BY_FECHA_AMENIDAD_LOTE}/${moment(fecha).format("DD-MM-YYYY")}/${amenidad}/${!lote ? 0 : lote?.value}/${general}`
        //console.log(url)
        Get({url: url, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            if(!response.data.success){
                toast.info(response.data.message, {autoClose: 5000})
            }else{
                setDoFind(true)
                setAgenda(response.data.data.agenda)
                setHorarios(response.data.data.rerservaList)
            }
            setIsSubmiting(false)
        })
        .catch(error=>{
            console.log(error)
            setHorarios([])
            setAgenda(null)
            setDoFind(false)
            setIsSubmiting(false)
            toast.error("No podemos obtener la información, intente más tarde o contacte con el administrador", {autoClose: 8000})
        })
    }

    const handleClose = () => {
        setShow(false)
        setName('')
        setReservaGlobal(null)
        setResidentes([])
        setLoteAReservar(null)
    };

    useEffect(()=>{
        if(lote){
            Get({url: `${GET_LOTES_BY_PARENT}/${lote.value}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
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
        }else{
            Get({url: `${GET_LOTES_HABITACIONALES}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                setOptlotesHijos(response.data)
            })
            .catch(error=>{
                console.log(error)
                setOptlotesHijos([])
            })
        }        
    },[lote])

    const addResidente = () => {
        const copyRe = [...residentes]
        const obj = {
            lote: loteAReservar.value,
            isVisita: isVisita,
            name: name,
        }
        copyRe.push(obj)
        setResidentes(copyRe)

        setReservaGlobal(prev=>({
            ...prev, 
            reservaResidenteList: copyRe
        }))
    }

    const reservar = () =>{
        console.log(reservaGlobal)
        if(reservaGlobal.reservaResidenteList === undefined || reservaGlobal.reservaResidenteList?.length === 0){
            setErrorReserva({
                error: true,
                text: "No se puede crear reservar sin residentes"
            })
        }else if(reservaGlobal.reservaResidenteList.filter(it=>it.lote==='').length === reservaGlobal.reservaResidenteList.length){
            setErrorReserva({
                error: true,
                text: "Debe seleccionar al menos un residente"
            })
        }else if(reservaGlobal.reservaResidenteList.filter(it=>it.isVisita && it.lote!=='').length > 0){
            setErrorReserva({
                error: true,
                text: "Si selecciona lote no debe ser visita"
            })
        }else if(reservaGlobal.lugaresReservados !== reservaGlobal.reservaResidenteList.length){
            setErrorReserva({
                error: true,
                text: "Debe ingresar todas las personas según los lugares a reservar"
            })
        }
        else{
            setErrorReserva({
                error: false,
                text: ""
            })
            setSubmitingR(true)

            Post({url: AGENDAR_RESERVAR, data: reservaGlobal, access_token: auth.data.access_token, header: true})
            .then(response=>{
                //console.log(response)
                if(response.data.success){
                    handleClose()
                    //buscarHorarios();
                    toast.success("Reservado exitosamente", {autoClose: 3000})
                    buscarHorarios()
                }else{
                    toast.info(response.data.message, {autoClose: 8000})
                }
                setSubmitingR(false)
                
            })
            .catch(error=>{
                setSubmitingR(false)
                toast.error("No podemos reservar en estos momentos, intente más tarde o contacte con el administrador", {autoClose: 8000})
            })
        }
    }

    const deleteResidente = (index) =>{
        const copyR = [...residentes]
        copyR.splice(index, 1)
        setResidentes(copyR)
        setReservaGlobal(prev=>({
            ...prev, 
            reservaResidenteList: copyR
        }))
    }

    useEffect(() => {
        setReservaGlobal(prev=>({
            ...prev,
            lugaresReservados: parseInt(lugares)
        }))
    }, [lugares])
    return(
        <Row className='mb-3'>
            {isSubmiting && loaderRequest()}
            <ToastContainer />
            <Col xs="12" lg="12">
                <Card className="shadow mb-2">
                    <Card.Body>
                    <Row>
                        <Col xs="12" lg="2">
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
                                        setHorarios([])                                                           
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
                                    onChange={e=>{
                                        setAmenidad(e.target.value)
                                        setHorarios([])
                                    }}
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
                        <Col xs="12" lg="1">
                            <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                            <Form.Check 
                                type="checkbox"
                                checked={general}
                                onChange={e=>{
                                    if(e.target.checked){
                                        setLote(null)
                                    }
                                    setGeneral(e.target.checked)
                                }}
                                label="General"
                            />
                        </Col>
                        <Col xs="12" lg="3">
                            <Form.Group>
                                <Form.Label>Lote</Form.Label>
                                <Select 
                                    options={general ? [] :lotesOpt.map(item=>({label: `ref: ${item.referencia}. Propietario: ${item.residente_name}`, value: item.id}))} 
                                    isClearable
                                    value={lote}
                                    onChange={(value)=>{
                                        setLote(value)
                                        setHorarios([])
                                    }}
                                    placeholder="Seleccionar opción"
                                />
                                {/* <Form.Control 
                                    as="select"
                                    value={lote}
                                    onChange={e=>{
                                        setLote(e.target.value)
                                        setHorarios([])
                                    }}
                                >
                                    <option value=''>Seleccionar opción</option>
                                    {
                                        lotesOpt.map((item)=>(
                                            <option value={item.id} key={item.id}>{`ref: ${item.referencia}. Propietario: ${item.residente_name}`}</option>
                                        ))
                                    }
                                </Form.Control> */}
                            </Form.Group>
                        </Col>
                        <Col xs="12" lg="2">
                            <Form.Group>
                                <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                                {
                                    (amenidad && fecha && (lote || general)) ?
                                    <Button variant="primary" type="button" onClick={buscarHorarios}>Buscar</Button> :
                                    <Button variant="primary" type="button" disabled>Buscar</Button>
                                }
                            </Form.Group>                            
                        </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs="12" lg="12">
                            {
                                !doFind && 
                                <Alert variant="secondary" className="text-center">Por favor filtre por los criterios de búsqueda</Alert>
                            }
                            {
                                (doFind && horarios.length) === 0 ?
                                <Alert variant="info" className="text-center">No hay horarios disponibles</Alert> :
                                horarios.map((item, index) => (
                                    <div key={index} className="bg-light px-2 py-1 rounded my-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className={`m-0 text-capitalize text-success`}>Disponible</h6>
                                                <span className="m-0">{item.horario}</span>                                               
                                            </div>
                                            <div className='d-flex' >
                                            {
                                                item.variacionesList.map((variacion, varIndex) => (
                                                    <div key={varIndex} className="text-center pr-2">
                                                        <span className='d-block'>{variacion.name}</span>
                                                        <span className="d-block badge badge-pill">{`${variacion.lugarOcupados}/${variacion.lugaresDisponibles}`}</span>                                        
                                                        {
                                                            (variacion.lugaresDisponibles!==variacion.lugarOcupados) ?
                                                            <Button type="button" variant="outline-dark" size="sm" 
                                                                onClick={()=>{
                                                                    setShow(true)
                                                                    //setAmFH(item.id)
                                                                    setReservaGlobal(prev=>({
                                                                        ...prev,
                                                                        fechaReserva: moment(fecha).format("YYYY-MM-DD"),
                                                                        horaReservada: item.horario,
                                                                        agenda: agenda.id,
                                                                        variacionReservada: variacion.id,
                                                                        lugaresReservados: 1
                                                                    }))
                                                                    setAforoMaximo(variacion.lugaresDisponibles-variacion.lugarOcupados)
                                                                }}>
                                                                    Reservar
                                                            </Button> :
                                                            <Button type="button" variant="secondary" size="sm" disabled>Reservar</Button>
                                                        }                                                            
                                                    </div>
                                                ))
                                            }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

            <Modal show={show} onHide={handleClose}  backdrop="static" keyboard={false} size="lg" dialogClassName="modal-90w">
                <Modal.Header closeButton>
                <Modal.Title>Reservar</Modal.Title>
                </Modal.Header>
                {
                    submitingR ? <Modal.Body><MiniLoad texto="Procesando reservación" /></Modal.Body> :
                    <Modal.Body>
                        {
                            errorReserva.error &&
                            <Alert variant='danger' className='p-2'>{errorReserva.text}</Alert>
                        }                        
                        <Row>
                        <Col xs="12" lg="4">
                            <Form.Group>
                                <Form.Label>Capacidad </Form.Label>
                                <Form.Control 
                                    as="select"
                                    value={lugares}
                                    onChange={e=>setLugares(e.target.value)}
                                >
                                    {
                                        [...Array(aforoMaximo).keys()].map((item, i)=>(
                                            <option value={i+1} key={i}>{i+1}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        </Row>
                        <Row>
                            <Col xs="12" lg="4">
                                <Form.Group>
                                    <Form.Label>Lote </Form.Label>
                                    <Select 
                                        options={optLotesHijos.map(item=>({label: `ref: ${item.referencia}. ${item.residente_name ? `Propietario: ${item.residente_name}` : ''}`, value: item.id}))} 
                                        isClearable
                                        value={loteAReservar}
                                        onChange={(value)=>{
                                            setLoteAReservar(value)
                                        }}
                                        placeholder="Seleccionar opción"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="5">
                                <Form.Group>
                                    <Form.Label>Nombre </Form.Label>
                                    <Form.Control 
                                        value={name}
                                        onChange={e=>setName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="1">
                                <Form.Group>
                                    <Form.Label>Visita </Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        checked={isVisita} 
                                        onChange={e=>setIsVisita(e.target.checked)} 
                                        disabled={!agenda?.permiteVisita}
                                    />                                   
                                </Form.Group>
                            </Col>
                            <Col xs="12" lg="2">
                                <Form.Group>
                                    <Form.Label className='d-block opacity-0'>Capacidad </Form.Label>
                                    <Button 
                                        type="button" 
                                        variant="secondary" 
                                        size="sm" 
                                        disabled={!name || residentes.length === reservaGlobal?.lugaresReservados}
                                        onClick={addResidente}
                                    >
                                        Aceptar
                                    </Button>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr />
                        <div className='d-flex'>
                            <div className='pr-2'>
                                <strong>Fecha: </strong>{reservaGlobal?.fechaReserva}
                            </div>
                            <div className='pr-2'>
                                <strong>Hora: </strong>{reservaGlobal?.horaReservada}
                            </div>
                            <div>
                                <strong>Espacios: </strong>{reservaGlobal?.lugaresReservados}
                            </div>
                        </div>
                        
                        <Table size='sm' bordered>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Lote</th>
                                    <th>Visita</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    residentes.map((res, index) => (
                                        <tr key={index}>
                                            <td>{res.name}</td>
                                            <td>{optLotesHijos.find(optL => optL.id === parseInt(res.lote))?.referencia ?? 'N/A'}</td>
                                            <td>{res.isVisita ? 'Si' : 'No'}</td>         
                                            <td><FaTrash className="text-danger cursor-pointer" onClick={e=>deleteResidente(index)}/></td>                                   
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
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
        </Row>
    )
}