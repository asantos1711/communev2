import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { authContext } from '../context/AuthContext';
import Get from '../service/Get';
import { CAJA_GET_ACTIVE, CUOTA_GET, METODO_PAGO_GET, PAGO_CUOTA_SAVE } from '../service/Routes';
import { calcAmount } from '../utils/calcAmount';
import { validNumberPositive } from '../utils/validNumberPositive';
import moment from 'moment';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import FacturaNoGenerada from '../components/FacturaNoGenerada';
import { Col, Row } from 'react-bootstrap';
import { loaderRequest } from '../loaders/LoaderRequest';
import CardSkeleton from '../loaders/CardSkeleton';
import ResidenteDetail from '../components/ResidenteDetail';
import CuotaDetail from '../components/CuotaDetail';

export default function PagarCuota(){
    let { id } = useParams()
    const { auth } = useContext(authContext)
    const[cuota, setCuota] = useState(null)
    const[isLoading, setLoading] = useState(true)
    let history = useHistory()
    const [isSubmiting, setSubmiting] = useState(false)
    const [input, setInput] = useState(0)
    const [metodoPago, setMetodoPago] = useState('')
    const [referencia, setReferencia] = useState('')
    const [caja, setCaja] = useState('')
    const [applyDescuento, setApplyDescuento] = useState(0)
    const [autorizado, setAutorizado] = useState('')
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState([])
    const [validInput, setValidInput] = useState(true)
    const [fechaPago, setFechaPago] = useState(new Date())
    const [errorNoCuenta, setErrorNoCuenta] = useState(true)
    const [noCuenta, setNoCuenta] = useState('')
    const [cajaOpt, setCajaOpt] = useState([])

    useEffect(()=>{
        setLoading(true)
        Get({url: `${CUOTA_GET}/${id}`, access_token: auth.data.access_token})
        .then(response=>{            
            //console.log(response)
            setCuota(response.data.data)
            setInput(calcAmount(response.data.data.costo, response.data.data.pagoCuotaList.filter(x=>x.pagoStatus==='recibido')))
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
        
    }, [id])

    const handleChangeMetodoPago = value =>{
        setInput(calcAmount(cuota.costo, cuota.pagoCuotaList.filter(x=>x.pagoStatus==='recibido')))
        setMetodoPago(value)
    }

    const handlePayment = e =>{

        //validar numero positivo mayor a 0
        if(validNumberPositive(input, false)){
            setValidInput(true)
            setSubmiting(true)
            const d ={
                id: "",
                cuotaTransient: {id: cuota.id},
                pagado: input,
                referencia: referencia,
                metodoPago: {id: metodoPago},
                caja: {id: caja},
                applyDescuento: parseFloat(applyDescuento),
                autorizado: autorizado,
                fecha_pago: moment(fechaPago).format("YYYY-MM-DD"),
                noCuenta:noCuenta
            }
            //console.log(d)
            Post({url: PAGO_CUOTA_SAVE, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                setSubmiting(false)
                // console.log(response)
                if(response.data.success){
                    if(response.data.data.seFacturo){
                        history.push(`/factura-generada/${response.data.data.idFactura}`)
                    }else{
                        setSeFacturo(false)
                        setCobros(response.data.data.cobrosIdentificadoresList)
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

    return(
        <div>
            {
                !seFacturo ? <FacturaNoGenerada cobros={cobros} access_token={auth.data.access_token}/> 
                : <Row>
                    <ToastContainer />
                    {isSubmiting && loaderRequest()}
                    <Col>
                        <Row className="mb-4">
                            <Col>
                                {
                                    isLoading ? <CardSkeleton height={200}/>
                                    : <ResidenteDetail lote={cuota} directions={null} />
                                }  
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col>
                                {
                                    isLoading ? <CardSkeleton height={500}/>
                                    : <CuotaDetail 
                                        valid={validInput}
                                        cuota={cuota} 
                                        handlePayment={input=>handlePayment(input)}
                                        input={input}
                                        handleChangeMetodoPago={handleChangeMetodoPago}
                                        setInput={setInput}
                                        metodoPago={metodoPago}
                                        referencia={referencia}
                                        setReferencia={setReferencia}
                                        caja={caja}
                                        setCaja={setCaja}
                                        applyDescuento={applyDescuento}
                                        setApplyDescuento={setApplyDescuento}
                                        autorizado={autorizado}
                                        setAutorizado={setAutorizado}
                                        setFechaPago={setFechaPago}
                                        fechaPago={fechaPago}
                                        metodoPagoOpt={metodoPagoOpt}
                                        access_token={auth.data.access_token}
                                        errorNoCuenta={errorNoCuenta}
                                        setErrorNoCuenta={setErrorNoCuenta}
                                        noCuenta={noCuenta}
                                        setNoCuenta={setNoCuenta}
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