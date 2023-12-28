import React, { useState } from 'react'
import { Card, Row, Col, Dropdown, Table, Button, Modal, Form } from 'react-bootstrap'
import { TIPO_DOCUMENTO_GET, CLAVE_PRODUCCION_SERVICIO_CFDI_GET, CLAVE_UNIDAD_CFDI_GET, METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET, USO_CFDI_GET, FACTURA_SAVE } from '../service/Routes';
import GetAll from '../service/GetAll';
import MiniLoad from '../loaders/MiniLoad';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import { formatNumber } from '../utils/formatNumber';
import { importeFactura } from '../utils/importeFactura';
import FacturaNoGenerada from './FacturaNoGenerada';

export default function VistaFacturar(props){
    const [show, setShow] = useState(false);
    const [isLoadField, setLoadField] = useState(false)
    const [clavePOpts, setClavePOpts] = useState([])
    const [claveUOpts, setClaveUOpts] = useState([])
    const [tipoDOpts, setTipoDOpts] = useState([])
    const [metodoPOpts, setMetodoPOpts] = useState([])
    const [formaPOpts, setFormaPOpts] = useState([])
    const [usoCFDIOpts, setUsoCFDIOpts] = useState([])
    const [mensajeProveedor, setMensajeProveedor] = useState('')

    const [claveUnidad, setClaveUnidad] = useState(null)
    const [claveProductoUnidad, setClaveProductoUnidad] = useState(null)
    const [tipoDocumento, setTipoDocumento] = useState(null)
    const [metodoPagoCFDI, setMetodoPagoCFDI] = useState(null)
    const [formaPagoCFDI, setFormaPagoCFDI] = useState(null)
    const [usoCFDI, setUsoCFDI] = useState(null)

    const [isSubmiting, setSubmiting] = useState(false)
    const [seFacturo, setSeFacturo] = useState(true)
    const [cobros, setCobros] = useState(props.factura.conceptos.map(item=>({id: item.id, name: item.tipo})))
    //console.log(props.factura.conceptos.map(item=>({id: item.id, tipo: item.tipo, descripcion:item.description, pu: item.monto, importe: item.monto})))

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        setLoadField(true)

        const urls = [CLAVE_PRODUCCION_SERVICIO_CFDI_GET, CLAVE_UNIDAD_CFDI_GET, TIPO_DOCUMENTO_GET, 
            METODO_PAGO_CFI_GET, FORMA_PAGO_CFDI_GET, USO_CFDI_GET]
        
        GetAll({urls: urls, access_token: props.access_token})
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
            reqFacturaConceptosList: props.factura!==null ? props.factura.conceptos.map(item=>({id: item.id, tipo: item.tipo, descripcion:item.description, pu: item.monto, importe: item.monto})) : [],
            loteId: props.factura.datosFiscalesReceptor.loteId
        }
        //console.log(d)

        Post({url: FACTURA_SAVE, data: d, access_token: props.access_token, header: true})
        .then(response=>{
            //console.log(response)
            setSubmiting(false)
            if(!response.data.success){
                setSeFacturo(false)
                setMensajeProveedor(response.data.message)
                toast.info(response.data.message, {autoClose: 8000})
            }else{
                props.history.push(`/factura-generada/${response.data.data}`)
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
                !seFacturo ? <FacturaNoGenerada cobros={cobros} mensajeProveedor={mensajeProveedor} access_token={props.access_token} /> :
                <Card className="shadow">
                    <ToastContainer />
                    <Card.Body>
                    <Card.Title><h5>Facturar</h5></Card.Title>
                    <Dropdown.Divider />
                    <Row className="mb-3">
                        <Col xs="6" lg="6">
                            <span className="d-block">{`Emisor: ${props.factura.emisor.compania}`}</span>
                            <span className="d-block">{`RFC: ${props.factura.emisor.rfc}`}</span>
                            <span className="d-block">{`Lugar de expedición(CP): ${props.factura.emisor.codigoPostal}`}</span>
                        </Col>
                        <Col xs="6" lg="6">
                            <span className="d-block">{`Referencia: ${props.factura.datosFiscalesReceptor.loteReferencia}`}</span>
                            <span className="d-block">{`Receptor: ${props.factura.datosFiscalesReceptor.razonSocial}`}</span>
                            <span className="d-block">{`RFC: ${props.factura.datosFiscalesReceptor.rfc}`}</span>
                            <span className="d-block">{`Dirección: ${props.factura.datosFiscalesReceptor.domicilio}`}</span>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col xs="12" lg="12">
                            <h6>Conceptos</h6>
                        </Col>
                        <Col>
                            <Table size="sm" hover>
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Descripción</th>
                                        <th>P/U</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.factura.conceptos.map((item,i)=>(
                                            <tr key={i}>
                                                <td>1</td>
                                                <td>Servicios</td>
                                                <td>{item.description}</td>
                                                <td>{formatNumber(item.monto)}</td>
                                                <td>{formatNumber(item.monto)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="4">Total</th>
                                        <th>{formatNumber(importeFactura(props.factura.conceptos))}</th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Col>                
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={handleShow}>Facturar</Button>
                        </Col>
                    </Row>
                    </Card.Body>
                    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Crear factura</Modal.Title>
                        </Modal.Header>
                        {
                            isSubmiting ? <Modal.Body><MiniLoad texto="Procesando factura" /></Modal.Body>
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
                            <Button variant="primary" onClick={onClickFacturar} disabled={isSubmiting}>Aceptar</Button>
                        </Modal.Footer>
                    </Modal>
                </Card>
            }
        </div>
    )
}