import moment from "moment"
import React, { useContext, useEffect, useState } from "react"
import { Button, Dropdown, Form } from "react-bootstrap"
import { Col } from "react-bootstrap"
import { Row } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { toast, ToastContainer } from "react-toastify"
import { authContext } from "../context/AuthContext"
import CardSkeleton from "../loaders/CardSkeleton"
import { loaderRequest } from "../loaders/LoaderRequest"
import Get from "../service/Get"
import Post from "../service/Post"
import { CUOTA_CONDONAR, CUOTA_GET } from "../service/Routes"
import { calcAmount } from "../utils/calcAmount"
import { calcAmountCondonado } from "../utils/calcAmountCondonado"
import { formatNumber } from "../utils/formatNumber"

export default function CondonarCuota(){
    const {id} = useParams()
    const [codigo, setCodigo] = useState('')
    const [porcentaje, setPorcentaje] = useState('')
    const [razon, setRazon] = useState('')
    const { auth } = useContext(authContext)
    const [item, setItem] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [monto, setMonto] = useState(0)
    const [montoCondonado, setMontoCondonado] = useState(0)
    const [errorCode, setErrorCode] = useState(false)
    const [errorPorc, setErrorPorc] = useState(false)
    const [errorRazon, setErrorRazon] = useState(false)
    const [isSubmiting, setSubmiting] = useState(false)
    const history = useHistory()

    useEffect(()=>{
        Get({url: `${CUOTA_GET}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItem(response.data.data)           
            setMonto(calcAmount(response.data.data.costo, response.data.data.pagoCuotaList)-calcAmountCondonado(response.data.data.condonadasCuotas))
            setLoading(false)
        })
        .catch(error=>{
            //console.log(error)
            toast.error("Ocurrió un error. Intenta más tarde o contacte con el administrador", {autoClose: 8000})
            setLoading(false)
        })
    },[])

    const onChangePorcentage = value =>{
        setPorcentaje(value)
        if(value<0 || value > 100){
            setErrorPorc(true)
            if(value<0){
                setPorcentaje(0)
                setMontoCondonado(0)
                setMonto(calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))
            }else{
                setPorcentaje(100)
                setMonto(0)
                setMontoCondonado(calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))
            }            
        }else{
            setErrorPorc(false)
            setMonto((calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))-(((calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))*value)/100))
            setMontoCondonado((((calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))*value)/100))
        }        
    }
    const onHadleClickCondonar = e =>{
        let paso = true
        if(codigo===""){
            paso=false
            setErrorCode(true)
        }
        if(razon===""){
            paso=false
            setErrorRazon(true)
        }
        if(porcentaje < 0 || porcentaje > 100 || porcentaje === ""){
            paso=false
            setErrorPorc(true)
        }

        if(paso){
            setErrorCode(false)
            setErrorRazon(false)
            setErrorPorc(false)
            setSubmiting(true)
            const d = {
                id: id,
                monto: monto,
                codigo: codigo,
                razon: razon,
                porcentaje: porcentaje,
                montoCondonado: montoCondonado
            }
    
            console.log(d)
            Post({url: CUOTA_CONDONAR, data: d, access_token: auth.data.access_token, header: true})
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
                    <Card.Title>Condonar cuota</Card.Title>
                    <Dropdown.Divider />
                    <Row className="mb-4">                        
                        <Col>
                            <dl className="row">
                                <dd className="col-sm-3">Fecha creada</dd>
                                <dt className="col-sm-9">{moment(item.created_at).format('DD-MM-YYYY')}</dt>
                                <dd className="col-sm-3">Descripción</dd>
                                <dt className="col-sm-9">{`${item.tipoCuota.name}`}</dt>
                                <dd className="col-sm-3">Monto</dd>
                                <dt className="col-sm-9">{formatNumber(calcAmount(item.costo, item.pagoCuotaList)-calcAmountCondonado(item.condonadasCuotas))}</dt>                      
                                <dd className="col-sm-3">Estado pago</dd>
                                <dt className="col-sm-9">{item.pagoStatus}</dt>                      
                            </dl>
                        </Col>
                    </Row>
                    <Dropdown.Divider />
                    <Row>
                        <Col>
                            <h6>Monto a pagar: {formatNumber(monto)}</h6>
                        </Col>
                    </Row>
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
                        <Col xs="12" md="3">
                            <Form.Group>
                                <Form.Label>Porcentaje</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={porcentaje}
                                    onChange={e=>onChangePorcentage(e.target.value)}
                                    className={`${errorPorc && 'error'}`}
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
                            <Button variant="primary" onClick={onHadleClickCondonar}>Condonar cuota</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        }            
        </>
    )
}