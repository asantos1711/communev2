import React, { useState } from 'react'
import { Row, Col, Form, Button, Modal, Table } from 'react-bootstrap'
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { getIntervalDateMtto } from '../utils/getIntervalDateMtto';
import { getTotalMtto } from '../utils/getTotalMtto';
import { formatNumber } from '../utils/formatNumber';
import { getTotalMtto2 } from '../utils/getTotalMtto2';
import { loaderRequest } from '../loaders/LoaderRequest';
import Post from '../service/Post';
import { COBRO_MTTO_SAVE, CODIGO_AUTORIZACION_CHECK_CODIGO } from '../service/Routes';
import { toast, ToastContainer } from 'react-toastify';
import { calcTotalInteresesMoratorios } from '../utils/calcTotalInteresesMoratorios';
import Get from '../service/Get';
import { getMonthStr } from '../utils/getMonthStr';
import { calcMoratorios } from '../utils/calcMoratorios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import InputMask from "react-input-mask";
import { calcDeudaMoratoria } from '../utils/calcDeudaMoratoria';
import { calcMoratoriosOnly } from '../utils/calcMoratoriosOnly';
import { isMenorFechaPagoMoratorio } from '../utils/isMenorFechaPagoMoratorio';
import { diffItem } from '../utils/diffItem';
registerLocale("es", es);

