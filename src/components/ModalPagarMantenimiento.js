import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { FaBullhorn } from 'react-icons/fa';
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { getIntervalDateMtto } from '../utils/getIntervalDateMtto';
import { METODO_PAGO_GET, MODAL_LOTE_GET_MTTOS, COBRO_MTTO_SAVE, CAJA_GET_ACTIVE } from '../service/Routes';
import GetAll from '../service/GetAll';
import MiniLoad from '../loaders/MiniLoad';
import moment from 'moment'
import Post from '../service/Post';
import { useHistory } from 'react-router-dom';
import FacturaNoGenerada from './FacturaNoGenerada';
import { getTotalMttoFuturo } from '../utils/getTotalMttoFuturo';
import { toast } from 'react-toastify';
import InputMask from "react-input-mask";
import Get from '../service/Get';

registerLocale("es", es);


export default function ModalPagarMantenimiento({auth, id}){    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isLoading, setLoading] = useState(true)
    const [caja, setCaja] = useState('')
    const [metodoPago, setMetodoPago] = useState(null)
    const [metodoPagoOpt, setMetodoPagoOpt] = useState([])
    const [referencia, setReferencia] = useState('')
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [item, setItem] = useState(null)
    const [arrayDates, setArrayDates] = useState(getIntervalDateMtto(startDate, endDate))
    const [total, setTotal] = useState(0)
    const [texto, setTexto] = useState('Cargando valores')
    const history = useHistory()
    const [fechaPagoReal, setFechaPagoReal] = useState(new Date())
    const [noCuenta, setNoCuenta] = useState('')
    const [errorNoCuenta, setErrorNoCuenta] = useState(true)

    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState([])
    const [cajaOpt, setCajaOpt] = useState([])

    useEffect(() => {
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
    }, [])

    const handleShow = e => {
        setLoading(true)
        //peticion a buscar los mttos que debe o el ultimo que pago o los que pagara
        const urls = [METODO_PAGO_GET, `${MODAL_LOTE_GET_MTTOS}/${id}`]
        GetAll({urls: urls, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setMetodoPagoOpt(response[0].data)
            setMetodoPago(response[0].data[0].id)

            const mtos = [response[1].data.data.fechaUltimoMtto.split('T')[0]]
            setTotal(getTotalMttoFuturo(response[1].data.data.descuento,mtos, response[1].data.data.reglasDescuentosList,  response[1].data.data.cuota))
            //setTotal(getTotalMtto(response[1].data.data.descuento, mtos, response[1].data.data.reglasDescuentosList, response[1].data.data.cuota))

            
            setItem(response[1].data.data)       
        
            
            setStartDate(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`))
            setEndDate(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`))
            setArrayDates(getIntervalDateMtto(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`), new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`)))
            //ver si la fecha ultimo es mayor que la fecha actual entonces se setean los valores los dos a fecha ultimo
            // const d1 = moment(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`))
            // if(parseInt(d1.format('MM')) > parseInt(moment().format('MM'))){
            //     setArrayDates(getIntervalDateMtto(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`), new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`)))
            //     setEndDate(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`))
            // }else{
            //     setArrayDates(getIntervalDateMtto(new Date(`${response[1].data.data.fechaUltimoMtto.split('T')[0]}T00:00`), new Date(`${moment().format('YYYY')}-${moment().format('MM')}-${response[1].data.data.diaCorte}T00:00`)))
            //     setEndDate(new Date(`${moment().format('YYYY')}-${moment().format('MM')}-${response[1].data.data.diaCorte}`))
            // }
            
            setLoading(false)
        })
        .catch(error=>{
            setLoading(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            //console.log(error)
        })
        
        //console.log('entro')
        setShow(true)
    };

    const handleHasta = date =>{
        date = new Date(date.getFullYear(), date.getMonth(), item.diaCorte)
        //console.log(date)
        setEndDate(date)

        let arrayDates = getIntervalDateMtto(startDate, date)
        //console.log(arrayDates)
        setArrayDates(arrayDates)
        var t = 0;
        if(item.mantenimientos.length > 0){
            t = getTotalMttoFuturo(item.descuento,arrayDates, item.reglasDescuentosList,  item.cuota)
        }else{
            t = getTotalMttoFuturo(item.descuento,arrayDates, item.reglasDescuentosList,  item.cuota)
        }
        setTotal(t)
    }

    const [validTotal, setValidTotal] = useState(true)
    const onClickPagar = e =>{
        if(total <= 0){
            setValidTotal(false)
        }else{
            setValidTotal(true)
            setTexto("Procesando pago")
            setLoading(true)
            //console.log('pagar')
            var arr = []
                for(var i=0; i<arrayDates.length; i++){
                    var obj = {
                        date: arrayDates[i],
                        moratorio: 0
                    }
                    arr.push(obj)
                }
            const data = {
                id: id,
                monto: total,
                range: arr,
                //useFondo: metodoPago==='fondo'? true: false,
                useFondo: false,
                referencia: referencia,
                metodoPago: {id: metodoPago},
                caja: {id: caja},
                payMoratorio: false,
                intereses_moratorios: 0,
                intereses_moratorios_dcto: 0,
                apply_descuento: 0,
                autorizacion: "",
                cantMoratorios:0,
                fechaPagoReal:  moment(fechaPagoReal).format("YYYY-MM-DD"),
                interesesMoratoriosList: [],
                noCuenta: noCuenta

            }
            console.log(data)
            Post({url: `${COBRO_MTTO_SAVE}`, data: data, access_token: auth.data.access_token, header: true})
            .then(response=>{
                setLoading(false)
                //console.log(response)
                setCobros(response.data.data.cobrosIdentificadoresList)
                if(response.data.data.seFacturo){
                    setShow(false)
                    history.push(`/factura-generada/${response.data.data.idFactura}`)
                }else{
                    //redirigir al mensaje que no se facturo el cobro se setea no 
                    setSeFacturo(false)
                }               
            })
            .catch(error=>{
                //console.log(error)
            })
        }
    }

    

     return(
         <div className="list-inline-item">
             <Button size="sm" variant="outline-secondary" onClick={e=>handleShow()} className=""><FaBullhorn className="icon-m1" /> <small>Mantenimiento a futuro</small></Button>
             <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
            <Modal.Header closeButton={!isLoading}>
            <Modal.Title>Mantenimiento a futuro</Modal.Title>
            </Modal.Header>
            {
                isLoading ? <Modal.Body><MiniLoad texto={texto}/></Modal.Body>
                :   <Modal.Body>
                        {
                            !seFacturo ? <FacturaNoGenerada cobros={cobros} access_token={auth.data.access_token}/> 
                            : <div>
                                    <Row>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formBasicEmail">
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
                                        </Col>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Método de pago</Form.Label>
                                                <Form.Control as="select" 
                                                value={metodoPago}
                                                onChange={e=>setMetodoPago(e.target.value)}
                                                >
                                                    {
                                                        metodoPagoOpt.map((item, i)=>(                                    
                                                            <option key={i} value={item.id}>{item.name}</option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Observación</Form.Label>
                                                <Form.Control type="text" value={referencia} onChange={e=>setReferencia(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Desde</Form.Label>
                                                <DatePicker className="form-control"
                                                    dateFormat="MMMM/yyyy"
                                                    locale="es"
                                                    readOnly
                                                    selected={startDate}
                                                    onChange={date => setStartDate(date)}  
                                                    showMonthYearPicker
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Hasta</Form.Label>
                                                <DatePicker className="form-control"
                                                    dateFormat="MMMM/yyyy"
                                                    locale="es"
                                                    selected={endDate}
                                                    onChange={date => handleHasta(date)}
                                                    minDate={new Date(item.fechaUltimoMtto.split('-')[0], item.fechaUltimoMtto.split('-')[1]-1)}
                                                    showMonthYearPicker
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4"lg="4">
                                            <Form.Group controlId="formPlaintextEmail">
                                                <Form.Label>Fecha Pago</Form.Label>
                                                <DatePicker className="form-control"
                                                    showPopperArrow={false}
                                                    selected={fechaPagoReal}
                                                    autoComplete="off"
                                                    dateFormat="dd-MM-yyyy"
                                                    onChange={date => {
                                                        if(date){
                                                            let current = moment()
                                                            let fecha = moment(date)
                                                            if(fecha.isAfter(current)){
                                                                setFechaPagoReal(new Date())
                                                            }else{
                                                                setFechaPagoReal(date)
                                                            }
                                                        }else{
                                                            setFechaPagoReal(new Date())
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs="4" lg={{span: "4", offset: 4}}>
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
                                        </Col>
                                        <Col xs="4" lg="4">
                                            <Form.Group controlId="formPlaintextEmail">
                                                <Form.Label>Pagar</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={total}
                                                    onChange={e=>setTotal(e.target.value)}
                                                    className={`${!validTotal && 'error'}`}
                                                >
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>      
                                    </Row>
                                </div>
                               
                        }                        
                    </Modal.Body>
                }
                    {seFacturo && <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}  disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={e=>onClickPagar()} disabled={isLoading}>Pagar</Button>
                    </Modal.Footer>}
                </Modal> 
         </div>
        
     )
}