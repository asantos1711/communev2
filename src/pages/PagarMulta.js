import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Get from '../service/Get'
import { MULTA_GET, PAGOS_MULTAS_SAVE, METODO_PAGO_GET, CAJA_GET_ACTIVE } from '../service/Routes'
import { authContext } from '../context/AuthContext'
import { Row, Col } from 'react-bootstrap'
import ResidenteDetail from '../components/ResidenteDetail'
import SancionDetail from '../components/SancionDetail'
import { validNumberPositive } from '../utils/validNumberPositive'
import { loaderRequest } from '../loaders/LoaderRequest'
import Post from '../service/Post'
import { toast, ToastContainer } from 'react-toastify'
import CardSkeleton from '../loaders/CardSkeleton'
import { calcAmount } from '../utils/calcAmount'
import { RiArrowGoBackLine } from 'react-icons/ri'
import FacturaNoGenerada from '../components/FacturaNoGenerada'
import { calcAmountCondonado } from '../utils/calcAmountCondonado'
import moment from 'moment';

export default function PagarMulta(){
    let { id } = useParams()
    const { auth } = useContext(authContext)
    const[multa, setMulta] = useState(null)
    const[isLoading, setLoading] = useState(true)
    let history = useHistory()
    const [isSubmiting, setSubmiting] = useState(false)
    const [input, setInput] = useState(0)
    const [metodoPago, setMetodoPago] = useState('')
    const [referencia, setReferencia] = useState('')
    const [caja, setCaja] = useState('Caja 1')
    const [applyDescuento, setApplyDescuento] = useState(0)
    const [autorizado, setAutorizado] = useState('')
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState([])
    const [mensajeProveedor, setMensajeProveedor] = useState('')
    const [noCuenta, setNoCuenta] = useState('')
    const [errorNoCuenta, setErrorNoCuenta] = useState(true)
    const [fechaPago, setFechaPago] = useState(new Date())
    const [cajaOpt, setCajaOpt] = useState([])

    useEffect(()=>{
        setLoading(true)
        Get({url: `${MULTA_GET}/${id}`, access_token: auth.data.access_token})
        .then(response=>{            
            //console.log(response)
            setMulta(response.data.data)
            setInput(calcAmount(response.data.data.costo, response.data.data.pagosMultas)-calcAmountCondonado(response.data.data.condonadasMultas))
            Get({url: METODO_PAGO_GET, access_token: auth.data.access_token})
            .then(response=>{
                setMetodoPago(response.data[0].id)
                setMetodoPagoOpt(response.data)
                setLoading(false)
            })
            .catch(error=>{
                // console.log(error)
            })
            
        })
        .catch(error=>{
            // console.log(error)
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
        
    }, [id,auth.data.access_token])

    const [validInput, setValidInput] = useState(true)

    const handlePayment = e =>{

        //validar numero positivo mayor a 0
        if(validNumberPositive(input)){
            setValidInput(true)
            setSubmiting(true)
            const d ={
                id: "",
                loteTransient: {id: multa.direccion.id_lote},
                multaTransient: {id: multa.id},
                pagado: input,
                referencia: referencia,
                metodoPago: {id: metodoPago},
                caja: {id: caja},
                applyDescuento: parseFloat(applyDescuento),
                autorizado: autorizado,
                noCuenta: noCuenta,
                fecha_pago: moment(fechaPago).format("YYYY-MM-DD"),
            }
            //console.log(d)
            Post({url: PAGOS_MULTAS_SAVE, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                setSubmiting(false)
                // console.log(response)
                if(response.data.success){
                    if(response.data.data.seFacturo){
                        history.push(`/factura-generada/${response.data.data.idFactura}`)
                    }else{
                        setSeFacturo(false)
                        setCobros(response.data.data.cobrosIdentificadoresList)
                        setMensajeProveedor(response.data.data.responseFromProveedor)
                    }
                }else{
                    toast.info("Código de autorización es incorrecto o no se puede usar más. Intente de nuevo por favor", {autoClose: 8000})
                }             


                // if(response.data.success){
                //     setFacturar(response.data.data)
                //     setVistaFacturar(true)
                // }else{
                //     toast.info("Código de autorización es incorrecto o no se puede usar más. Intente de nuevo por favor", {autoClose: 8000})
                // }
                
            })
            .catch(error=>{
                // console.log(error)
            })
        }else{
            setValidInput(false)
        }
    }

    const handleChangeMetodoPago = value =>{
        if(value==='fondo'){
            if(multa.fondo>=calcAmount(multa.costo, multa.pagosMultas)){
                setInput(0)
            }else{
                setInput(calcAmount(multa.costo, multa.pagosMultas)-multa.fondo)
            }
        }else{
            setInput(calcAmount(multa.costo, multa.pagosMultas))
        }
        setMetodoPago(value)
    }

    return(
        <div>
            {
                !seFacturo ? <FacturaNoGenerada cobros={cobros} mensajeProveedor={mensajeProveedor} access_token={auth.data.access_token}/> 
                : <Row>
                    <ToastContainer />
                    {isSubmiting && loaderRequest()}
                    <Col>
                        <Row className="mb-1">
                            <Col className="text-right">
                                {
                                    isLoading ? <CardSkeleton height={25} /> : <span className="badge badge-pill badge-dark go-back" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>                  
                                } 
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                {
                                    isLoading ? <CardSkeleton height={200}/>
                                    : <ResidenteDetail lote={multa} directions={null} fondo={multa.fondo}/>
                                }  
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                {
                                    isLoading ? <CardSkeleton height={500}/>
                                    : <SancionDetail 
                                        valid={validInput}
                                        multa={multa} 
                                        handlePayment={input=>handlePayment(input)}
                                        input={input}
                                        setInput={setInput}
                                        metodoPago={metodoPago}
                                        handleChangeMetodoPago={handleChangeMetodoPago}
                                        referencia={referencia}
                                        setReferencia={setReferencia}
                                        caja={caja}
                                        setCaja={setCaja}
                                        applyDescuento={applyDescuento}
                                        setApplyDescuento={setApplyDescuento}
                                        autorizado={autorizado}
                                        setAutorizado={setAutorizado}
                                        fondo={multa.fondo}
                                        metodoPagoOpt={metodoPagoOpt}
                                        access_token={auth.data.access_token}
                                        noCuenta={noCuenta}
                                        setNoCuenta={setNoCuenta}
                                        errorNoCuenta={errorNoCuenta}
                                        setErrorNoCuenta={setErrorNoCuenta}
                                        setFechaPago={setFechaPago}
                                        fechaPago={fechaPago}
                                        cajaOpt={cajaOpt}
                                    />
                                }  
                            </Col>
                        </Row>                                                     
                    </Col>
                </Row>
            }            
        </div>
        
    )
}