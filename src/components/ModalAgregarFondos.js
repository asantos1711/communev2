import React, { useState } from 'react'
import { Button, Modal, Row, Col, Form } from 'react-bootstrap'
import { RiExchangeDollarLine } from 'react-icons/ri';
import MiniLoad from '../loaders/MiniLoad';
import { LOTE_AGREGAR_FONDO } from '../service/Routes';
import Post from '../service/Post';
import { toast, ToastContainer } from 'react-toastify';

export default function ModalAgregarFondos({auth, id}){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [isLoading, setLoading] = useState(false)
    const [texto, setTexto] = useState('Cargando valores')
    const [fondo, setFondo] = useState(0)

    const onClickPagar = e =>{
        setTexto("Agregando fondos")
        setLoading(true)

        if(fondo>0){
            //enviar el post
            const d = {
                idLote: id,
                fondo: fondo
            }
            Post({url: LOTE_AGREGAR_FONDO, data: d, access_token: auth.data.access_token, header:  true})
            .then(response=>{
                setLoading(false)
                if(!response.data.success){
                    toast.info("No se puede ejecutar la acción. Intente más tarde", {autoClose: 5000})
                }else{
                    setShow(false)
                    toast.success("Accióm exitosa", {autoClose: 3000})
                }
            })
            .catch(error=>{
                setLoading(false)
                toast.error("Ocurrió error en el servidor. Contacte con el administrador", {autoClose: 8000})
            })            
        }        
    }

    return (
        <div className="list-inline-item">
            <ToastContainer />
            <Button size="sm" variant="outline-secondary" onClick={e=>setShow(true)} className=""><RiExchangeDollarLine className="icon-m1" /> <small>Agregar fondos</small></Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="sm"
            >
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>Agregar fondos</Modal.Title>
                </Modal.Header>
                
                {
                    isLoading ? <Modal.Body><MiniLoad texto={texto}/></Modal.Body>
                    :   <Modal.Body>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Cantidad</Form.Label>
                                        <Form.Control 
                                            type="number" 
                                            value={fondo}
                                            onChange={e=>setFondo(e.target.value)}
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
                    <Button variant="primary" onClick={e=>onClickPagar()} disabled={isLoading}>Pagar</Button>
                </Modal.Footer>
                
            </Modal>
        </div>
    )
}