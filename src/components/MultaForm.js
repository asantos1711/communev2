import React, { useState } from 'react'
import { Card, Dropdown, Col, Form, Button } from 'react-bootstrap'
import { MULTA_SAVE } from '../service/Routes'
import Post from '../service/Post'
import { loaderRequest } from '../loaders/LoaderRequest'
import { toast, ToastContainer } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { app } from '../firebaseConfig'
import { enviarNotificacionFirebase } from '../utils/enviarNotificacionFirebase'

export default function MultaForm(props){
    const [tipoMulta, setTipoMulta] = useState("")
    const [folio, setFolio] = useState("")
    const [validFolio, setValidFolio] = useState(true)
    const [isValidForm, setValidForm] = useState(true)
    const [isValidCosto, setValidCosto] = useState(true)
    const [observacion, setObservacion] = useState("")
    const [isSubmiting, setSubmiting] = useState(false)
    const [costo, setCosto] = useState(1)
    const [fileName, setFileName] = useState('Seleccionar archivo')
    const [file, setFile] = useState(null)
    const [errorFile, setErrorFile] = useState(false)
    let history = useHistory()
    

    const handleUploadFile = (e) =>{
        const file = e.target.files[0];
        if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'){
            setErrorFile(false)
            setFile(file)
            setFileName(file.name)
        }else{
            setErrorFile(true)
            setFile(null)
            setFileName("Seleccionar archivo")
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        if(folio==="" || folio===null){
            setValidFolio(false)
        }else if(tipoMulta===""){
            setValidForm(false)
        }else if(costo < 1 || costo ===null || costo===undefined){
            setValidCosto(false)
        }else{
            try{
                setSubmiting(true)
                setValidForm(true)
                setValidCosto(true)
                if(file){
                    const storageRef = app.storage().ref();
                    let fileName = `${file.name}-${new Date().getTime()}`
                    const fileRef = storageRef.child(`documents/${process.env.REACT_APP_RESIDENCIAL}/` +fileName);
                    await fileRef.put(file);
                    let fileUrl = await fileRef.getDownloadURL();
                    if(fileUrl){
                        const d={
                            id: "",
                            tipoMulta: {id: tipoMulta},
                            loteTransient: {id: props.id},
                            observacion: observacion,
                            folio: folio,
                            costo: costo,
                            url: fileUrl,
                            fileName:fileName 
                        }
                        //console.log(d)
                        Post({url: MULTA_SAVE, data: d, access_token: props.access_token ,header: true})
                        .then(response=>{
                            setSubmiting(false)
                            //console.log(response)
                            if(response.data.success){
                                toast.success("Acción exitosa", {autoClose: 2000})
                                setObservacion("")
                                setTipoMulta({})
                                //redirigir
                                history.push(`/deudas/${props.id}`)
                            }else{
                                toast.error("No se puede ejecutar la acción. Contacte el administrador", {autoClose: 5000})
                            }
                            
                        })            
                        .catch(error=>{
                            setSubmiting(true)
                            // console.log("error")
                            // console.log(error)
                            toast.error("No se puede ejecutar esta acción en estos momentos. Intente más tarde", {autoClose: 5000})
                        })
                        //enviar notificacion a dispositivos
                        if(props.token){
                            console.log('send notificacion')
                            enviarNotificacionFirebase(`Nueva sanción con folio ${d.folio} por un monto de $${d.costo} pesos`, props.tokens)
                        }
                    }
                }else{
                    const d={
                        id: "",
                        tipoMulta: {id: tipoMulta},
                        loteTransient: {id: props.id},
                        observacion: observacion,
                        folio: folio,
                        costo: costo,
                        url: "",
                        fileName:"" 
                    }
                    //console.log(d)
                    Post({url: MULTA_SAVE, data: d, access_token: props.access_token ,header: true})
                    .then(response=>{
                        setSubmiting(false)
                        //console.log(response)
                        if(response.data.success){
                            toast.success("Acción exitosa", {autoClose: 2000})
                            setObservacion("")
                            setTipoMulta({})
                            //redirigir
                            history.push(`/deudas/${props.id}`)
                        }else{
                            toast.error("No se puede ejecutar la acción. Contacte el administrador", {autoClose: 5000})
                        }
                        
                    })            
                    .catch(error=>{
                        setSubmiting(true)
                        // console.log("error")
                        // console.log(error)
                        toast.error("No se puede ejecutar esta acción en estos momentos. Intente más tarde", {autoClose: 5000})
                    })
                    //enviar notificacion a dispositivos
                    if(props.token){
                        console.log('send notificacion')
                        enviarNotificacionFirebase(`Nueva sanción con folio ${d.folio} por un monto de $${d.costo} pesos`, props.token)
                    }
                }
                
                
            }catch(error){
                toast.error("No podemos ejecutar la acción. Contacte al administrador por favor", {autoClose: 8000})
            }
        }       
    }

    const onHandleChange = value =>{
        setTipoMulta(value)
        if(value===""){
            setCosto(1)
            setValidForm(false)
        }else{
            setValidForm(true)
            const c = props.tiposMultas.filter(item=>item.id==value).map(item=>item.monto)[0]
            setCosto(c)
        }
    }

    return(
        <Card className="shadow">
            <ToastContainer />
            {isSubmiting && loaderRequest()}
            <Card.Body>
                <Card.Title>Generar Multa</Card.Title>
                <Dropdown.Divider />  
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Folio <span className="text-danger">*</span></Form.Label>
                                    <Form.Control className={`${!validFolio && "error"}`} type="text" value={folio} 
                                        onChange={e=>{
                                            setFolio(e.target.value)
                                            if(e.target.value===""){
                                                setValidFolio(false)
                                            }else{
                                                setValidFolio(true)
                                            }
                                        }}
                                    />                            
                                </Form.Group>
                            </Col>
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Tipo <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className={`${!isValidForm && "error"}`}
                                        as="select"
                                        value={tipoMulta}
                                        onChange={e=>onHandleChange(e.target.value)}
                                    >
                                        <option value="">Seleccionar opción</option>
                                        {
                                            props.tiposMultas.map((item,i)=>(
                                                <option key={i} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs lg="2">
                                <Form.Group>
                                    <Form.Label>Costo <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="number" value={costo} min="1"
                                        className={`${!isValidCosto && "error"}`}
                                        onChange={e=>setCosto(e.target.value)}
                                    /> 
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs lg="6">
                                <Form.Group>
                                    <Form.Label>Descripción </Form.Label>
                                    <Form.Control as="textarea" rows="3"
                                        name="description" 
                                        onChange={e=>setObservacion(e.target.value)}
                                        value={observacion}
                                    />                         
                                </Form.Group>
                            </Col>   
                        </Form.Row>
                        <Form.Row>
                            <Col xs lg="6">
                            <Form.Label>Subir imagen</Form.Label>  
                                <div className="input-group">
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputFile" aria-describedby="inputFileAddon04"                                                                        
                                            onChange={e=>{
                                                handleUploadFile(e)
                                            }}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                        <label className="custom-file-label" htmlFor="inputFile">{fileName}</label>
                                    </div>
                                </div>  
                            </Col>
                        </Form.Row>  
                        <Form.Row className='mt-3'>
                            <Col>
                                <Button variant="primary" type="submit">Aceptar</Button>
                            </Col>
                        </Form.Row>                       
                    </Form>
            </Card.Body>
        </Card>
    )
}