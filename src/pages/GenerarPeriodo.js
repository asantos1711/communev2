import React, { useContext, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Row, Table } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import SelectAjax from "../components/SelectAjax";
import { authContext } from "../context/AuthContext";
import Get from "../service/Get";
import { ADD_PERIODO_LOTO, GET_LOTE_PERIODO, LOTE_FOR_VEHICLES } from "../service/Routes";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { getIntervalDateMtto } from "../utils/getIntervalDateMtto";
import { loaderRequest } from "../loaders/LoaderRequest";
import Post from "../service/Post";

registerLocale("es", es);

export default function GenerarPeriodo(){
    const { auth } = useContext(authContext)
    const [items, setItems] = useState([])
    const [lote, setLote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fechaInicial, setFechaInicial] = useState(null)
    const [fechaFinal, setFechaFinal] = useState(null)
    const [fechaEntrega, setFechaEntrega] = useState(null)
    const [mttosGenerar, setMttosGenerar] = useState([])
    const [submiting, setSubmiting] = useState(false)



    const onHandleLoteChange = (value) =>{
        setLoading(true)
        setLote(value)
        Get({url: `${GET_LOTE_PERIODO}/${value.value}`, access_token: auth.data.access_token})
        .then(response=>{
            console.log(response)
            setItems(response.data.data)
            
            //
            let fechaEntrega = moment(response.data.data.fechaEntrega, "YYYY-MM-DD")            
            if(fechaEntrega.get('date') < 15){
                fechaEntrega.set('date', response.data.data.diaCorte)
                setFechaEntrega(new Date(fechaEntrega.get('year'), fechaEntrega.get('month')-1, fechaEntrega.get('date')))
                setFechaInicial(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
                setFechaFinal(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
                generarMtto(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')), new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
            }else{
                fechaEntrega.set('date', response.data.data.diaCorte)
                fechaEntrega.add('month', 1)
                setFechaEntrega(new Date(fechaEntrega.get('year'), fechaEntrega.get('month')-1, fechaEntrega.get('date')))
                setFechaInicial(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
                setFechaFinal(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
                generarMtto(new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')), new Date(fechaEntrega.get('year'),fechaEntrega.get('month'), fechaEntrega.get('date')))
            }
            setLoading(false)
        })
    }
    const generarMtto = (fechaInicial, fechaFinal) =>{
        let arrayDates = getIntervalDateMtto(fechaInicial, fechaFinal)
        console.log(arrayDates)
        setMttosGenerar(arrayDates)
    }


    const onHandleFechaInicial = date =>{
        if(date===null){
            setFechaInicial(new Date(moment(fechaEntrega).get('year'), moment(fechaEntrega).get('month')+1, moment(fechaEntrega).get('date')))
            setFechaFinal(new Date(moment(fechaEntrega).get('year'), moment(fechaEntrega).get('month')+1, moment(fechaEntrega).get('date')))     
            generarMtto(new Date(moment(fechaEntrega).get('year'), moment(fechaEntrega).get('month')+1, moment(fechaEntrega).get('date')), 
                        new Date(moment(fechaEntrega).get('year'), moment(fechaEntrega).get('month')+1, moment(fechaEntrega).get('date')))        
        }else{
            setFechaInicial(new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')))
            if(date > fechaFinal){
                setFechaFinal(new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')))
                generarMtto(new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')),
                            new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')))
            }else{
                generarMtto(new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')), fechaFinal)
            }
        }
    }
    const onHandleFechaFinal = date =>{
        if(date===null){
            setFechaFinal(new Date(moment(fechaInicial).get('year'), moment(fechaInicial).get('month'), moment(fechaInicial).get('date')))
            generarMtto(fechaInicial, new Date(moment(fechaInicial).get('year'), moment(fechaInicial).get('month'), moment(fechaInicial).get('date')))
        }else{
            setFechaFinal(new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')))
            generarMtto(fechaInicial, new Date(date.getFullYear(), date.getMonth(), moment(fechaEntrega).get('date')))
        }
    }



    const onHandleGenerarPeriodo = e =>{
        setSubmiting(true)
        const data = {
            range: mttosGenerar,
            id: items.idLote
        }
        Post({url: ADD_PERIODO_LOTO, data: data, access_token: auth.data.access_token, header: true})
        .then(response=>{
            toast.success("Mantenimientos generado con éxito.", {autoClose: 5000})
            setSubmiting(false)
        })
        .catch(error=>{
            console.log(error)
        })        
    }


    return(
        <div>
            {submiting && loaderRequest()}
            <ToastContainer />
            <Card className="shadow">
                <Card.Body>
                    <Card.Title>Generar período</Card.Title>
                    <Dropdown.Divider />  
                    <Row>
                        <Col xs="12" md="6">
                            <Form.Group>
                                <Form.Label>Lote</Form.Label>
                                <SelectAjax
                                    defaultValue={lote === null || Object.keys(lote).length === 0 ? false : lote}
                                    url={LOTE_FOR_VEHICLES}
                                    access_token={auth.data.access_token}
                                    isMulti={false}
                                    handleChange={(value) => onHandleLoteChange(value)} 
                                    defaultOptions={lote}   
                                    valid={true}     
                                    isClearable={false}                                                 
                                />                    
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {!loading &&<Card className="shadow mt-2">
                <Card.Body>
                    <Card.Title>Generar período</Card.Title>
                    <Dropdown.Divider />  
                    <Row>
                        <Col><label>Fecha entrega: {moment(items.fechaEntrega, "YYYY-MM-DD").format("DD-MM-YYYY")}</label></Col>
                        
                    </Row>                        
                        <Row>
                            <Col xs="12" md="6" className="h-600">
                                <h6>Mantenimientos generados</h6>
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Mes</th>
                                            <th>Año</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.mantenimientos.map((item,i)=>(
                                                <tr key={i}>
                                                    <td>{item.mes}</td>
                                                    <td>{item.year}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                            <Col xs="12" md="6">
                                <Row>
                                    <Col xs="12" md="6">
                                        <Form.Group>
                                            <Form.Label>Fecha Inicial</Form.Label>
                                            <DatePicker className="form-control"
                                                    showPopperArrow={false}
                                                    selected={fechaInicial}
                                                    autoComplete="off"
                                                    selectsStart
                                                    minDate={fechaEntrega}
                                                    startDate={fechaInicial}
                                                    dateFormat="MMMM/yyyy"
                                                    onChange={date => onHandleFechaInicial(date)}
                                                    endDate={fechaFinal}
                                                    showMonthYearPicker
                                                    locale="es"
                                            />                      
                                        </Form.Group>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <Form.Group>
                                            <Form.Label>Fecha final</Form.Label>
                                            <DatePicker className="form-control"
                                                selected={fechaFinal}
                                                onChange={date => onHandleFechaFinal(date)}
                                                selectsEnd
                                                dateFormat="MMMM/yyyy"
                                                autoComplete="off"
                                                startDate={fechaInicial}
                                                endDate={fechaFinal}
                                                minDate={new Date(fechaInicial.getFullYear(), fechaInicial.getMonth(), 1)}
                                                showMonthYearPicker
                                                locale="es"
                                            /> 
                                        </Form.Group>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <Button variant="primary" onClick={onHandleGenerarPeriodo}>Generar Mantenimientos</Button>
                                    </Col>                                    
                                </Row>
                                {mttosGenerar.length > 0 && 
                                <Row className="mt-2">
                                    <Col>
                                        <h6>Mantenimientos a generar</h6>
                                        <ol>
                                            {
                                                mttosGenerar.map((item,i)=>(
                                                    <li key={i}>{moment(item, "YYYY-MM-DD").format("MMMM/YYYY")}</li>
                                                ))
                                            }
                                        </ol>
                                    </Col>
                                </Row>}
                            </Col>
                        </Row>
                </Card.Body>
            </Card>}
        </div>
    )

}