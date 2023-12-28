import React, { useState } from 'react';
import { Button, Card, Col, Dropdown, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast, ToastContainer } from 'react-toastify';
import { loaderRequest } from '../loaders/LoaderRequest';
import Post from '../service/Post';
import { CUOTA_SAVE } from '../service/Routes';

export default function CuotaForm(props){
    const [tipoCuota, setTipoCuota] = useState("")
    const [validFolio, setValidFolio] = useState(true)
    const [isValidForm, setValidForm] = useState(true)
    const [isValidCosto, setValidCosto] = useState(true)
    const [observacion, setObservacion] = useState("")
    const [isSubmiting, setSubmiting] = useState(false)
    const [costo, setCosto] = useState(1)
    let history = useHistory()

    const handleSubmit = e =>{
        e.preventDefault()

        if(tipoCuota===""){
            setValidForm(false)
        }else if(costo < 1 || costo ===null || costo===undefined){
            setValidCosto(false)
        }else{
            setSubmiting(true)
            setValidForm(true)
            setValidCosto(true)
            const d={
                id: "",
                tipoCuota: {id: tipoCuota},
                loteTransient: {id: props.id},
                observacion: observacion,
                costo: costo
            }    
            //console.log(d)
            Post({url: CUOTA_SAVE, data: d, access_token: props.access_token ,header: true})
            .then(response=>{
                setSubmiting(false)
                console.log(response)
                if(response.data.success){
                    toast.success("Acción exitosa", {autoClose: 2000})
                    setObservacion("")
                    setTipoCuota({})
                    //redirigir
                    history.push(`/pagar-cuota/${response.data.data.id}`)
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
        }       
    }

    const onHandleChange = value =>{
        setTipoCuota(value)
        if(value===""){
            setCosto(1)
            setValidForm(false)
        }else{
            setValidForm(true)
            const c = props.tiposCuotas.filter(item=>item.id==value).map(item=>item.monto)[0]
            setCosto(c)
        }
    }

    return(
        <Card className="shadow">
            <ToastContainer />
            {isSubmiting && loaderRequest()}
            <Card.Body>
                <Card.Title>Generar Cuota</Card.Title>
                <Dropdown.Divider />  
                    <Form onSubmit={handleSubmit}>
                        <Form.Row>                            
                            <Col xs lg="4">
                                <Form.Group>
                                    <Form.Label>Tipo <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        className={`${!isValidForm && "error"}`}
                                        as="select"
                                        value={tipoCuota}
                                        onChange={e=>onHandleChange(e.target.value)}
                                    >
                                        <option value="">Seleccionar opción</option>
                                        {
                                            props.tiposCuotas.map((item,i)=>(
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
                            <Col>
                                <Button variant="primary" type="submit">Aceptar</Button>
                            </Col>
                        </Form.Row>                       
                    </Form>
            </Card.Body>
        </Card>
    )

}