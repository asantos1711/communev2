import React, { useState } from 'react'
import { Row, Col, Card, Dropdown, Form, Button } from 'react-bootstrap'
import { useHistory, Link } from 'react-router-dom'
import { RiArrowGoBackLine } from 'react-icons/ri'
import moment from 'moment'
import DatePicker, { registerLocale } from "react-datepicker"
import es from "date-fns/locale/es"
import Post from '../service/Post'
import { toast } from 'react-toastify'
import { loaderRequest } from '../loaders/LoaderRequest'
import { MTTO_GENERADO_GENERAR } from '../service/Routes'
registerLocale("es", es);

export default function MantenimientoGeneradoNuevo(props){
    let history = useHistory()
    const [fecha, setFecha] = useState(new Date())
    const [validInput, setValidInput] = useState(true)
    const [isSubmiting, setSubmiting] = useState(false)
    
    
    const handleSubmit = e =>{ 
        if(fecha===null){
            setValidInput(false)
        }else{
            setSubmiting(true)
            setValidInput(true)
            const d = {
                mes: moment(fecha).format("M"),
                year: moment(fecha).format("yyyy")
            }
            Post({url: MTTO_GENERADO_GENERAR, data: d, access_token: props.access_token, header: true})
            .then(response=>{
                //console.log(response)
                setSubmiting(false)
                toast.success("Acción exitosa", {autoClose: 2000})
                history.push("/admin/mantenimientos-generados")
            })
            .catch(error=>{
                //console.log(error)
                setSubmiting(false)
                toast.error("No se pudo ejecutar la acción. Contacte con el administrador", {autoClose: 5000})
            })
        }
    }
    return(
        <div>
            {
                isSubmiting && loaderRequest()
            }
            <Row className="mb-1">
                <Col className="text-right">
                    <span className="badge badge-pill badge-dark go-back" onClick={history.goBack}><RiArrowGoBackLine /> Atrás</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Generar Mantenimiento</Card.Title>
                            <Dropdown.Divider />
                            <Row>
                                <Col xs lg="3">
                                    <Form.Group>
                                        <Form.Label>Período</Form.Label>
                                        <DatePicker className={`form-control ${!validInput && "error"}`}
                                            showPopperArrow={false}
                                            selected={fecha}
                                            autoComplete="off"
                                            dateFormat="MMMM-yyyy"
                                            onChange={date => setFecha(date)}
                                            locale="es"
                                            maxDate={new Date()}
                                            showMonthYearPicker
                                        />                        
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant="primary" onClick={e=>handleSubmit()}>Aceptar</Button>{' '}
                                    <Link to={`/admin/mantenimientos-generados`} className="btn btn-secondary">Cancelar</Link>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        
    )
}