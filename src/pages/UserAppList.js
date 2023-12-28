import React, { useEffect, useState } from 'react'
import TableData from '../components/TableData'
import Get from '../service/Get'
import TableSkeleton from '../loaders/TableSkeleton'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { USER_APP_DELETE, USER_APP_GET } from '../service/Routes'
import { FiEdit } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { WaveLoading } from 'react-loadingg'
import { enviarNotificacionFirebase } from '../utils/enviarNotificacionFirebase'
import { toast } from 'react-toastify';
import { FaRegPaperPlane } from 'react-icons/fa'
import Delete from '../service/Delete'
import { RiDeleteBinLine } from 'react-icons/ri'

const commonStyle = {
    margin: 'auto',
    position: 'initial',
    left: 0,
    right: 0,
    top:10,
    bottom:10
};

export default function UserAppList({auth,handleIsEditing,path}){
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState([])
    let history = useHistory()
    const [message, setMessage] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [submiting, setSubmiting] = useState(false)
    const [tokens, setTokens] = useState(null)
    const [isDeleteId, setIsDeleteId] = useState(false)

    useEffect(()=>{       
        DataList()                
    }, [])

    const DataList = () =>{
        setIsLoading(true)
        Get({url: USER_APP_GET, access_token: auth.data.access_token})
        .then(response=>{
            setIsLoading(false)
            setUsers(response.data)
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
        })
    }

    const enabledFormatter = (cell) => {
        if(cell === 'pendiente'){
            return <span className="text-warning">Pendiente</span>
        }else if(cell === 'verificada'){
            return <span className="text-success">Verificada</span>
        }else if(cell === 'bloqueada'){
            return <span className="text-danger">Bloqueada</span>
        }else if(cell === 'plazo_pago'){
            return <span className="text-primary">Plazo de pago</span>
        }else if(cell === 'bloqueo_adeudo'){
            return <span className="text-danger">Bloqueo por adeudo</span>
        }
    }
    
    const actions = (cell, row, rowIndex) => {
        return (
            <div>                
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => {
                    setTokens(row.token) 
                    setOpenModal(true)
                    }} ><FaRegPaperPlane /></Button>
                <Button size="sm" variant="outline-secondary" className="btn-xs" onClick={e => editItem(row)} ><FiEdit /></Button>
                <Button size="sm" variant="outline-danger" className="btn-xs" onClick={e => deleteItem(row)}><RiDeleteBinLine  /></Button>
            </div>
        );
    }

    const editItem = (data) => {
        handleIsEditing(true)
        history.push(`${path}/value?id=${data.id}`)
    }

    const columns = [
        {
            dataField: 'id',
            headerStyle: { width: '0px' },
            text: 'ID',
            hidden: true
        }, 
        {
            dataField: 'name',
            text: 'Nombre'
        }, 
        {
            dataField: 'email',
            text: 'Correo Electrónico'
        },
        {
            dataField: 'phone',
            text: 'Teléfono'
        },
        {
            dataField: 'status',
            text: 'Estado',
            formatter: enabledFormatter,
        },
        {
            dataField: 'lote.referencia',
            text: 'Lote',
        },
        {
            dataField: '',
            isDummyField: true,
            text: '',
            headerAlign: 'center',
            align: 'center',
            headerStyle: { width: '10%' },
            formatter: actions,            
        }
    ];

    const handleClose = () => setOpenModal(false)

    const enviarNotificacion = async () => {
        if(tokens){
            setSubmiting(true)
            const response = await enviarNotificacionFirebase(message, tokens)
            //console.log(response)
            setSubmiting(false)
            if(response.status===200){   
                setMessage('')             
                setOpenModal(false)
                toast.success("Acción exitosa", {autoClose: 2000})
            }else{
                toast.info(response.statusText, {autoClose: 8000})
            }
            
        }else{
            toast.info("No se le puede enviar notificación a esta cuenta debido a que la cuenta no tiene la información completa", { autoClose: 7000 })
        }
        
    }

    const deleteItem = (data) => {      
        setIsDeleteId(true)
        Delete({url: `${USER_APP_DELETE}/${data.id}`, access_token: auth.data.access_token})
        .then(response=>{            
            setIsDeleteId(false)            
            toast.success("Acción exitosa",{ autoClose: 2000 })
            DataList()
        })
        .catch(error=>{
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar la acción. Intente más tarde",{ autoClose: 3000 })
        })
        
    }
    
    return(
        <div>
                {
                    isLoading
                    ? <TableSkeleton />
                    : <TableData columns={columns} products={users} />
                }
                <Modal show={openModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Notificación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={`${submiting  && 'h-100p'}`}>
                        {
                            submiting 
                            ? <div className="loadModal t20p">
                                <h6 style={{color: '#7186ed'}}>Enviando notificación</h6>
                                <WaveLoading style={commonStyle} color={"#6586FF"} />
                                </div>
                            : <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Mensaje</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={message} onChange={e=>setMessage(e.target.value)}/>
                                    </Form.Group>                                    
                                </Col>
                            </Row>  
                        }
                                                                        
                    </Modal.Body>
                    <Modal.Footer>                
                        <Button variant="outline-primary" onClick={enviarNotificacion} disabled={submiting}>Enviar</Button>
                    </Modal.Footer>
                </Modal>
        </div>
        
    )
}
