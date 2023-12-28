import React, { useState, useEffect } from 'react'
import { Col, Row, Form, Button } from 'react-bootstrap'
import { FaRegBuilding, FaTimesCircle } from 'react-icons/fa'
import { CapFirst } from '../utils/CapFirst'
import Post from '../service/Post'
import { LOTE_SAVE_HAB, LOTE_DELETE_HAB } from '../service/Routes'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import Delete from '../service/Delete'

export default function ChildrenList({childrenList,type_lote,idParent,access_token, numeroViviendas}){
    const [viviendas, setViviendas] = useState([])    
    const [isProcessing, setProcessing] = useState(false)
    const [inputRef, setInputRef] = useState('')
    const [errorInput, setErrorInput] = useState(false)
    useEffect(()=>{
        setViviendas(childrenList)
    }, [childrenList])


    const removeVivienda = ref =>{
        //console.log(ref)        
        setProcessing(true)
        Delete({url: `${LOTE_DELETE_HAB}/${ref}`, access_token:access_token})
        .then(response=>{
            setProcessing(false)
            //console.log(response)
            toast.success("Acción exitosa", {autoClose: 2000})
            setViviendas(viviendas.filter(v=>v.referencia!==ref))
        })
        .catch(error=>{
            setProcessing(false)
            // console.log('error')
            // console.log(error)
            toast.error("No se puede ejecutar esta acción por el momento. Contacte al administrador", {autoClose: 5000})
        })
        
    }

    const saveNewRef = idParent =>{
        //console.log(idParent)
        //console.log(inputRef)
        if(inputRef===''){
            setErrorInput(true)
        }else{
            setErrorInput(false)
            setProcessing(true)
            //peticion para salvar una nueva vivienda en un condominio
            const d = {
                id: "",
                referencia: inputRef
            }
            Post({url: `${LOTE_SAVE_HAB}/${idParent}`, data: d, access_token:access_token, header: true})
            .then(response=>{
                setProcessing(false)
                //console.log(response)
                if(!response.data.success){
                    toast.warning(response.data.message, {autoClose: 8000})
                }else{
                    setViviendas(viviendas.concat(response.data.data))
                    toast.success("Acción exitosa", {autoClose: 2000})
                }
            })
            .catch(error=>{
                setProcessing(false)
                toast.error("Ocurrió un error en el servidor. Intente otra vez", {autoClose:8000})
                // console.log('error')
                // console.log(error)
            })
        }
    }


    return(
        <Col>
        {isProcessing && loaderRequest()}
        {
            type_lote==='condominal' &&
            <div>
                <Row>
            {
                viviendas.map((item, idx)=>(
                <Col xs lg="2" key={idx} className="mb-3">
                    <Row>
                        <Col xs lg="7">
                            <FaRegBuilding /> {item.referencia}<br />
                            {CapFirst(item.status)}
                        </Col>
                        <Col xs lg="3" className="pr-0 text-right">
                            <FaTimesCircle className="text-danger" onClick={e=>removeVivienda(item.referencia)}/>
                        </Col>
                        <Col xs lg="2 pl-3">                                                                            
                            <div className="line-v"></div>
                        </Col>
                    </Row>                                                                    
                </Col>
            ))}
            </Row>
                {viviendas.length < numeroViviendas && <Row className="mt-4">
                    <Col xs="8" lg="3">
                        <Form.Group>
                            <Form.Label>Nueva referencia</Form.Label>
                            <Form.Control 
                                className={`${errorInput ? 'error': ''}`}
                                type="text" 
                                value={inputRef} 
                                onChange={e=>{
                                    setInputRef(e.target.value)
                                    setErrorInput(false)
                                }} 
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="4" lg="2">
                        <Form.Group>
                            <Form.Label className="opacity-0 d-block">Nueva referencia</Form.Label>
                            <Button variant="link" onClick={e=>saveNewRef(idParent)}>Agregar</Button>
                        </Form.Group>
                        
                    </Col>
                </Row>}
            </div>
        }            
        </Col>
    )
}