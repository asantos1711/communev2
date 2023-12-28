import moment from "moment"
import React, { useContext, useState } from "react"
import { Button, Card, Col, Dropdown, Form, Modal, Row, Table } from "react-bootstrap"
import { FaTimes } from "react-icons/fa"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { toast, ToastContainer } from "react-toastify"
import FacturaNoGenerada from "../components/FacturaNoGenerada"
import SelectAjax from "../components/SelectAjax"
import { authContext } from "../context/AuthContext"
import MiniLoad from "../loaders/MiniLoad"
import Get from "../service/Get"
import GetAll from "../service/GetAll"
import Post from "../service/Post"
import { CLAVE_PRODUCCION_SERVICIO_CFDI_GET, CLAVE_UNIDAD_CFDI_GET, FACTURA_SAVE, FORMA_PAGO_CFDI_GET, GET_LOTE_PAGOS_FACTURAR, LOTE_FOR_VEHICLES, METODO_PAGO_CFI_GET, TIPO_DOCUMENTO_GET, USO_CFDI_GET } from "../service/Routes"

export default function GenerarFactura(){
    const { auth } = useContext(authContext)
    const history = useHistory();
    const [item, setItem] = useState([])
    const [lote, setLote] = useState(null)
    const [submiting, setSubmiting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [cuentas, setCuentas] = useState([])
    const [payemts, setPayment] = useState([])
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const [isLoadField, setLoadField] = useState(false)

    const [clavePOpts, setClavePOpts] = useState([])
    const [claveUOpts, setClaveUOpts] = useState([])
    const [tipoDOpts, setTipoDOpts] = useState([])
    const [metodoPOpts, setMetodoPOpts] = useState([])
    const [formaPOpts, setFormaPOpts] = useState([])
    const [usoCFDIOpts, setUsoCFDIOpts] = useState([])

    const [claveUnidad, setClaveUnidad] = useState(null)
    const [claveProductoUnidad, setClaveProductoUnidad] = useState(null)
    const [tipoDocumento, setTipoDocumento] = useState(null)
    const [metodoPagoCFDI, setMetodoPagoCFDI] = useState(null)
    const [formaPagoCFDI, setFormaPagoCFDI] = useState(null)
    const [usoCFDI, setUsoCFDI] = useState(null)
    const [seFacturo, setSeFacturo] = useState(true)

    const [cobros, setCobros] = useState([])

    const onHandleLoteChange = (value) =>{
        setLoading(true)
        setLote(value)
        Get({url: `${GET_LOTE_PAGOS_FACTURAR}/${value.value}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItem(response.data.data) 
            let noCuentas = response.data.data.misPagosResponseList.filter(el=>el.amount!==0).map(el=>{return el.noCuenta})
            let unique = [...new Set(noCuentas)]
            //console.log(unique)
            setCuentas(unique)
            setLoading(false)
        })
    }

    const onHandleChangeCuenta = value =>{
        //console.log(value)
        if(value===''){
            setPayment([])
            setCobros([])
        }else if(value==='null'){            
            let arr = item.misPagosResponseList.filter(el=>el.noCuenta===null)
            setPayment(arr)
            setCobros(arr.map(item=>({id: item.id, name: item.tipo})))
        }else{            
            let arr = item.misPagosResponseList.filter(el=>el.noCuenta===value)
            setPayment(arr)
            setCobros(arr.map(item=>({id: item.id, name: item.tipo})))
        }
    }

    const deleteItem = index =>{
        let arr = [...payemts]
        arr.splice(index, 1)
        setPayment(arr)
        setCobros(arr.map(item=>({id: item.id, name: item.tipo})))        
    }

    const handleShow = () => {
        setShow(true)
        setLoadField(true)

        const urls = [CLAVE_PRODUCCION_SERVICIO_CFDI_GET, CLAVE_UNIDAD_CFDI_GET, TIPO_DOCUMENTO_GET, 
            METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET, USO_CFDI_GET]
        
        GetAll({urls: urls, access_token: auth.data.access_token})
        .then(response=>{
            // console.log(response)
            //opts
            setClavePOpts(response[0].data)
            setClaveUOpts(response[1].data)
            setTipoDOpts(response[2].data)
            setMetodoPOpts(response[3].data)
            setFormaPOpts(response[4].data)
            setUsoCFDIOpts(response[5].data)

            //getfirstvalue
            setClaveProductoUnidad(response[0].data[0].claveProduccionServicio)
            setClaveUnidad(response[1].data[0].claveUnidad)
            setTipoDocumento(response[2].data[0].id)
            setMetodoPagoCFDI(response[3].data[0].metodoPago)
            setFormaPagoCFDI(response[4].data[0].formaPago)
            setUsoCFDI(response[5].data[0].usoCFDI)
            setLoadField(false)
        })
        .catch(error=>{
            // console.log(error)
        })    
    };

    const onClickFacturar = () =>{
        setSubmiting(true)
        const d = {
            claveUnidad: claveUnidad,
            claveProductoUnidad: claveProductoUnidad,
            tipoDocumentoId: tipoDocumento,
            metodoPagoCFDI: metodoPagoCFDI,
            formaPagoCFDI: formaPagoCFDI,
            usoCFDI: usoCFDI,
            reqFacturaConceptosList: payemts.map(item=>({id: item.id, tipo: item.tipo, descripcion:item.description, pu: item.amount, importe: item.amount})),
            loteId: item.direccion.id
        }
        console.log(d)

        Post({url: FACTURA_SAVE, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setSubmiting(false)
            if(!response.data.success){
                setSeFacturo(false)
                toast.info(response.data.message, {autoClose: 8000})
            }else{
                history.push(`/factura-generada/${response.data.data}`)
            }
        })
        .catch(error=>{
            setSubmiting(false)
            toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
            // console.log(error)
        })
    }

    return(
        <div>
            {
                !seFacturo ? <FacturaNoGenerada cobros={cobros} access_token={auth.data.access_token} /> :
                <div>
            <ToastContainer />
            <Card className="shadow">
                <Card.Body>
                    <Card.Title>Generar Factura</Card.Title>
                    <Dropdown.Divider />  
                    <Row>
                        <Col xs="12" md="6">
                            <Form.Group>
                                <Form.Label>Lote</Form.Label>
                                <SelectAjax
                                    defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                    url={LOTE_FOR_VEHICLES}
                                    access_token={auth.data.access_token}
                                    isMulti={false}
                                    handleChange={(value) => onHandleLoteChange(value)} 
                                    defaultOptions={lote}   
                                    valid={true}     
                                    isClearable={false}                                                 
                                />                    
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {!loading && <Card className="shadow mt-2">
                <Card.Body>
                    <Card.Title>Pagos sin facturar</Card.Title>
                    <Dropdown.Divider />                          
                        <Row>
                            <Col xs="12" md="7" className="h-600">
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Concepto</th>
                                            <th>No cuenta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            item.misPagosResponseList.filter(el=>el.amount!==0).map((item,i)=>(
                                                <tr key={i}>
                                                    <td>{moment(item.fechaPago).format("DD-MM-YYYY")}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.noCuenta}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs="12" md="5">
                                {cuentas.length > 0 &&
                                <Row>
                                    <Col xs="12" md="12">
                                        <Form.Group>
                                            <Form.Label>No Cuenta</Form.Label>
                                            <Form.Control
                                                as="select"
                                                onChange={e=>onHandleChangeCuenta(e.target.value)}
                                            >
                                                <option value="">Seleccionar cuenta</option>
                                                {
                                                    cuentas.map((item, i)=>(
                                                        <option key={i} value={item===null ? 'null' : item}>{item===null ? 'Sin número de cuenta' : item}</option>
                                                    ))
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    {payemts.length > 0 &&
                                    <Col xs="12" md="12">
                                        <Row>
                                            <Col xs="12" md="12" className="text-right mb-2">
                                                <Button variant="primary" onClick={handleShow}>Facturar</Button>
                                            </Col>
                                            <Col xs="12" md="12">
                                                <Table bordered size="sm" className="m-font ">
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Concepto</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            payemts.map((item,i)=>(
                                                                <tr key={i}>
                                                                    <td>{moment(item.fechaPago).format("DD-MM-YYYY")}</td>
                                                                    <td>{item.description}</td>
                                                                    <td width="5%" className="text-center"><span className="cursor-pointer" onClick={e=>deleteItem(i)}><FaTimes /></span></td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>}
                                </Row>}

                                
                            </Col>
                        </Row>
                </Card.Body>
            </Card>}
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Crear factura</Modal.Title>
                        </Modal.Header>
                        {
                            submiting ? <Modal.Body><MiniLoad texto="Procesando factura" /></Modal.Body>
                            : <Modal.Body>
                                {
                                    isLoadField ? <MiniLoad texto="Cargando campos" />
                                    : <div>
                                        <Row>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Clave producto unidad</Form.Label>
                                                    <Form.Control as="select" value={claveProductoUnidad} onChange={e=>setClaveProductoUnidad(e.target.value)}>
                                                        {
                                                            clavePOpts.map((item,i)=>(
                                                                <option key={i} value={item.claveProduccionServicio}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Clave unidad</Form.Label>
                                                    <Form.Control as="select" value={claveUnidad} onChange={e=>setClaveUnidad(e.target.value)}>
                                                        {
                                                            claveUOpts.map((item,i)=>(
                                                                <option key={i} value={item.claveUnidad}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Tipo documento</Form.Label>
                                                    <Form.Control as="select" value={tipoDocumento} onChange={e=>setTipoDocumento(e.target.value)}>
                                                        {
                                                            tipoDOpts.map((item,i)=>(
                                                                <option key={i} value={item.id}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Método de pago CFDI</Form.Label>
                                                    <Form.Control as="select" value={metodoPagoCFDI} onChange={e=>setMetodoPagoCFDI(e.target.value)}>
                                                        {
                                                            metodoPOpts.map((item,i)=>(
                                                                <option key={i} value={item.metodoPago}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Forma de pago CFDI</Form.Label>
                                                    <Form.Control as="select" value={formaPagoCFDI} onChange={e=>setFormaPagoCFDI(e.target.value)}>
                                                        {
                                                            formaPOpts.map((item,i)=>(
                                                                <option key={i} value={item.formaPago}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xs="6" lg="4">
                                                <Form.Group>
                                                    <Form.Label>Uso CFDI</Form.Label>
                                                    <Form.Control as="select" value={usoCFDI} onChange={e=>setUsoCFDI(e.target.value)}>
                                                        {
                                                            usoCFDIOpts.map((item,i)=>(
                                                                <option key={i} value={item.usoCFDI}>{item.name}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                }            
                            </Modal.Body>
                        }
                        
                        <Modal.Footer>            
                            <Button variant="primary" onClick={onClickFacturar} disabled={submiting}>Aceptar</Button>
                        </Modal.Footer>
                    </Modal>
        </div>
            }
        </div>
    )
}