import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import { Row, Col, Card, Dropdown, Jumbotron, Container } from 'react-bootstrap'
import Get from '../service/Get'
import { CAJA_GET_ACTIVE, GET_LOTE_PAGO_MTTO, METODO_PAGO_GET } from '../service/Routes'
import PagoDetailLoteMtto from '../components/PagoDetailLoteMtto'
import CardSkeleton from '../loaders/CardSkeleton'
import ListMttos from '../components/ListMttos'
import Skeleton from 'react-loading-skeleton'
import PayMtto from '../components/PayMtto'
import { RiArrowGoBackLine } from 'react-icons/ri'
import FacturaNoGenerada from '../components/FacturaNoGenerada'

export default function VistaPagoMantenimientoLote(){
    const {id} = useParams()
    const {auth} = useContext(authContext)
    const [isLoading, setLoading] = useState(true)
    const [item, setItem] = useState(null)
    const [mttos, setMttos] = useState([])
    const [descuentos, setDescuentos] = useState([])
    const [loteDiscount, setLoteDiscount] = useState(null)
    const [cuota, setCuota] = useState(0)
    const [fondos, setFondos] = useState(null)
    const [diaCorte, setDiaCorte] = useState(0)
    let history = useHistory()
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [interesesMoratorios, setInteresesMoratorios] = useState([]) 
    
    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState([])
    const [cajaOpt, setCajaOpt] = useState([])
    const [mensajeProveedor, setMensajeProveedor] = useState('')


    useEffect(()=>{
        setLoading(true)
        Get({url: `${GET_LOTE_PAGO_MTTO}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            console.log(response)
            const d ={
                id: response.data.data.idLote,
                referencia: response.data.data.referencia,
                asociado: response.data.data.asociado,
                fondo: response.data.data.fondo,
                direccion: response.data.data.direccion,
            }
            setItem(d)
            setMttos(response.data.data.mantenimientos)
            setDescuentos(response.data.data.descuentos)
            setLoteDiscount(response.data.data.discount)
            setCuota(response.data.data.cuota)
            setFondos(response.data.data.fondo)
            setDiaCorte(response.data.data.diaCorte)
            setInteresesMoratorios(response.data.data.interesesMoratoriosList)
            Get({url: METODO_PAGO_GET, access_token: auth.data.access_token})
            .then(response=>{
                setMetodoPagoOpt(response.data)
                setLoading(false)
            })
            .catch(error=>{
                //console.log(error)
            })
        })
        .catch(error=>{
            //console.log(error)
        })

        //cajas para pagar
        Get({url: CAJA_GET_ACTIVE, access_token: auth.data.access_token})
        .then(response=>{
            setCajaOpt(response.data)
        })
        .catch(error=>{
            //error
        })
    },[])

    return(
        <div>
            {
                !seFacturo ? <FacturaNoGenerada cobros={cobros} mensajeProveedor={mensajeProveedor} access_token={auth.data.access_token}/> :
                <div>
                    <Row className="mb-1">
                        <Col className="text-right">
                            <span className="badge badge-pill badge-dark go-back" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col>
                            {
                            isLoading ? <CardSkeleton height={80} /> : <PagoDetailLoteMtto item={item} />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="shadow">
                                {
                                    isLoading ? <Skeleton height={400}/> :
                                    <Card.Body>
                                        <Card.Title><h5>Mantenimientos</h5></Card.Title>
                                        <Dropdown.Divider />
                                        {
                                            mttos.length>0 
                                            ? <Row>
                                                <Col xs lg="8">
                                                    <ListMttos mantenimientos={mttos} descuentos={descuentos} discount={loteDiscount}/>
                                                </Col>
                                                <Col xs lg="4">
                                                    <PayMtto 
                                                        access_token={auth.data.access_token}
                                                        id={item.id}
                                                        mttos={mttos} 
                                                        descuentos={descuentos} 
                                                        discount={loteDiscount} 
                                                        cuota={cuota} 
                                                        fondos={fondos} 
                                                        diaCorte={diaCorte}
                                                        metodoPagoOpt={metodoPagoOpt}
                                                        interesesMoratorios={interesesMoratorios}
                                                        setSeFacturo={setSeFacturo}
                                                        setCobros={setCobros}
                                                        cajaOpt={cajaOpt}
                                                        setMensajeProveedor={setMensajeProveedor}
                                                    />
                                                </Col>
                                            </Row>
                                            : <Row>
                                                <Col>
                                                    <Jumbotron fluid><Container><p className="text-center">No existen mantenimientos a pagar.</p></Container></Jumbotron>
                                                </Col>
                                            </Row>
                                        }
                                        
                                    </Card.Body>
                                }
                            </Card>                    
                        </Col>
                    </Row>
                </div>
            }
        </div>              
    )
}