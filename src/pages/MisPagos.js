import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import { authContext } from '../context/AuthContext'
import Get from '../service/Get'
import { RESIDENTE_MIS_PAGOS, FACTURA_PAGO_FACTURAR, FACTURA_GET_BY_ID, FACTURA_GET_EMAIL_FACTURAR, FACTURA_ENVIAR_EMAIL,CANCELAR_PAGO, FACTURAR_PAGO_SIST_ANT, TIPO_MOTIVO_CANCELACION_GET, TIPO_RELACION_FACTURA_GET } from '../service/Routes'
import { Card, Row, Col, Jumbotron, Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { loaderRequest } from '../loaders/LoaderRequest'
import moment from 'moment'
import { formatNumber } from '../utils/formatNumber'
import { FaFileInvoiceDollar, FaDownload, FaFileExcel, FaFolder } from 'react-icons/fa'
import { setBagdeStatusPayment } from '../utils/setBagdeStatusPayment'
import Post from '../service/Post'
import TableSkeleton from '../loaders/TableSkeleton'
import { RiMailSendLine } from 'react-icons/ri'
import { facturaPdf } from '../utils/facturaPdf'
import { toast, ToastContainer } from 'react-toastify'
import WaveLoading from 'react-loadingg/lib/WaveLoading'
import CardSkeleton from '../loaders/CardSkeleton'
import ResidenteDetail from '../components/ResidenteDetail'
import VistaFacturar from '../components/VistaFacturar'
import cfdiLogo from '../img/cfdi.png';
import cancelada from '../img/cancelada.png';
import { totalMisPagos } from '../utils/totalMisPagos'
import { IsAdministrador } from '../security/IsAdministrador'
import { IsDirector } from '../security/IsDirector'
import { getLogoResidencial } from '../utils/getLogoResidencial'
import cfdiVersionv4 from '../img/cfdv4.png';
import cfdiVersion from '../img/cfdiversion.png';

export default function MisPagos(){
    const { auth } = useContext(authContext)
    const [items, setItem] = useState([])
    const [loading, setLoading] = useState(true)
    let {id} = useParams()
    const history = useHistory()
    const [isSubmiting, setSubmiting] = useState(false)
    const [conceptops, setConceptos] = useState([])
    const [hasData, setHasData] = useState(false)
    const [show, setShow] = useState(false);
    const [idFactura, setIdFactura] = useState(null)
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const [lote, setLote] = useState(null)
    const [vistaFacturar, setVistaFacturar] = useState(false)  
    const [facturar, setFacturar] = useState(null)
    const [oldItem, setOldItem] = useState([])
    const [isVersion4, setIsVersion4] = useState(false) 

    const handleClose = () => setShow(false);

    useEffect(()=>{
        setLoading(true)

        Get({url: `${RESIDENTE_MIS_PAGOS}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setItem(response.data.data.misPagosResponseList.filter(item=>item.amount!==0))
            setLote(response.data.data)
            setLoading(false)
        })
        .catch(error=>{
            // console.log(error)
        })
    },[id])

    const showFacturar = (id, tipo) =>{
        setSubmiting(true)
        //console.log(id)
        //console.log(tipo)
        Get({url:`${FACTURA_PAGO_FACTURAR}/${id}/${tipo}`, access_token: auth.data.access_token})
        .then(response=>{
            setFacturar(response.data.data)
            setSubmiting(false)
            setVistaFacturar(true)
        })
        .catch(error=>{
            // console.log(error)
        })
    }

    const downloadPDF = (id) =>{
        setSubmiting(true)
        ///get factura
        Get({url: `${FACTURA_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            if(response.data.data.version==='4.0'){
                setIsVersion4(true)
            }
            setConceptos(response.data.data.facturaConceptosList)
            //console.log(response)
            setHasData(true)
            //download pdf
            facturaPdf(response.data.data)
            setSubmiting(false)
        })
        .catch(error=>{
            // console.log(error)
        })
    }

    const showEmail = (id) =>{
        setSubmiting(true)
        setIdFactura(id)
        Get({url: `${FACTURA_GET_EMAIL_FACTURAR}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            //console.log(response)
            setEmailDefault(response.data)
            setShow(true)
            setSubmiting(false)
        })
        .catch(error=>{
            // console.log(error)
        })        
    }

    const sendEmail = () =>{
        //console.log(idFactura)
        setSendingEmail(true)

        const d = {
            id: idFactura,
            correoElectronico: emailDefault,
            correoAdicional: emailPlus
        }

        Post({url: FACTURA_ENVIAR_EMAIL, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            // console.log(response)
            setSendingEmail(false)
            setShow(false)
            toast.success("Se ha enviado el correo electrónico satisfactoriamente", {autoClose: 5000})
        })
        .catch(error=>{
            // console.log(error)
            setSendingEmail(false)
            setShow(false)
            toast.error("No se ha podido enviar el correo electrónico. Intente más tarde", {autoClose: 5000})
        })

    }
    const commonStyle = {
        margin: 'auto',
        position: 'initial',
        left: 0,
        right: 0,
        top:10,
        bottom:10
    };

    const onChangeFacturar = (checked) =>{
        // console.log(checked)
        if(checked){
            setOldItem(items)
            var arr = [...items]
            setItem(arr.filter(ite=>ite.facturaId===null))
        }else{
            setItem(oldItem)
        }
        
    }

    const [showCancel, setShowCancel] = useState(false);
    const handleCloseCancel = () => setShowCancel(false);
    const [codigoAuto, setCodigoAuto] = useState('')
    const [idCancel, setIdCancel] = useState('')
    const [tipoCancel, setTipoCancel] = useState('')
    const [isCanceling, setIsCanceling] = useState(false)
    const [motivo, setMotivo] = useState('')
    const [errorCancel, setErrorCancel] = useState(false)

    const showIdCancel = (id, tipo) =>{
        setIdCancel(id)
        setTipoCancel(tipo)
        setShowCancel(true)
    }

    
    //get tipo motivo cancelacion y tipo de relacion de factura
    const [idMotivoCancelacion, setIdMotivoCancelacion] = useState('')
    const [idTipoRelacion, setIdTipoRelacion] = useState('')
    const [motivosCancelacion, setMotivosCancelacion] = useState([])
    const [relacionesFactura, setRelacionesFactura] = useState([])
    useEffect(()=>{
        //motivo cancelaciones
        Get({url: TIPO_MOTIVO_CANCELACION_GET, access_token: auth.data.access_token})
        .then(response=>{
            setMotivosCancelacion(response.data)
        })
        .catch(error=>{
            console.log(error)
        })

        //tipo relaciones factura
        Get({url: TIPO_RELACION_FACTURA_GET, access_token: auth.data.access_token})
        .then(response=>{
            setRelacionesFactura(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [])

    const cancelarPago = ()=>{
        if(codigoAuto==='' || motivo === ''  || idTipoRelacion === '' || idMotivoCancelacion === ''){
            setErrorCancel(true)
        }else{
            setIsCanceling(true)
            const d = {
                id: idCancel,
                name: tipoCancel,
                codeAutorizacion: codigoAuto,
                motivoCancelacion: motivo,
                idMotivoCancelacion: idMotivoCancelacion,
                idTipoRelacionFactura:  idTipoRelacion
            }
            Post({url: CANCELAR_PAGO, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                setIsCanceling(false)
                if(!response.data.success){
                    toast.info(response.data.message, {autoClose: 5000})
                }else{
                    toast.success("El pago ha sido cancelado", {autoClose: 5000})                                
                    setShowCancel(false)
                }                        
            })
            .catch(error=>{
                setIsCanceling(false)
                toast.error("Ocurrió un error. Contacte con el administrador", {autoClose: 5000})
            })
        }        
    }

    const [idFactAnt, setIdFactAnt] = useState('')
    const [tipoFactAnt, setTipoFactAnt] = useState('')
    const [refSistAnt, setRefSistAnt] = useState('')
    const [sModalFactAnt, setSModalFactAnt] = useState(false)
    const [isFacSistAnt, setIsFacSisAnt] = useState(false)
    
    const handleCloseFactAnt = () => {
        setIdFactAnt('')
        setRefSistAnt('')
        setTipoFactAnt('')
        setSModalFactAnt(false)
    } 
    const showModalFactAnt = (id, tipo) =>{
        console.log(id)
        console.log(tipo)
        setIdFactAnt(id)
        setTipoFactAnt(tipo)
        setSModalFactAnt(true)
    }

    const aplicarFactSA = () =>{
        setIsFacSisAnt(true)
        let d ={
            id: idFactAnt,
            tipo: tipoFactAnt,
            refSistemaAnterior: refSistAnt
        }
        Post({url: FACTURAR_PAGO_SIST_ANT, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            if(response.data.success){
                setIsFacSisAnt(false)
                setSModalFactAnt(false)
                toast.success("Acción exitosa", {autoClose:3000})
                let arr = [...items]
                let index = arr.findIndex(el=>el.id===idFactAnt)
                arr[index].isFacturado = true;
                arr[index].refSistemaAnterior = refSistAnt
                setItem(arr)
            }else{
                setIsFacSisAnt(false)
                toast.error("No se pudo completar la acción. Contacte con el administrador", {autoClose: 5000})
            }
        })
    }

    return(
        <div>
            {
                !vistaFacturar  ? 
                <Row>
                    <Col xs="12" lg="12" className="mb-4">
                        {
                            loading ? <CardSkeleton height={200} /> : <ResidenteDetail lote={lote} directions={null} showModalMtto={false}/>
                        }
                    </Col>   
                    <Col xs="12" lg="12">
                        <Card className="shadow">
                            <ToastContainer />
                            {isSubmiting && loaderRequest()}
                            {
                            loading ? <TableSkeleton />
                            : <Card.Body>
                            {
                                items.length  === 0 ? 
                                    <Row>
                                        <Col xs="12" lg="12">
                                            <div className="d-flex flex-row-reverse">
                                                <span className="text-primary p-2"><Form.Check type="checkbox" onChange={e=>onChangeFacturar(e.target.checked)} label="Pagos sin facturar" /></span>
                                            </div>                                
                                        </Col>
                                        <Col xs="12" lg="12"><Jumbotron fluid className="text-center"><Container>No existen pagos a mostrar</Container></Jumbotron></Col>
                                    </Row>
                                : <Row>
                                    <Col xs="12" lg="12">
                                        <div className="d-flex flex-row-reverse">
                                            <span className="text-primary p-2"><Form.Check type="checkbox" onChange={e=>onChangeFacturar(e.target.checked)} label="Pagos sin facturar" /></span>
                                        </div>                                
                                    </Col>
                                    <Col className="h-600 mb-2" xs="12" lg="12">
                                        <Table size="sm" hover responsive id="tableMP" className="font-size-08rem">
                                            <thead>
                                                <tr>
                                                    <th>Fecha pago</th>
                                                    <th>Descripción</th>
                                                    <th>Nota</th>                                                    
                                                    <th style={{textAlign:'center'}}>Estado</th>
                                                    <th style={{textAlign:'center'}}>Monto</th>
                                                    <th style={{textAlign:'center'}}>Factura</th>
                                                    <th>Tipo</th>
                                                    <th>Forma de pago</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items.map((item, i)=>(
                                                        <tr key={i}>
                                                            <td width="7%">{item.fechaPago && moment(item.fechaPago).format("DD-MM-YYYY")}</td>
                                                            <td width='25%'>{item.description}</td>
                                                            <td width='12%'>{item.observacion}</td>                                                            
                                                            <td width="5%" style={{textAlign:'center'}}><span className={`badge ${setBagdeStatusPayment(item.status)}`}>{item.status}</span></td>
                                                            <td width='5%' style={{textAlign:'center'}}>{formatNumber(item.amount)}</td>                                                            
                                                            <td width='7%' style={{textAlign:'center'}}>{item.folioFactura && <Link className="text-dark" to={`/factura/${item.facturaId}`}>{item.folioFactura}</Link>}</td>
                                                            <td width='11%'>{item.tipoPago}</td>
                                                            <td width='13%'>{item.formaPago}</td>
                                                            {
                                                                item.isFacturado ?
                                                                <td width='10%' style={{textAlign: 'center'}}>{item.refSistemaAnterior}</td> :
                                                                <td width='10%' style={{textAlign: 'center'}}>
                                                                {                                                                    
                                                                    item.facturaId ? 
                                                                    <div>
                                                                        <Button variant="dark" className="mr-1 btn-xs" size="sm" onClick={e=>downloadPDF(item.facturaId)}><FaDownload /></Button>
                                                                        <Button size="sm" variant="light" className="btn-xs" onClick={e=>showEmail(item.facturaId)} ><RiMailSendLine /></Button>
                                                                        {item.status !== 'cancelado' && <Button variant="outline-danger" className="mr-1 btn-xs" onClick={e=>showIdCancel(item.id, item.tipo)}><FaFileExcel className="mt--3" /></Button>}
                                                                    </div>
                                                                    : <div>
                                                                        {
                                                                            (item.amount > 0 && item.status !=='cancelado') &&
                                                                            <div className="d-inline">
                                                                                <FaFileInvoiceDollar className="icon-link" title="Facturar" onClick={()=>showFacturar(item.id, item.tipo)}/>
                                                                                <Button variant="outline-danger" className="mr-1 btn-xs" onClick={e=>showIdCancel(item.id, item.tipo)}><FaFileExcel className="mt--3" /></Button>
                                                                            </div>
                                                                        }
                                                                        {   (IsAdministrador(auth.data.role) || IsDirector(auth.data.role)) && 
                                                                            <Button variant="outline-warning" size="xs" className="mr-1" onClick={e=>showModalFactAnt(item.id, item.tipo)}><FaFolder /></Button>
                                                                        }                                                                        
                                                                      </div>
                                                                }                                                                
                                                            </td>

                                                            }
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col xs="12" lg="12" className="mt-2">
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td width='80%' className="font-weight-bold">Total</td>
                                                    <td width='10%' style={{textAlign:'center'}} className="font-weight-bold">{formatNumber(totalMisPagos(items))}</td>
                                                    <td width='10%'></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            }                    
                            </Card.Body>                    
                            }                
                            <Table size="sm" hover responsive id="tableFG" style={{display: 'none'}}>
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Descripción</th>
                                        <th className="text-center">P/U</th>
                                        <th className="text-center">Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        hasData &&
                                        conceptops.map((item,i)=>(
                                            <tr key={i}>
                                                <td width="15%">{item.cantidad}</td>
                                                <td width='15%'>{item.unidad}</td>
                                                <td width="50%">{item.descripcion}</td>
                                                <td width="10%" className="text-center">{formatNumber(item.valorUnitario)}</td>
                                                <td width='10%' className="text-center">{formatNumber(item.importe)}</td>
                                            </tr>
                                        ))
                                    }                   
                                </tbody>                
                            </Table>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title></Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {sendingEmail && 
                                    <div className="loadModal">
                                    <h6 style={{color: '#7186ed'}}>Enviando correo electrónico</h6>
                                    <WaveLoading style={commonStyle} color={"#6586FF"} />
                                    </div>}
                                    
                                    <div className={`${sendingEmail && 'opacity-03'}`}>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">
                                                Correo electrónico
                                            </Form.Label>
                                            <Col sm="8">
                                            <Form.Control plaintext readOnly defaultValue={emailDefault === "" ? 'No existe' : emailDefault} />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="4">
                                                Adicional
                                            </Form.Label>
                                            <Col sm="8">
                                            <Form.Control value={emailPlus} onChange={e=>setEmailPlus(e.target.value)}/>
                                            </Col>
                                        </Form.Group>
                                    </div>                    
                                </Modal.Body>
                                <Modal.Footer>                
                                <Button variant="outline-primary" onClick={sendEmail} disabled={sendingEmail}>Enviar factura</Button>
                                </Modal.Footer>
                            </Modal>
                            <img src={cfdiLogo} alt="logoCFDI" id="cfdiLogo" style={{display: 'none'}}/>
                            <img src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} alt="RioLogo" id="rioLogo" style={{display: 'none'}}/>
                            <img src={isVersion4 ? cfdiVersionv4 : cfdiVersion} alt="cfdiVersion" id="cfdiVersion" style={{display: 'none'}}/>
                            <img src={cancelada} alt="cfdiVersion" id="cancelada" style={{display: 'none'}}/>

                            <Modal show={showCancel} onHide={handleCloseCancel}>
                                <Modal.Header closeButton>
                                <Modal.Title>Cancelar pago</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className={`${isCanceling  && 'h-100p'}`}>
                                    {
                                        isCanceling 
                                        ? <div className="loadModal t20p">
                                            <h6 style={{color: '#7186ed'}}>Cancelando pago</h6>
                                            <WaveLoading style={commonStyle} color={"#6586FF"} />
                                          </div>
                                        : <Row>
                                            <Col>
                                            {errorCancel &&  <Alert key='alert' variant="danger">Todos los campos son requeridos</Alert>}
                                                <Form.Group as={Row}>
                                                    <Form.Label column sm="5">
                                                        Código de autorización
                                                    </Form.Label>
                                                    <Col sm="7">
                                                    <Form.Control value={codigoAuto} onChange={e=>setCodigoAuto(e.target.value)}/>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row}>
                                                    <Form.Label column sm="5">Motivo de cancelación</Form.Label>
                                                    <Col sm="7">
                                                        <Form.Control
                                                            as="select" 
                                                            onChange={e=>setIdMotivoCancelacion(e.target.value)}
                                                            value={idMotivoCancelacion}
                                                        >
                                                            <option value="">Seleccionar opción</option>
                                                            {
                                                                motivosCancelacion.map((item)=>(
                                                                    <option key={item.id} value={item.id}>{`${item.clave} - ${item.descripcion}`}</option>
                                                                ))
                                                            }
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row}>
                                                    <Form.Label column sm="5">Relación de factura</Form.Label>
                                                    <Col sm="7">
                                                        <Form.Control
                                                            as="select" 
                                                            onChange={e=>setIdTipoRelacion(e.target.value)}
                                                            value={idTipoRelacion}
                                                        >
                                                            <option value="">Seleccionar opción</option>
                                                            {
                                                                relacionesFactura.map((item)=>(
                                                                    <option key={item.id} value={item.id}>{`${item.clave} - ${item.descripcion}`}</option>
                                                                ))
                                                            }
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Motivo</Form.Label>
                                                    <Form.Control as="textarea" rows={3} value={motivo} onChange={e=>setMotivo(e.target.value)}/>
                                                </Form.Group>
                                            </Col>
                                        </Row>  
                                    }
                                                                                    
                                </Modal.Body>
                                <Modal.Footer>                
                                    <Button variant="outline-primary" onClick={cancelarPago} disabled={isCanceling}>Cancelar pago</Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={sModalFactAnt} onHide={handleCloseFactAnt} backdrop="static"  keyboard={!isFacSistAnt}>
                                <Modal.Header closeButton>
                                <Modal.Title>Facturado sistema anterior</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className={`${isFacSistAnt  && 'h-100p'}`}>
                                    {
                                        isFacSistAnt 
                                        ? <div className="loadModal t20p">
                                            <h6 style={{color: '#7186ed'}}>Aplicando cambios</h6>
                                            <WaveLoading style={commonStyle} color={"#6586FF"} />
                                          </div>
                                        : <Row>
                                            <Col>
                                            {errorCancel &&  <Alert key='alert' variant="danger">Los campos código de autorización y motivo son requeridos</Alert>}
                                                <Form.Group>
                                                    <Form.Label>Referencia del SA</Form.Label>
                                                    <Form.Control value={refSistAnt} onChange={e=>setRefSistAnt(e.target.value)}/>
                                                </Form.Group>
                                            </Col>
                                        </Row>  
                                    }
                                                                                    
                                </Modal.Body>
                                <Modal.Footer>                
                                    <Button variant="outline-primary" onClick={aplicarFactSA} disabled={isCanceling}>Aceptar</Button>
                                </Modal.Footer>
                            </Modal>
                        </Card>
                    </Col>                 
                </Row>
                : <VistaFacturar factura={facturar} access_token={auth.data.access_token} history={history}/>
            }
        </div>
    )
}