import React, { useContext, useState } from 'react'
import { Alert, Button, Card, Col, Dropdown, Form, Modal, Row, Table } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import SelectAjax from '../components/SelectAjax'
import { authContext } from '../context/AuthContext'
import { loaderRequest } from '../loaders/LoaderRequest'
import SimpleLoad from '../loaders/SimpleLoad'
import Get from '../service/Get'
import Post from '../service/Post'
import { CANCELAR_DEUDA, GET_CANCELAR_DEUDA, GET_LOTES_HABITACIONALES } from '../service/Routes'
import { formatNumber } from '../utils/formatNumber'
import { setBagdeStatus } from '../utils/setBagdeStatus'


export default function CancelarDeudaGlobal(){
    const {auth} = useContext(authContext)
    const [lote, setLote] = useState(null)
    const [submiting, setSubmiting] = useState(false)
    const [tipo, setTipo] = useState('')
    const [error, setError] = useState(false)
    const [items, setItems] = useState([])
    const [codigo, setCodigo]= useState('')
    const [razon, setRazon] = useState('')
    const [id, setId] = useState(null)
    const [submitingCancel, setSubmitingCancel] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);


    const seleccionar = e =>{
        if(lote===null || tipo===""){
            setError(true)
        }else{
            setError(false)
            setSubmiting(true)
            //peticion para traer todos los cargos generados
            Get({url: `${GET_CANCELAR_DEUDA}/${tipo}/${lote.value}`, access_token: auth.data.access_token})
            .then(response=>{
                console.log(response)
                setItems(response.data.data)
                setSubmiting(false)
            })
            .catch(error=>{
                console.log(error)
                setSubmiting(false)
            })
        }
    }

    const onCancelar = (id) =>{
        console.log(id)
        setId(id)
        setShow(true)
    }

    const handleCancelar = e =>{
        setSubmitingCancel(true)
        let d = {
            id: id,
            codigo: codigo, 
            razon: razon,
            tipo: tipo
        }
        Post({url: CANCELAR_DEUDA, data: d, access_token: auth.data.access_token, header: true})
        .then(response=>{
            console.log(response)
            if(response.data.success){
                let arr = [...items]
                let index = arr.findIndex(el=>el.id===id)
                arr[index].status='cancelado'
                setItems(arr)
                setShow(false)
                toast.success("Proceso exitoso", {autoClose: 3000})
            }else{
                toast.info(response.data.message, {autoClose: 8000})
            }
            setSubmitingCancel(false)
        })
        .catch(error=>{
            console.log(error)
            setSubmitingCancel(false)
            toast.error("Ha ocurrido un error. Contactar al administrador",  {autoClose: 5000})
            
        })
    }

    return(
        <Card className="shadow mb-5">
            {submiting && loaderRequest()}
            <Card.Body>
                <ToastContainer />
                <Card.Title>Cancelar deuda</Card.Title>
                <Dropdown.Divider />
                <Row>
                    {error && <Col xs="12" md="12">
                        <Alert variant="danger">
                            Debes seleccionar 1 lote y el tipo de deuda
                        </Alert>
                    </Col>}
                    <Col xs="12" md="3">
                        <Form.Group>
                            <Form.Label>Tipo deuda</Form.Label>
                            <Form.Control
                                as="select"
                                value={tipo}
                                onChange={e=>setTipo(e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                <option value="mantenimiento">Mantenimiento</option>
                                <option value="cuota_inicial_proyecto">Cuota inicial de proyecto</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs="12" md="6">
                        <Form.Group>
                            <Form.Label>Seleccionar lote</Form.Label>
                            <SelectAjax
                                defaultValue={false}
                                url={GET_LOTES_HABITACIONALES}
                                access_token={auth.data.access_token}
                                isMulti={false}
                                handleChange={(value) => {
                                    setLote(value)
                                }} 
                                defaultOptions={lote}   
                                valid={true}     
                                isClearable={true}                                                 
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="secondary" onClick={seleccionar}>Seleccionar</Button>
                    </Col>
                </Row>

                <hr />
                <Row>
                    <Col xs="12" md="12">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Estado</th>
                                    <th>Deuda</th>
                                    <th>Pagado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    items.map((item,i)=>(
                                        <tr key={i}>
                                            <td width="50%">{item.concepto}</td>
                                            <td width="20%">
                                                <span className={`badge ${setBagdeStatus(item.status)}`}>{item.status}</span>
                                            </td>
                                            <td width="10%">{formatNumber(item.deuda)}</td>
                                            <td width="10%">{formatNumber(item.pagado)}</td>
                                            <td width="10%">
                                                {
                                                    item.status !== "cancelado" &&
                                                    <span className="text-danger cursor-pointer" onClick={e=>onCancelar(item.id)}>Cancelar</span>
                                                }                                                                                                
                                            </td>                                            
                                        </tr>
                                    ))
                                }
                            </tbody>                            
                        </Table>
                    </Col>                    
                </Row>
            </Card.Body>
            <Modal show={show} onHide={handleClose}>
                {submitingCancel && <SimpleLoad />}
                <Modal.Header closeButton>
                <Modal.Title>Seguro que desea cancelar la deuda</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Código de autorización</Form.Label>
                        <Form.Control 
                            type="text"
                            value={codigo}
                            onChange={e=>setCodigo(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Motivo</Form.Label>
                        <Form.Control 
                            type="text"
                            value={razon}
                            onChange={e=>setRazon(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleCancelar}>
                    Aceptar
                </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}