export default function PayMtto(props){
    //console.log(props)
    const [fechaPagoReal, setfechaPagoReal] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date(props.mttos[0].year, props.mttos[0].mes-1, props.diaCorte));
    const [endDate, setEndDate] = useState(new Date(props.mttos[props.mttos.length-1].year, props.mttos[props.mttos.length-1].mes-1, props.diaCorte));
    const discountSpecial = props.discount
    // const[total, setTotal] = useState(getTotalMtto(discountSpecial, props.mttos, props.descuentos, props.cuota)+calcMoratorios(props.interesesMoratorios, fechaPagoReal, props.diaCorte))
    // const [inputMonto, setInputMonto] = useState(getTotalMtto(discountSpecial, props.mttos, props.descuentos, props.cuota)+calcMoratorios(props.interesesMoratorios, fechaPagoReal, props.diaCorte))
    const[total, setTotal] = useState(getTotalMtto(discountSpecial, props.mttos, props.descuentos, props.cuota)+calcDeudaMoratoria(props.mttos, fechaPagoReal))
    const [inputMonto, setInputMonto] = useState(getTotalMtto(discountSpecial, props.mttos, props.descuentos, props.cuota)+calcDeudaMoratoria(props.mttos, fechaPagoReal))
    const [validInput, setValidInput] = useState(true)
    const [isSubmiting, setSubmiting] = useState(false)
    const [arrayDates, setArrayDates] = useState(getIntervalDateMtto(startDate, endDate))
    const [metodoPago, setMetodoPago] = useState(props.metodoPagoOpt[0].id)
    const [referencia, setReferencia] = useState('')
    const [caja, setCaja] = useState(props.cajaOpt.length > 0 ? props.cajaOpt[0].id : '')
    const [payMoratorio, setPayMoratorio] = useState(false)
    const [montoMoratorio, setMontoMoratorio] = useState(calcMoratorios(props.interesesMoratorios))
    const [show, setShow] = useState(false);
    const [applyDescuento, setApplyDescuento] = useState(0)
    const [autorizado, setAutorizado] = useState("")
    const [cantMoratorios, setCantMoratorios] = useState(props.interesesMoratorios.length) 
    const [moratorios, setMoratorios] = useState(props.interesesMoratorios) 
    const history = useHistory() 
    const [noCuenta, setNoCuenta] = useState('')
    const [validNoCuenta, setValidNoCuenta] = useState(true)
    

    const handleHasta = date =>{
        date = new Date(date.getFullYear(), date.getMonth(), props.diaCorte)
        setEndDate(date)

        let arrayDates = getIntervalDateMtto(startDate, date)
        // console.log(arrayDates)
        setArrayDates(arrayDates)
        const t = getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,fechaPagoReal)+calcDeudaMoratoria(props.mttos, fechaPagoReal)
        
        setTotal(t)
        setInputMonto(t)
        setMontoMoratorio(calcDeudaMoratoria(props.mttos, fechaPagoReal))
    }

    const handleClose = () => {
        setShow(false)
    }
    const handleShow = () => setShow(true);

    const handleAccept = () => {
        if(applyDescuento===0 || applyDescuento==="0"){
            setTotal(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,fechaPagoReal)+calcMoratorios(moratorios, fechaPagoReal))
            setInputMonto(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,fechaPagoReal)+calcMoratorios(moratorios, fechaPagoReal))
            setMontoMoratorio(calcMoratoriosOnly(fechaPagoReal,moratorios))
            setAutorizado('')
            setApplyDescuento(0)
            setShow(false)
        }
        else if(applyDescuento > 0 && applyDescuento <=100 && autorizado!=="" && autorizado!==null){            

            //primaro se valida que el codigo de autorizacion esta vigente y es correcto
            Get({url: `${CODIGO_AUTORIZACION_CHECK_CODIGO}/${autorizado}`, access_token: props.access_token})
            .then(response=>{
                //console.log(response)
                if(!response.data){
                    toast.info("Código de autorización es incorrecto o no está activo. Intente de nuevo por favor", {autoClose: 8000})
                }else{
                    var monto_p_moratorios = calcMoratoriosOnly(fechaPagoReal,moratorios)
                    setMontoMoratorio(monto_p_moratorios)
                    setTotal(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,fechaPagoReal)+calcMoratorios(moratorios, fechaPagoReal))
                    setInputMonto(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,fechaPagoReal)+calcMoratorios(moratorios, fechaPagoReal))
                    setShow(false)
                }
            })
            .catch(error=>{
                // console.log(error)
            })            
        }        
    };    

    const recalcMoratorios = (moratorios) =>{
        //console.log(moratorios);
        let arrMoratorios = [];
        moratorios.forEach(item=>{
            if(isMenorFechaPagoMoratorio(fechaPagoReal, item.fechaCorte)){
                arrMoratorios.push({
                    id: item.id,
                    montoDcto: 0,
                    pagado: 0,
                    applyDescuento: "",
                    autorizado: ""
                })
            }else{
                arrMoratorios.push({
                    id: item.id,
                    montoDcto: item.deudaMoratoria,
                    pagado: item.deudaMoratoria-item.pagado,
                    applyDescuento: parseFloat(applyDescuento),
                    autorizado: autorizado
                })
            }
        })
        return arrMoratorios;
    }

    const handleSubmitPayment = e =>{
        if(inputMonto<=0 || inputMonto>total){
            setValidInput(false)
        }else if(noCuenta === ""){
            setValidNoCuenta(false)
        }else{
            setValidInput(true)
            setSubmiting(true)
            var arr = []
            for(var i=0; i<arrayDates.length; i++){
                var obj = {
                    date: arrayDates[i]
                }
                arr.push(obj)
            }


            const data = {
                id: props.id,
                monto: inputMonto,
                range: arr,
                //useFondo: metodoPago==='fondo'? true: false,
                useFondo: false,
                referencia: referencia,
                metodoPago: {id: metodoPago},
                caja: {id: caja},
                payMoratorio: payMoratorio,
                intereses_moratorios: calcTotalInteresesMoratorios(props.mttos),
                intereses_moratorios_dcto: montoMoratorio,
                apply_descuento: applyDescuento,
                autorizacion: autorizado,
                cantMoratorios: cantMoratorios,
                fechaPagoReal:  moment(fechaPagoReal).format("YYYY-MM-DD"),
                interesesMoratoriosList:   recalcMoratorios(moratorios),
                noCuenta: noCuenta   
                // moratorios.map(item=>({
                //     id: item.id,
                //     montoDcto: item.deudaMoratoria,
                //     pagado: item.deudaMoratoria,
                //     applyDescuento: applyDescuento,
                //     autorizado: autorizado
                // }))

            }
            console.log(data)

            Post({url: `${COBRO_MTTO_SAVE}`, data: data, access_token: props.access_token, header: true})
            .then(response=>{
                //console.log(response)
                setSubmiting(false)
                if(response.data.success){
                    if(response.data.data.seFacturo){
                        history.push(`/factura-generada/${response.data.data.idFactura}`)
                    }else{
                        props.setSeFacturo(false)
                        props.setCobros(response.data.data.cobrosIdentificadoresList)
                        props.setMensajeProveedor(response.data.data.responseFromProveedor)
                    }                    
                }else{
                    toast.info("Código de autorización es incorrecto o no se puede usar más. Intente de nuevo por favor", {autoClose: 8000})
                }                
            })
            .catch(error=>{
                setSubmiting(false)
                toast.error("Ocurrió un error en el servidor o hay problemas con la comunicación para facturar, revise los datos e intente otra vez por favor", {autoClose: 15000})
                // console.log(error)
            })
        }
    }    

    const onChangeCantMoratorios = value =>{
        setApplyDescuento(0)
        if(value<1 || value > props.interesesMoratorios.length){
            //console.log(props.interesesMoratorios.length)
            setCantMoratorios(props.interesesMoratorios.length)
            let arr = props.interesesMoratorios.slice(0,props.interesesMoratorios.length)
            setMoratorios(arr)
        }else{
            setCantMoratorios(value)
            let arr = props.interesesMoratorios.slice(0,value)
            setMoratorios(arr)
        }
    }

    const onChangeApplyD = value =>{
        //console.log('entro')
        //console.log(props.interesesMoratorios)
        if(value >= 0  && value <= 100){
            let arr = props.interesesMoratorios.slice(0,cantMoratorios)
            arr = arr.map(item=>({
                id: item.id,
                tiie: {mes: item.tiie.mes, year: item.tiie.year},
                fechaCorte: item.fechaCorte,
                deudaMoratoria: isMenorFechaPagoMoratorio(fechaPagoReal, item.fechaCorte) ? 0 : Math.ceil((item.deudaMoratoria-item.pagado)-((item.deudaMoratoria-item.pagado)*value)/100),
                pagado: 0
            }))
            setMoratorios(arr)
            setApplyDescuento(value)
        }        
    }

    const handleChangeMetodoPago = value =>{
        if(value==='fondo'){
            if(props.fondos!==null){
                if(props.fondos.monto>=inputMonto){
                    setInputMonto(0)
                }else{
                    setInputMonto(inputMonto-props.fondos.monto)
                }
            }
        }else{
            setInputMonto(total)
        }
        setMetodoPago(value)
    }

    const onChangeFechaPagoReal = date =>{
        //console.log(date)
        if(date===null){
            setfechaPagoReal(new Date())
            setTotal(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,new Date())+calcDeudaMoratoria(props.mttos, new Date()))
            setInputMonto(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,new Date())+calcDeudaMoratoria(props.mttos, new Date()))            
        }else{
            setfechaPagoReal(date)
            setTotal(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,date)+calcDeudaMoratoria(props.mttos, date))
            setInputMonto(getTotalMtto2(discountSpecial, arrayDates, props.descuentos, props.cuota, props.mttos,date)+calcDeudaMoratoria(props.mttos, date))
        }
        //console.log(props.interesesMoratorios)
        setMoratorios(props.interesesMoratorios)
        setMontoMoratorio(calcMoratoriosOnly(date, props.interesesMoratorios))
        setAutorizado('')
        setApplyDescuento(0)
        
    }


    return(
        <Row>
            <ToastContainer />
            { isSubmiting && loaderRequest() }
            <Col className="text-right">

                <label>Pagar mantenimiento</label>
                <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-right">Fecha pago</Form.Label>
                    <Col sm="6">
                        <DatePicker className="form-control"
                            showPopperArrow={false}
                            selected={fechaPagoReal}
                            autoComplete="off"
                            dateFormat="dd-MM-yyyy"
                            onChange={date => onChangeFechaPagoReal(date)}
                        /> 
                    </Col>                         
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-right">Caja</Form.Label>
                    <Col sm="6">
                        <Form.Control as="select" 
                            value={caja}
                            onChange={e=>setCaja(e.target.value)}
                        >
                            {
                                props.cajaOpt.map((item,i)=>(
                                    <option key={i} value={item.id}>{item.name}</option>
                                ))
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-right">Método pago</Form.Label>
                    <Col sm="6">
                        <Form.Control as="select" 
                            value={metodoPago}
                            onChange={e=>handleChangeMetodoPago(e.target.value)}
                        >
                            {
                                props.metodoPagoOpt.map((item, i)=>(                                    
                                    <option key={i} value={item.id}>{item.name}</option>
                                ))
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-right">Observación</Form.Label>
                    <Col sm="6">
                        <Form.Control 
                            type="text"
                            value={referencia}
                            onChange={e=>setReferencia(e.target.value)}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="6" className="text-right">No. cuenta</Form.Label>
                    <Col sm="6">
                    <InputMask
                        className={`${!validNoCuenta && 'error'} form-control`} 
                        mask="9999" 
                        onChange={e=>{
                            if(e.target.value === ""){
                                setValidNoCuenta(false)
                            }else{
                                setValidNoCuenta(true)
                            }
                            setNoCuenta(e.target.value)
                        }}
                        value={noCuenta}
                    />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="6" className="text-right">Desde</Form.Label>
                    <Col sm="6">
                    <DatePicker className="form-control"
                        dateFormat="MMMM/yyyy"
                        locale="es"
                        readOnly

                        selected={startDate}
                        onChange={date => setStartDate(date)}  
                        showMonthYearPicker
                    />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="6" className="text-right">Hasta</Form.Label>
                    <Col sm="6">
                    <DatePicker className="form-control"
                        dateFormat="MMMM/yyyy"
                        locale="es"

                        selected={endDate}
                        onChange={date => handleHasta(date)}
                        minDate={new Date(props.mttos[0].year, props.mttos[0].mes-1)}
                        showMonthYearPicker
                    />
                    </Col>
                </Form.Group>
                {
                   props.interesesMoratorios.length > 0 &&
                    <div className="border w-50 ml-auto py-3 px-1 border-primary">
                        <small className="d-block text-danger">Intereses moratorios: {formatNumber(montoMoratorio)} <Button variant="outline-secondary" size="sm" onClick={handleShow}>configurar</Button></small>
                    </div>
                }
                
                <small className="mt-4 d-block">Total a pagar</small>
                <h2 className="text-success">{formatNumber(total)}</h2>
                <span className="mt-2 d-block">Monto a saldar</span>
                {/* <Form.Check type="checkbox" label="Usar fondos" onChange={handleUseFondos} disabled={props.fondos===null} /> */}
                <Form.Control  
                    className={`mb-2 text-right input-pay ${!validInput && "error"}`}                   
                    type="number" 
                    value={inputMonto}
                    step={0.01}
                    max={total}
                    onChange={e=>{
                        if(e.target.value === "" || e.target.value ===null){
                            setInputMonto(0)    
                        }else{
                            // setInputMonto(parseInt(e.target.value))

                            setInputMonto(parseFloat(parseFloat(e.target.value).toFixed(2)))
                        }
                    }}                                     
                />
                
                
                <Button variant="primary" onClick={handleSubmitPayment}>Pagar</Button>
            </Col>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                <Modal.Title>Intereses moratorios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-4">
                        <Col xs="12" lg="4" className="mb-3">
                            <Form.Label>Cantidad a cobrar</Form.Label>
                            <Form.Control 
                                type="number"
                                value={cantMoratorios}
                                onChange={e=>onChangeCantMoratorios(e.target.value)}
                            />
                        </Col>
                        <Col xs="12" lg="4" className="mb-3">
                            <Form.Label>Descuento %</Form.Label>
                            <Form.Control 
                                type="number"
                                min="0"
                                value={applyDescuento}
                                onChange={e=>onChangeApplyD(e.target.value)}
                                placeholder="Porcentaje descuento"
                            />
                        </Col>
                        <Col xs="12" lg="4">
                            <Form.Label>Código autorización</Form.Label>
                            <Form.Control
                                type="text"
                                value={autorizado}
                                onChange={e=>setAutorizado(e.target.value)} 
                                placeholder="Código de autorización"
                            />
                        </Col>                        
                    </Row>

                    <Row className={moratorios.length > 4 && 'h-400'}>
                        <Col>
                            <Table size="sm" striped hover>
                                <tbody>
                                    {
                                        moratorios.map((item, i)=>(
                                            <tr key={i}>
                                                <td>{`${item.tiie && getMonthStr(item.tiie.mes)} - ${item.tiie && item.tiie.year}`}</td>
                                                <td>{formatNumber(diffItem(item.deudaMoratoria, item.pagado))}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </Col>                        
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" size="sm" onClick={handleAccept}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        </Row>
        
    )
}