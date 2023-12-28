import React, { useContext, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import { Row, Col, Card, Dropdown, Form, Accordion, Button } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import CardSkeleton from '../loaders/CardSkeleton'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { METODO_PAGO_GET, CARGO_CUOTA_EXTRAORDINARIA_GET_BY_ID, PAGO_CARGO_CUOTA_EXTRAORDINARIA_SAVE, CAJA_GET_ACTIVE } from '../service/Routes'
import GetAll from '../service/GetAll'
import { calcAmount } from '../utils/calcAmount'
import { validNumberPositive } from '../utils/validNumberPositive'
import Post from '../service/Post'
import FacturaNoGenerada from '../components/FacturaNoGenerada'
import moment from 'moment'
import { formatNumber } from '../utils/formatNumber'
import InputMask from "react-input-mask";
import DatePicker from 'react-datepicker'
import Get from '../service/Get'

export default function PagarCuotaExtraordinaria(){
    const {id} = useParams()
    const { auth } = useContext(authContext)
    const[isLoading, setLoading] = useState(true)
    const [sancion, setSancion] = useState(null)
    const history = useHistory()
    const [isSubmiting, setSubmiting] = useState(false)

    const [caja, setCaja] = useState('')
    const [metodoPago, setMetodoPago] = useState('')
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [referencia, setReferencia] = useState('')
    const [inputMonto, setInputMonto] = useState(0)
    const [validInput, setValidInput] = useState(true)

    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState([])
    const [errorNoCuenta, setErrorNoCuenta] = useState(true)
    const [noCuenta, setNoCuenta] = useState('')
    const [fechaPago, setFechaPago] = useState(new Date())
    const [cajaOpt, setCajaOpt] = useState([])

    useEffect(()=>{
        const urls = [METODO_PAGO_GET, `${CARGO_CUOTA_EXTRAORDINARIA_GET_BY_ID}/${id}`]
        GetAll({urls: urls, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setMetodoPagoOpt(response[0].data)
            setMetodoPago(response[0].data[0].id)
            setSancion(response[1].data.data)
            setInputMonto(calcAmount(response[1].data.data.monto, response[1].data.data.pagoCuotaExtraordinariaList))
            setLoading(false)
            
        })
        .catch(error=>{
            //console.log(error)
        })

        //cajas para pagar
        Get({url: CAJA_GET_ACTIVE, access_token: auth.data.access_token})
        .then(response=>{
            setCajaOpt(response.data)
            if(response.data.length > 0){
                setCaja(response.data[0].id)
            }
        })
        .catch(error=>{
            //error
        })

    },[])


    const handleChangeMetodoPago = value =>{
        setMetodoPago(value)
        // if(value==='fondo'){
        //     if(multa.fondo>=calcAmount(multa.tipoMulta.monto, multa.pagosMultas)){
        //         setInput(0)
        //     }else{
        //         setInput(calcAmount(multa.tipoMulta.monto, multa.pagosMultas)-multa.fondo)
        //     }
        // }else{
        //     setInput(calcAmount(multa.tipoMulta.monto, multa.pagosMultas))
        // }
        // setMetodoPago(value)
    }

    const onClickPayment = e =>{
        if(validNumberPositive(inputMonto, false)){
            setValidInput(true)
            setSubmiting(true)

            const d = {
                id: "",
                cargoCuotaExtraordinaria: {id: id},
                referencia: referencia,
                metodoPago: {id: parseInt(metodoPago)},
                caja: {id: caja},
                pagado: inputMonto,
                noCuenta:noCuenta,
                fechaPago: moment(fechaPago).format("YYYY-MM-DD"),
            }

            //console.log(d)

            Post({url: PAGO_CARGO_CUOTA_EXTRAORDINARIA_SAVE, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                //console.log(response)
                setSubmiting(false)
                if(response.data.data.seFacturo){
                    history.push(`/factura-generada/${response.data.data.idFactura}`)
                }else{
                    setSeFacturo(false)
                    setCobros(response.data.data.cobrosIdentificadoresList)
                }
            })
            .catch(error=>{
                setSubmiting(false)
                //console.log(error)
                toast.error("Ocurrió error en el servidor. Contacte con el administrador", {autoClose: 8000})
            })

        }else{
            setValidInput(false)
        }
    }


    return(
        <div>
            {
                 !seFacturo ? <FacturaNoGenerada cobros={cobros} access_token={auth.data.access_token}/> :
                 <div>
                    <Row>
                        <ToastContainer />
                        {isSubmiting && loaderRequest()}

                        <Col className="text-right">
                            {
                                !isLoading && <span className="badge badge-pill badge-dark go-back mb-2" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>       
                            }
                        </Col>
                    </Row>
                    <Row>
                        {
                            isLoading ?  <CardSkeleton height={500}/> :
                            <Col>
                                <Card className="shadow">
                                    <Card.Body>
                                        <Card.Title>Detalle de pago</Card.Title>
                                        <Dropdown.Divider />  
                                        <Row>
                                            <Col xs="6" md="6">
                                                <dl className="row">
                                                    <dt className="col-sm-12">{sancion.cuotaExtraordinaria.name}</dt>

                                                    <dd className="col-sm-3">Fecha creada</dd>
                                                    <dt className="col-sm-9">{moment(sancion.createAt).format('DD-MM-YYYY')}</dt>  
                                                    <dd className="col-sm-3">Descripción</dd>
                                                    <dt className="col-sm-9">{sancion.cuotaExtraordinaria.descripcion}</dt>
                                                    <dd className="col-sm-3">Estado pago</dd>
                                                    <dt className="col-sm-9">{sancion.status}</dt>
                                                    <dt className="col-sm-3">Total</dt>
                                                    <dt className="col-sm-9">{formatNumber(sancion.monto)}</dt>                      
                                                </dl>

                                                <Accordion>
                                                    <Card>
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                Historial de pagos    
                                                            </Accordion.Toggle>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <ul>
                                                                    {
                                                                        sancion.pagoCuotaExtraordinariaList.length === 0
                                                                        ? <li>No hay pagos registrados hasta el momento</li>
                                                                        : sancion.pagoCuotaExtraordinariaList.map((item,i)=>(
                                                                            <li key={i}>
                                                                                {
                                                                                    item.pagoStatus ==='cancelado' ?
                                                                                    <span className="text-danger">{moment(item.create_at).format("DD-MMM-YYYY HH:mm")}{' - '}<strong>{formatNumber(item.pagado)}</strong> - CXLD</span>:
                                                                                    <span>{moment(item.create_at).format("DD-MMM-YYYY HH:mm")}{' - '}<strong>{formatNumber(item.pagado)}</strong></span>
                                                                                }                                                                                
                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                </Accordion>
                                            </Col>
                                            <Col xs lg={{span: 3, offset: 3}}>
                                                <Form.Group>
                                                    <Form.Label>Fecha pago</Form.Label>
                                                    <DatePicker className="form-control"
                                                            showPopperArrow={false}
                                                            selected={fechaPago}
                                                            autoComplete="off"
                                                            dateFormat="dd-MM-yyyy"
                                                            onChange={date => {
                                                                if(date===null){
                                                                    setFechaPago(new Date())
                                                                }else{
                                                                    setFechaPago(date)
                                                                }                                                                
                                                            }}
                                                        />                         
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Caja</Form.Label>
                                                    <Form.Control as="select"
                                                        value={caja}
                                                        onChange={e=>setCaja(e.target.value)}
                                                    >
                                                        {
                                                            cajaOpt.map((item,i)=>(
                                                                <option key={i} value={item.id}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Método de pago</Form.Label>
                                                    <Form.Control as="select"
                                                        value={metodoPago}
                                                        onChange={e=>handleChangeMetodoPago(e.target.value)}
                                                    >
                                                        {
                                                        metodoPagoOpt.map((item, i)=>(
                                                            <option key={i} value={item.id}>{item.name}</option>
                                                        ))
                                                    }
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Referencia</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={referencia}
                                                        onChange={e=>setReferencia(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>No. cuenta</Form.Label>
                                                    <InputMask
                                                        className={`${!errorNoCuenta && 'error'} form-control`} 
                                                        mask="9999" 
                                                        onChange={e=>{
                                                            if(e.target.value === ""){
                                                                setErrorNoCuenta(false)
                                                            }else{
                                                                setErrorNoCuenta(true)
                                                            }
                                                            setNoCuenta(e.target.value)
                                                        }}
                                                        value={noCuenta}
                                                    />
                                                </Form.Group>
                                                <div className="text-right">
                                                    <span>Monto a pagar</span>
                                                    <Form.Control className={`input-pay mb-2 w-50`} 
                                                        type="number" min="1" 
                                                        value={inputMonto} 
                                                        onChange={e=>{
                                                            var regex = /^[0-9\s]*$/;
                                                            if(e.target.value !== "" && regex.test(e.target.value)){
                                                                setInputMonto(parseInt(e.target.value))
                                                            }else if(e.target.value === ""){
                                                                setInputMonto(e.target.value)
                                                            }else{
                                                                setInputMonto(0)
                                                            }                                            
                                                        }}
                                                    />
                                                    {!validInput && <div className="text-danger mb-2"><small>Campo inválido</small></div>}
                                                    <Button variant="primary" onClick={onClickPayment}>Pagar</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        }
                    </Row>
                 </div>
            }
        </div>
    )
}