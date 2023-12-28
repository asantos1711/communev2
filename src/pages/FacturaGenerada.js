import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Alert, Button, Table, Modal, Form } from 'react-bootstrap'
import { FaDownload } from 'react-icons/fa'
import { RiMailSendLine } from 'react-icons/ri'
import Get from '../service/Get'
import { authContext } from '../context/AuthContext'
import {FACTURA_GET_BY_ID, FACTURA_ENVIAR_EMAIL, FACTURA_GET_EMAIL_FACTURAR } from '../service/Routes'
import { loaderRequest } from '../loaders/LoaderRequest'
import { facturaPdf } from '../utils/facturaPdf'
import { formatNumber } from '../utils/formatNumber'
import Post from '../service/Post'
import WaveLoading from 'react-loadingg/lib/WaveLoading'
import { toast, ToastContainer } from 'react-toastify'
import cfdiLogo from '../img/cfdi.png';
import cfdiVersionv4 from '../img/cfdv4.png';
import cfdiVersion from '../img/cfdiversion.png';
import { getLogoResidencial } from '../utils/getLogoResidencial'



export default function FacturaGenerada(){
    const {auth} = useContext(authContext)
    const {id} = useParams()
    const [isSubmiting, setSubmiting] = useState(false)
    const [items, setItems] = useState([])
    const [hasData, setHasData] = useState(false)
    const [show, setShow] = useState(false);
    const [emailDefault, setEmailDefault] = useState('')
    const [emailPlus, setEmailPlus] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const [isVersion4, setIsVersion4] = useState(false)

    const handleClose = () => setShow(false);

    const downloadPDF = () =>{
        setSubmiting(true)
        ///get factura
        Get({url: `${FACTURA_GET_BY_ID}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            setItems(response.data.data.facturaConceptosList)
            console.log(response)
            setHasData(true)
            if(response.data.data.version==='4.0'){
                setIsVersion4(true)
            }
            //download pdf
            facturaPdf(response.data.data)

            setSubmiting(false)
        })
        .catch(error=>{
            //console.log(error)
        })
    }

    const sendEmail = () =>{
        setSendingEmail(true)

        const d = {
            id: id,
            correoElectronico: emailDefault,
            correoAdicional: emailPlus
        }

        Post({url: FACTURA_ENVIAR_EMAIL, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            //console.log(response)
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

    const showEmail = (id) =>{
        setSubmiting(true)
        Get({url: `${FACTURA_GET_EMAIL_FACTURAR}/${id}`, access_token: auth.data.access_token})
        .then(response=>{
            // console.log(response)
            setEmailDefault(response.data)
            setShow(true)
            setSubmiting(false)
        })
        .catch(error=>{
            // console.log(error)
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

    return(
        <div>
            <ToastContainer />
            <Card className="shadow">
                {isSubmiting &&  loaderRequest()}
                <Card.Body>
                
                    <Row className="justify-content-md-center mb-4">
                        <Col xs="12" lg={5}>
                            <Alert variant="success" className="text-center">Se ha generado la factura con éxito</Alert>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Button variant="secondary" className="mr-2" onClick={downloadPDF}><FaDownload /> Descargar PDF</Button>{' '}
                        <Button variant="light" onClick={e=>showEmail(id)}><RiMailSendLine /> Enviar por correo electrónico</Button>
                    </Row>
                
                    
                </Card.Body>
            </Card>
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
                        items.map((item,i)=>(
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
        </div>
        
    )
}