import React, { useContext, useState } from 'react'
import { Card, Col, Row,Form,Dropdown, Button, Table, Alert } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import SelectAjax from '../components/SelectAjax'
import { authContext } from '../context/AuthContext'
import { loaderRequest } from '../loaders/LoaderRequest'
import Post from '../service/Post'
import { GET_LOTES_HABITACIONALES, LOTES_FUSIONAR } from '../service/Routes'

export default function FusionarLotes(){
    const [lotesFusiones, setLotesFusiones] = useState([])
    const {auth} = useContext(authContext)
    const [lote, setLote] = useState(null)
    const [loteReferencia, setLoteReferencia] = useState(null)
    const [submiting, setSubmiting] = useState(false)
    const [error, setError] = useState(false)

    const seleccionar = e =>{
        if(lote!=null){
            if(lotesFusiones.filter(el=>parseInt(el.id)===parseInt(lote.value)).length===0){
                let arr = [...lotesFusiones]
                let obj = {
                    id: lote.value,
                    name: lote.label,
                    selected: false
                }
                arr.push(obj)
                setLotesFusiones(arr)
            }           
        }
    }

    const onSelected = id =>{
        let idx = lotesFusiones.findIndex(el=>el.id===id)
        setLoteReferencia(lotesFusiones[idx])
    }

    const onDeleted = id =>{
        let arr = lotesFusiones.filter(el=>el.id!==id)
        setLotesFusiones(arr)
        if(arr.filter(el=>parseInt(el.id)===parseInt(loteReferencia.id)).length===0){
            setLoteReferencia(null)
        }
    }

    const onHandleFusion = e =>{
        setError(false)
        if(lotesFusiones.length <= 1 || loteReferencia==null){
            setError(true)
        }else{
            setSubmiting(true)
            let data = {
                lotesFusiones: lotesFusiones.filter(el=>parseInt(el.id)!==parseInt(loteReferencia.id)).map(el=>({id: el.id, name: el.name})),
                loteReferencia: {id: loteReferencia.id, name: loteReferencia.name}
            }
            //console.log(data)

            Post({url: LOTES_FUSIONAR, data: data, access_token: auth.data.access_token, header: true})
            .then(response=>{
                if(response.data.success){
                    setSubmiting(false)
                    toast.success("Acción exitosa", {autoClose: 3000})
                    setLoteReferencia(null)
                    setLotesFusiones([])                    
                }else{
                    setSubmiting(false)
                    toast.info(response.data.message, {autoClose: 10000})
                }
            })
            .catch(error=>{
                setSubmiting(false)
                toast.error("Ocurrió un error. Contactar al administrador", {autoClose: 5000})
            })
        }
    }

    return(
        <Card className="shadow mb-5">
            {submiting && loaderRequest()}
            <Card.Body>
                <ToastContainer />
                <Card.Title>Fusionar lotes</Card.Title>
                <Dropdown.Divider />
                <Row>
                    {error && <Col xs="12" md="12">
                        <Alert variant="danger">
                            Debes seleccionar mas de 1 lote y además seleccionar el lote referencia
                        </Alert>
                    </Col>}
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
                    <Col xs="12" md="6">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Referencia</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    lotesFusiones.map((item,i)=>(
                                        <tr key={i}>
                                            <td width="80%">{item.name}</td>
                                            <td width="20%">
                                                <span className="badge badge-primary cursor-pointer" onClick={e=>onSelected(item.id)}>Seleccionar</span>                                                
                                            </td>
                                            <td width="20%"><span className="badge badge-danger cursor-pointer" onClick={e=>onDeleted(item.id)}>Eliminar</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>                            
                        </Table>
                    </Col>
                    <Col xs="12" md="6">
                        <h6>Lote refencia</h6>
                        {loteReferencia ? <strong>{loteReferencia.name}</strong> : "Seleccionar"}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Button variant="primary" onClick={onHandleFusion}>Aceptar</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}