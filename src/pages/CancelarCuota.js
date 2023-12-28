import moment from "moment"
import React, { useContext, useEffect, useState } from "react"
import { Button, Col, Form } from "react-bootstrap"
import { Card, Dropdown, Row } from "react-bootstrap"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { toast, ToastContainer } from "react-toastify"
import { authContext } from "../context/AuthContext"
import CardSkeleton from "../loaders/CardSkeleton"
import { loaderRequest } from "../loaders/LoaderRequest"
import Get from "../service/Get"
import Post from "../service/Post"
import { CUOTA_CANCELAR, CUOTA_GET } from "../service/Routes"
import { formatNumber } from "../utils/formatNumber"

export default function CancelarCuota(){
    const {id} = useParams()
    const [codigo, setCodigo] = useState('')
    const [razon, setRazon] = useState('')
    const { auth } = useContext(authContext)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [errorCode, setErrorCode] = useState(false)
    const [errorRazon, setErrorRazon] = useState(false)
    const [isSubmiting, setSubmiting] = useState(false)
    const history = useHistory()

    useEffect(()=>{
        Get({url: `${CUOTA_GET}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItem(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
            toast.error("Ocurrió un error. Intenta más tarde o contacte con el administrador", {autoClose: 8000})
            setLoading(false)
        })
    },[])

    const onHadleClickCancelar = e =>{
        let paso = true
        if(codigo===""){
            paso=false
            setErrorCode(true)
        }
        if(razon===""){
            paso=false
            setErrorRazon(true)
        }        

        if(paso){
            setErrorCode(false)
            setErrorRazon(false)
            setSubmiting(true)
            const d = {
                id: id,
                codigo: codigo,
                razon: razon,
            }
    
            //console.log(d)
            Post({url: CUOTA_CANCELAR, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                if(response.data.success){
                    toast.success("Acción exitosa", {autoClose: 2000})
                    setSubmiting(false)
                    history.goBack()
                }else{
                    toast.info(response.data.message, {autoClose: 10000})
                    setSubmiting(false)
                }
            })
        }        
    }

    return(
        <>
        {isSubmiting && loaderRequest()}
        <ToastContainer />
        {
            isLoading ? <CardSkeleton  height={400}/> :
            <Card className="shadow">
                <Card.Body>
                    <Card.Title>Cancelar cuota</Card.Title>
                    <Dropdown.Divider />
                    <Row className="mb-4">                        
                        <Col>
                            <dl className="row">
                                <dd className="col-sm-3">Fecha creada</dd>
                                <dt className="col-sm-9">{moment(item.created_at).format('DD-MM-YYYY')}</dt>
                                <dd className="col-sm-3">Descripción</dd>
                                <dt className="col-sm-9">{`${item.tipoCuota.name}`}</dt>
                                <dd className="col-sm-3">Monto</dd>
                                <dt className="col-sm-9">{formatNumber(item.costo)}</dt>                      
                                <dd className="col-sm-3">Estado pago</dd>
                                <dt className="col-sm-9">{item.pagoStatus}</dt>                      
                            </dl>
                        </Col>
                    </Row>
                    <Dropdown.Divider />
                    <Row>
                        <Col xs="12" md="3">
                            <Form.Group>
                                <Form.Label>Código de autorización</Form.Label>
                                <Form.Control 
                                    type="text"
                                    value={codigo}
                                    onChange={e=>setCodigo(e.target.value)}
                                    className={`${errorCode && 'error'}`}
                                />                                                            
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" md="6">
                            <Form.Group>
                                <Form.Label>Razón</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    cols='3'
                                    value={razon}
                                    onChange={e=>setRazon(e.target.value)}
                                    className={`${errorRazon && 'error'}`}
                                />                                                            
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={onHadleClickCancelar}>Cancelar cuota</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        }            
        </>
    )
}