import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import Get from '../../service/Get';
import { GET_AGENDA_BY_FECHA_LOTEHIJOS_AMENIDAD, LOTE_GET, TIPOAMENIDAD_GET_ACTIVAS } from '../../service/Routes';
import { toast } from "react-toastify";
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
import Select  from "react-select";
import { loaderRequest } from '../../loaders/LoaderRequest';
import DatePicker from 'react-datepicker';

export default function  VerReserva(){
    const [lote, setLote] = useState('')
    const [lotesOpt, setLotesOpt] = useState([])
    const { auth } = useContext(authContext)
    const [reservas, setReservas] = useState([])
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [doFind, setDoFind] = useState(false)
    const [fechaReserva, setFechaReserva] = useState(new Date())

    useEffect(() => {
        Get({url: `${LOTE_GET}/habitacional`, access_token: auth.data.access_token})
        .then(response=>{
            setLotesOpt(response.data)
        })
        .catch(error=>{
            //console.log(error)
        })
    }, [])

    const buscarHorarios = () =>{
        setIsSubmiting(true)
        let url = `${GET_AGENDA_BY_FECHA_LOTEHIJOS_AMENIDAD}/${lote.value}/${moment(fechaReserva).format("YYYY-MM-DD")}`
        Get({url: url, access_token: auth.data.access_token})
        .then(response=>{
            setDoFind(true)
            //console.log(response)
            if(response.data.success){
                setReservas(response.data.data)
            }else{
                setReservas([])
                toast.error(response.data.message, {autoClose: 8000})
            }
            setIsSubmiting(false)
        })
        .catch(error=>{
            setDoFind(true)
            setIsSubmiting(false)
            toast.error("No podemos obtener la información, intente más tarde o contacte con el administrador", {autoClose: 8000})
        })
    }

    return (
        <>
            {isSubmiting && loaderRequest()}
            <Row>
                <Col xs="12" lg="6">
                    <Form.Group>
                        <Form.Label>Lote</Form.Label>
                        <Select 
                            options={lotesOpt.map(item=>({label: `ref: ${item.referencia}. Propietario: ${item.residente_name}`, value: item.id}))} 
                            isClearable
                            value={lote}
                            onChange={(value)=>setLote(value)}
                            placeholder="Seleccionar opción"
                        />
                    </Form.Group>
                </Col>
                <Col xs="12" md="3">
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <DatePicker 
                            className="form-control"
                            selected={fechaReserva}
                            onChange={date => {
                                if(!date){
                                    setFechaReserva(new Date())
                                }else{
                                    setFechaReserva(date)
                                }
                            }}
                            dateFormat="dd-MM-yyyy"
                        />
                    </Form.Group>
                </Col>
                <Col xs="12" lg="3">
                    <Form.Group>
                        <Form.Label className='opacity-0 d-block'>Lote</Form.Label>
                        {
                            (lote && fechaReserva) ?
                            <Button variant="primary" type="button" onClick={buscarHorarios}>Buscar</Button> :
                            <Button variant="primary" type="button" disabled>Buscar</Button>
                        }
                    </Form.Group>                    
                </Col>
            </Row>

            <Row className="mt-3">
                <Col xs="12" md="12">
                    {
                        !doFind && 
                        <Alert variant="secondary" className="text-center">Por favor filtre por los criterios de búsqueda</Alert>
                    }
                    {
                        (doFind && reservas.length) === 0 ?
                        <Alert variant="info" className="text-center">No hay horarios disponibles</Alert> :
                        reservas.map((item, index) => (
                            <div key={index} className="bg-light px-2 py-1 rounded my-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className='m-0 text-primary'>{item.agenda.tipoAmenidad?.name}</h6>
                                        {item.variacion && <span className='ft-0-8rem d-block'><strong>Lugar: </strong>{item.agenda?.tipoAmenidadVariacionesList?.find(it=>it.id===item.variacion)?.name}</span>}
                                        <span className='ft-0-8rem d-block'><strong>Lugares: </strong>{item.lugares}</span>
                                        <span className='ft-0-8rem d-block'><strong>Fecha: </strong>{moment(item.fecha, "YYYY-MM-DD").format("DD-MM-YYYY")}</span>
                                        <span className='ft-0-8rem d-block'><strong>Hora:</strong> {item.hora}</span>
                                    </div>                                    
                                </div>
                            </div>
                        ))
                    }
                </Col>
            </Row>
        </>
    )

}