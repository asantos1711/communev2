import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import Post from '../service/Post'
import { CARGO_CUOTA_INICIAL_MASIVO } from '../service/Routes'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import { Row, Col, Card, Dropdown, Alert, Form, Button } from 'react-bootstrap'
import { RiArrowGoBackLine } from 'react-icons/ri'

export default function CuotaInicialGeneradaNueva({selectOpt, access_token}){
    const history = useHistory()
    const [isSubmiting, setSubmiting] = useState(false)
    const [idCuota, setIdCuota] = useState("")
    const [checkCondominal, setCheckCondominal] = useState(true)
    const [checkHabitacional, setCheckHabitacional] = useState(true)
    const [checkComercial, setCheckComercial] = useState(false)
    const [validForm, setValidForm] = useState(true)

    const handleSubmit = e =>{ 

        let  checked = checkComercial || checkCondominal || checkHabitacional

        if(!checked || idCuota===''){
            setValidForm(false)
        }else{
            setSubmiting(true)
            setValidForm(true)
            const d ={
                idCuota: idCuota,
                checkCondominal: checkCondominal,
                checkHabitacional: checkHabitacional,
                checkComercial: checkComercial
            }

            //console.log(d)
            Post({url: CARGO_CUOTA_INICIAL_MASIVO, data: d, access_token: access_token, header: true})
            .then(response=>{
                //console.log(response)
                setSubmiting(false)
                if(response.data.success){
                    toast.success("Acción exitosa", {autoClose: 2000})
                    history.push("/admin/cuota-inicial-generadas")
                }else{
                    toast.error(response.data.message, {autoClose: 8000})
                }
            })
            .catch(error=>{
                setSubmiting(false)
                //console.log(error)
                toast.error("En estos momentos no se puede realizar la acción. Intente más tarde o contacte con el administrador", {autoClose: 10000})
            })
        }
    }

    return(
        <div>
            { isSubmiting && loaderRequest() }
            <Row className="mb-1">
                <Col className="text-right">
                    <span className="badge badge-pill badge-dark go-back" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow">                        
                        <Card.Body>
                            <Card.Title>Generar Cuota inicial</Card.Title>
                            <Dropdown.Divider />
                            {
                                !validForm && <Alert variant="danger">Debe seleccionar el tipo de cuota inicial y al menos escoger
                                un tipo de lote</Alert>
                            }
                            <Row>
                                <Col xs="12" lg="3">
                                    <Form.Group>
                                        <Form.Label>Tipo cuota inicial</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={idCuota}
                                            onChange={e=>setIdCuota(e.target.value)}                                            
                                        >
                                            <option value="">Seleccionar opción</option>
                                            {
                                                selectOpt.map((item,i)=>(
                                                    <option key={i} value={item.id}>{item.name}</option>
                                                ))
                                            }
                                        </Form.Control>                      
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="12" lg="12">
                                    <Form.Check
                                        type="checkbox"
                                        label="Lote condominal"
                                        checked={checkCondominal}
                                        onChange={e=>setCheckCondominal(e.target.checked)}
                                    />
                                </Col>
                                <Col xs="12" lg="12">
                                    <Form.Check
                                        type="checkbox"
                                        label="Lote habitacional"
                                        checked={checkHabitacional}
                                        onChange={e=>setCheckHabitacional(e.target.checked)}
                                    />
                                </Col>
                                <Col xs="12" lg="12">
                                    <Form.Check
                                        type="checkbox"
                                        label="Lote comercial"
                                        checked={checkComercial}
                                        onChange={e=>setCheckComercial(e.target.checked)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="primary" onClick={e=>handleSubmit()}>Aceptar</Button>{' '}
                                    <Link to={`/admin/cuota-inicial-generadas`} className="btn btn-secondary">Cancelar</Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )

}