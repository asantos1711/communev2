import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { RiMailSendLine } from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import MiniLoad from '../loaders/MiniLoad';
import Get from '../service/Get';
import Post from '../service/Post';
import { CORREO_CAMPANAS_ALL,CORREO_CAMPANAS_ENVIAR } from '../service/Routes';

export default function ModalCorreoCampanas({auth, id}){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isLoading, setLoading] = useState(false)
    const [texto, setTexto] = useState('Cargando valores')
    const [emails, setEmails] = useState([])
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)
    const [otherEmail, setOtherEmail] = useState('')

    const openModal = () =>{
        setLoading(true)
        Get({url: CORREO_CAMPANAS_ALL, access_token: auth.data.access_token})
       .then(response=>{
            //console.log(response)
            setEmails(response.data)
            setShow(true)
            setLoading(false)
       }) 
       .catch(error=>{
            //console.log(error)
            toast.error("Ocurrió un error. Intente más tarde o contacte con el administrador")
       })
    }

    const onClickEnviarCorreo = e =>{
           
        if(email===''){
            setError(true)
        }else{
            setError(false)
            setTexto("Enviando correo")
            setLoading(true)
            const d = {
                idLote: id,
                idCorreo: email,
                otroEmail: otherEmail
            }
            
            Post({url: CORREO_CAMPANAS_ENVIAR, data: d, access_token: auth.data.access_token, header: true})
            .then(response=>{
                if(response.data.success){
                    toast.success("Correo electrónico enviado", {autoClose: 3000})
                }else{
                    toast.info(response.data.message, {autoClose: 8000})
                }
                setLoading(false)
                setShow(false)
            })
            .catch(error=>{
                //console.log(error)
                toast.error("Ocurrió un error. Intente más tarde o contacte con el administrador")
                setLoading(false)
                setShow(false)
            })

            //console.log(email)
        }  
    }

    return (
        <div className="list-inline-item">
            <ToastContainer />
            <Button size="sm" variant="outline-secondary" onClick={e=>openModal()}><RiMailSendLine className="icon-m1" /> <small>Enviar correo</small></Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>Enviar correo electrónico</Modal.Title>
                </Modal.Header>
                
                {
                    isLoading ? <Modal.Body><MiniLoad texto={texto}/></Modal.Body>
                    :   <Modal.Body>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nombre de correo</Form.Label>
                                        <Form.Control as="select" value={email} onChange={e=>setEmail(e.target.value)} 
                                            className={`${error && 'error'}`}
                                        >
                                            <option value="">Seleccionar opción</option>
                                            {
                                                emails.map((item,i)=>(
                                                    <option key={i} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Correo electrónico adicional</Form.Label>
                                        <Form.Control 
                                            value={otherEmail}
                                            onChange={e=>setOtherEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>                        
                }
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}  disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={e=>onClickEnviarCorreo()} disabled={isLoading}>Enviar</Button>
                </Modal.Footer>
                
            </Modal>
        </div>
    )

}