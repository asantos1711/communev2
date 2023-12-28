import React, { useEffect, useState } from 'react'
import { Card, Dropdown, Row, Col } from 'react-bootstrap'
import Get from '../service/Get'
import { RESIDENTE_FOR_MULTA } from '../service/Routes'
import { Link } from 'react-router-dom'
import { MdAccountBalanceWallet } from 'react-icons/md'
import { RiAlarmWarningLine } from 'react-icons/ri'
import Skeleton from 'react-loading-skeleton'
import { toast, ToastContainer } from 'react-toastify'

export default function MultaDetailClient(props){
    const [residente, setResidente]  = useState({})
    const [isLoading, setLoading] = useState(true)

    useEffect(()=>{
        Get({url: `${RESIDENTE_FOR_MULTA}/${props.id}`, access_token: props.access_token})
        .then(response=>{
            //console.log(response)
            setResidente(response.data.data)
            props.handleDeudasMultas(response.data.data.multaList)
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            // console.log("error")
            // console.log(error)
        })
    },[])



    return(
        <Card className="shadow">
            <ToastContainer />
            <Card.Body>
                <Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Residente</span>
                        <ul className="list-inline mb-0">
                            <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/estado-cuenta/${props.id}`}><MdAccountBalanceWallet className="icon-m1" /> <small>Estado de cuenta</small></Link>
                            <Link className="list-inline-item btn btn-outline-secondary btn-sm" to={`/generar-sancion/${props.id}`}><RiAlarmWarningLine className="icon-m1"/> <small>Multas</small></Link>
                        </ul>
                    </div>
                </Card.Title>
                <Dropdown.Divider /> 
                {
                    isLoading ? <Skeleton height={200}/>
                    : <Row>
                        <Col xs lg="6">
                            <Row>
                                <Col xs="12" lg="12">
                                    <label>Nombre: {residente.name}</label>
                                </Col>
                                <Col xs="12" lg="12">
                                    <label>Email: {residente.email}</label>
                                </Col>
                                <Col xs="12" lg="12">
                                    <label>Teléfono: {residente.phone}</label>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs lg="6"></Col>
                    </Row>
                }
            </Card.Body>
        </Card>
    )
}