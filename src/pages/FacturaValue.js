import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Modal, Row, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { authContext } from '../context/AuthContext';
import CardSkeleton from '../loaders/CardSkeleton';
import Get from '../service/Get';
import { FACTURA_ENVIAR_EMAIL, FACTURA_GET_BY_ID, FACTURA_GET_EMAIL_FACTURAR } from '../service/Routes';
import cfdiVersionv4 from '../img/cfdv4.png';
import cfdiVersion from '../img/cfdiversion.png';
import cancelada from '../img/cancelada.png';
import { formatNumber } from '../utils/formatNumber';
import { FaDownload } from 'react-icons/fa';
import { RiMailSendLine } from 'react-icons/ri';
import { facturaPdf } from '../utils/facturaPdf';
import { loaderRequest } from '../loaders/LoaderRequest';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';
import WaveLoading from 'react-loadingg/lib/WaveLoading';
import { getLogoResidencial } from '../utils/getLogoResidencial';

export default function FacturaValue(){
    var writtenNumber = require('written-number');
    const { auth } = useContext(authContext)
    const [isLoading, setLoading] = useState(true)
    const {id} = useParams()
    const [factura, setFactura] = useState(null)
    const [isSubmiting, setSubmiting] = useState(false)
    const [idFactura, setIdFactura] = useState(null)
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [show, setShow] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false)
    const [isVersion4, setIsVersion4] = useState(false)

    useEffect(()=>{
        setLoading(true)
            Get({url: `${FACTURA_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
            .then(response=>{
                //console.log(response)
                if(response.data.data.version==='4.0'){
                    setIsVersion4(true)
                }
                setFactura(response.data.data)
                setLoading(false)
            })
            .catch(error=>{
                //console.log(error)
            })
    },[])

    const downloadPDF = (id) =>{
        setSubmiting(true)
        facturaPdf(factura)
        setSubmiting(false)
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
    const handleClose = () => setShow(false);
    const commonStyle = {
        margin: 'auto',
        position: 'initial',
        left: 0,
        right: 0,
        top:10,
        bottom:10
    };

    return(
        <>
        <ToastContainer />
            {isSubmiting && loaderRequest()}
            {
                isLoading ? <CardSkeleton height={400}/> :
                <Card className="shadow">
                    <Card.Body>
                        <Card.Title>
                            <div className="d-flex flex-row-reverse bd-highlight align-items-center">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        <Button variant="dark" className="mr-1 btn-xs" onClick={e=>downloadPDF(factura.id)}><FaDownload /></Button>
                                    </li>
                                    <li className="list-inline-item">
                                        <Button variant="light" className="btn-xs" onClick={e=>showEmail(factura.id)}><RiMailSendLine /></Button>
                                    </li>
                                    
                                </ul>
                            </div>   
                        </Card.Title>
                        <Dropdown.Divider />
                        <Row className="mt-3">
                            <Col>
                                <h6 className="font-italic font-weight-light text-right">{`Emitido por ${factura.usuario}`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" xs="6">
                                <Card className="h180">
                                    <Card.Body>
                                        <Row>
                                            <Col xs="4" md="4">
                                                <h6 className="font-italic">Comprobante Fiscal Digital por Internet</h6>
                                                <img src={isVersion4 ? cfdiVersionv4 : cfdiVersion} alt="VersionCFDI" id="cfdiVersion" className="w-90p mt-3 ml-3"/>
                                            </Col>
                                            <Col xs={{ offset: "2", span: "6"}} className="text-right">
                                                <img src={getLogoResidencial(process.env.REACT_APP_RESIDENCIAL)} className="mh-140px" alt="RioLogo" id="rioLogo"/>                                               
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="mt-1 h180">
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <h3 className="cl-green mb-0">EMISOR</h3>
                                                <span className="font-weight-light ft15">{factura.nombreFiscalEmisor}</span>
                                                <h4 className="mb-0 mt-2">RFC: <span className="font-weight-light">{factura.rfcEmisor}</span></h4>
                                                <h4 className="mb-0 mt-2">Lugar expedición(CP): <span className="font-weight-light">{factura.lugarExpedicion}</span></h4>
                                            </Col>                                            
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md="6" xs="6">
                                <Card className="mt-1 h360">
                                    <Card.Body>
                                        <Row>
                                            <Col xs="6" md="6">
                                                <h3>FACTURA</h3>
                                            </Col>
                                            <Col xs="6" md="6" className="text-center">
                                                <h5 className="mb-0">SERIE Y FOLIO</h5>
                                                <h5 className="cl-red">{factura.folio}</h5>
                                            </Col>                                                                                      
                                        </Row>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <h5 className="mb-0">FOLIO FISCAL:</h5>
                                                <h6 className="mb-0 font-weight-light">{factura.folioFiscal}</h6>
                                                <h5 className="mb-0">CERTIFICADO SAT:</h5>
                                                <h6 className="mb-0 font-weight-light">{factura.csdSAT}</h6>
                                                <h5 className="mb-0">CERTIFICADO DE EMISOR:</h5>
                                                <h6 className="mb-0 font-weight-light">{factura.csdEmisor}</h6>
                                                <h5 className="mb-0">FECHA HORA DE EMISIÓN:</h5>
                                                <h6 className="mb-0 font-weight-light">{factura.fechaEmision}</h6>
                                                <h5 className="mb-0">FECHA HORA DE CERTIFICACIÓN:</h5>
                                                <h6 className="mb-0 font-weight-light">{factura.fechaCertificacion}</h6>
                                                <h5 className="mb-0">REGIMEN FISCAL: <span className="font-weight-light">{factura.regimenFiscal}</span></h5>
                                                {factura.tipoRelacionFactura && <h5 className="mb-0">TIPO DE RELACIÓN: <span className="font-weight-light">{factura.tipoRelacionFactura.clave} {factura.tipoRelacionFactura.descripcion}</span></h5>}
                                                {factura.folioFiscalRelacionar && <h5 className="mb-0">FOLIO DE FISCAL A RELACIONAR: <span className="font-weight-light">{factura.folioFiscalRelacionar}</span></h5>}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <img src={cancelada} alt="cfdiVersion" id="cancelada" style={{display: factura.status==='cancelada' ? 'block' : 'none'}} className="img-cancelada"/>
                        <Row>
                            <Col>
                                <Card className="mt-1">
                                    <Card.Body>
                                        <Row>
                                            <Col xs="12" md="12">
                                                <h3 className="cl-green mb-0">RECEPTOR</h3>
                                                <span className="font-weight-light ft15">{factura.nombreReceptor}</span>

                                                {/* <span className="mt-2 font-weight-light font-italic d-block">{factura.referenciaReceptor}</span> */}
                                                <span className="font-weight-light font-italic d-block">{factura.direccionReceptor}</span>

                                                <h5 className="mt-2">RFC: <span className="font-weight-light mr-5">{factura.rfcReceptor}</span> USO CFDI: <span className="font-weight-light mr-5">{factura.usoCFDI}</span></h5>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <h3 className="cl-green mb-0">CONCEPTOS</h3>
                                <Table borderless id="tableFG">
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
                                            factura.facturaConceptosList.map((item, i)=>(
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
                            </Col>           
                        </Row>
                        <Row className="mt-2">
                            <Col xs="8" md="8">
                                <h6 className="mb-2">Observación: <span className="font-weight-light">{factura.observacion}</span></h6>
                                <h5 className="mb-2">RÉGIMEN DE PERSONAS MORALES CON FINES NO LUCRATIVOS.</h5>
                                <h6 className="mb-2">Domicilio: <span className="font-weight-light">{factura.direccionDomicilio}</span></h6>
                                <h6 className="mb-2">No cuenta: <span className="font-weight-light">{factura.numeroCuenta}</span></h6>
                            </Col>
                            <Col xs="4" md="4" className="text-right">
                                <Row>
                                    <Col xs="8" md="8">
                                        <h5>Subtotal:</h5>
                                    </Col>
                                    <Col xs="4" md="4" className="text-left">
                                        <h5 className="font-weight-light">{formatNumber(factura.subtotal)}</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="8" md="8">
                                        <h5>IVA:</h5>
                                    </Col>
                                    <Col xs="4" md="4" className="text-left">
                                        <h5 className="font-weight-light">$0.00</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="8" md="8">
                                        <h5>Total:</h5>
                                    </Col>
                                    <Col xs="4" md="4" className="text-left">
                                        <h5 className="font-weight-light">{formatNumber(factura.total)}</h5>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                        <Row className="mt-2">
                            <Col xs="12" md="12">
                                <h5 className="mb-0">Total con letras:</h5>
                                <h5 className="mb-0 font-weight-light">{`${writtenNumber(factura.total, {lang: 'es'}).toUpperCase()} PESOS 00/100 M.N.`}</h5>
                                <h5 className="mb-2">Forma de pago: <span className="font-weight-light">{factura.formaPago}</span></h5>
                                <h5 className="mb-2">Método de pago: <span className="font-weight-light">{factura.metodoPago}</span></h5>
                            </Col>
                            
                        </Row>
                        <Row className="mt-2">
                            <Col xs="12" md="12">
                                <h5 className="mb-0">Cadena Original:</h5>
                                <span className="d-block ft-10">{factura.cadenaOriginal}</span>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col xs="8" md="8">
                                <h5 className="mb-0">Sello Digital:</h5>
                                <span className="d-block ft-10">{factura.selloDigital} </span>
                                <h5 className="mb-0 mt-2">Sello Digital SAT:</h5>
                                <span className="d-block ft-10">{factura.selloDigitalSAT}</span>
                            </Col>
                            <Col xs="4" md="4" className="text-center">
                                <img src={`data:image/jpeg;base64,${factura.imageQR}`} alt="QR" className="w-200"/>
                            </Col>
                        </Row>
                    </Card.Body>                    
                </Card>
            }
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

        </>

    );

}